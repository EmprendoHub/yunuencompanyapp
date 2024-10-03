import { getTotalFromItems, newCSTDate } from "@/backend/helpers";
import Address from "@/backend/models/Address";
import Order from "@/backend/models/Order";
import Payment from "@/backend/models/Payment";
import Product from "@/backend/models/Product";
import User from "@/backend/models/User";
import dbConnect from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const GET = async (request: any) => {
  const sessionRaw = await request.headers.get("session");
  const session = JSON.parse(sessionRaw);
  if (!session) {
    // Not Signed in
    return new Response("You are not authorized, eh eh eh, no no no", {
      status: 400,
    });
  }
  try {
    await dbConnect();
    const id = await request.headers.get("id");
    let order = await Order.findOne({ _id: id });

    let deliveryAddress = await Address.findOne(order.shippingInfo);
    let orderUser = await User.findOne(order.user);

    const dataPacket = {
      order,
      deliveryAddress,
      orderUser,
    };
    return new Response(JSON.stringify(dataPacket), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Orders loading error",
      },
      { status: 500 }
    );
  }
};

export async function PUT(req: any, res: any) {
  const token = await getToken({ req: req });

  if (!token) {
    // Not Signed in
    return new Response("You are not authorized, eh eh eh, no no no", {
      status: 400,
    });
  }
  try {
    const payload = await req.formData();
    let { transactionNo, paidOn, note, amount, orderId } =
      Object.fromEntries(payload);

    // Define the model name with the suffix appended with the lottery ID
    await dbConnect();
    // Retrieve the dynamically created Ticket model
    const order = await Order.findOne({ _id: orderId });
    // Calculate total amount based on items
    const date = newCSTDate();
    const orderTotal = await getTotalFromItems(order?.orderItems);

    if (order.paymentInfo.amountPaid + Number(amount) >= orderTotal) {
      order.orderStatus = "Entregado";
      order.paymentInfo.status = "Pagado";
    } else {
      order.orderStatus = "Apartado";
      order.paymentInfo.status = "Pendiente";
    }

    order.paymentInfo.amountPaid =
      Number(order.paymentInfo.amountPaid) + Number(amount);

    await order.save();

    let payMethod;
    if (transactionNo === "EFECTIVO") {
      payMethod = "EFECTIVO";
    } else if (!isNaN(transactionNo)) {
      payMethod = "TERMINAL";
    } else {
      payMethod = "EFECTIVO";
    }

    let paymentTransactionData = {
      type: "sucursal",
      paymentIntent: "",
      amount: amount,
      comment: note,
      reference: transactionNo,
      pay_date: date,
      method: payMethod,
      order: order?._id,
      user: order?.user,
    };

    try {
      const newPaymentTransaction = await new Payment(paymentTransactionData);

      await newPaymentTransaction.save();
    } catch (error) {
      console.log("dBberror", error);
    }
    revalidatePath(`/admin/pedidos`);
    revalidatePath(`/admin/pedido/${order?._id}`);
    revalidatePath(`/puntodeventa/pedidos`);
    revalidatePath(`/puntodeventa/pedido/${order?._id}`);
    return NextResponse.json(
      {
        error: "pedido actualizado ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Error al actualizar pedido",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: any) {
  const token = await request.headers.get("cookie");

  if (!token) {
    // Not Signed in
    const notAuthorized = "You are not authorized no no no";
    return new Response(JSON.stringify(notAuthorized), {
      status: 400,
    });
  }

  try {
    await dbConnect();
    const payload = await request.formData();
    let { note, orderId, branchId } = Object.fromEntries(payload);

    const soonToDeleteOrder = await Order.findById(orderId);

    if (!soonToDeleteOrder) {
      return new Response(JSON.stringify("Order not found"), { status: 404 });
    }

    const payment = await Payment.findOne({ order: orderId });

    // Iterate through order items and update Product quantities
    for (const orderItem of soonToDeleteOrder.orderItems) {
      const productId = orderItem.product.toString();
      const product = await Product.findById(productId);

      if (product) {
        // Find the stock entry for the specific branch
        const branchStockIndex = product.stock.findIndex(
          (s: { branch: string }) => s.branch.toString() === branchId
        );

        if (branchStockIndex !== -1) {
          // Update the stock for the specific branch
          await Product.updateOne(
            { _id: productId, "stock.branch": branchId },
            { $inc: { "stock.$.amount": orderItem.quantity } }
          );
        } else {
          // If no stock entry for this branch, create a new one
          await Product.updateOne(
            { _id: productId },
            {
              $push: {
                stock: { branch: branchId, amount: orderItem.quantity },
              },
            }
          );
        }
      }
    }

    const date = newCSTDate();
    const cancelOrder = await Order.findByIdAndUpdate(orderId, {
      orderStatus: "cancelada",
      comment: note,
      updatedAt: date,
      paymentInfo: {
        id: "cancelada",
        status: "cancelada",
        taxPaid: 0,
        amountPaid: 0,
        paymentIntent: "cancelada",
      },
    });

    if (payment) {
      await Payment.findByIdAndUpdate(payment._id, {
        paymentIntent: "cancelado",
        comment: note,
      });
    }

    revalidatePath(`/admin/pedidos`);
    revalidatePath(`/admin/pedido/${orderId}`);
    revalidatePath(`/puntodeventa/pedidos`);
    revalidatePath(`/puntodeventa/pedido/${orderId}`);

    return new Response(JSON.stringify(cancelOrder), { status: 201 });
  } catch (error: any) {
    console.log(error);
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
