import { newCSTDate } from "@/backend/helpers";
import Customer from "@/backend/models/Customer";
import Order from "@/backend/models/Order";
import Payment from "@/backend/models/Payment";
import Product from "@/backend/models/Product";
import dbConnect from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: any, res: any) {
  const token = await getToken({ req: req });

  if (!token) {
    // Not Signed in
    return new Response("You are not authorized, eh eh eh, no no no", {
      status: 400,
    });
  }
  try {
    const payload = await req.formData();
    let {
      items,
      transactionNo,
      payType,
      amountReceived,
      note,
      email,
      phone,
      name,
      pathname,
    } = Object.fromEntries(payload);

    await dbConnect();
    let customer;
    let customerEmail;
    let customerPhone;
    let customerName;

    if (email.length > 3) {
      customerEmail = email;
    } else {
      if (phone.length > 3 || name.length > 3) {
        customerEmail =
          phone + name.replace(/\s/g, "").substring(0, 8) + "@noemail.com";
      } else {
        customerEmail = "yunuencompany01@gmail.com";
      }
    }

    if (name.length > 3) {
      customerName = name;
    } else {
      customerName = "SUCURSAL";
    }

    const query = { $or: [{ email: customerEmail }, { phone: customerPhone }] };
    if (phone.length > 3) {
      customerPhone = phone;
      query.$or.push({ phone: phone });
    } else {
      customerPhone = "";
    }

    const customerExists = await Customer.findOne(query);

    if (!customerExists) {
      // Generate a random 64-byte token
      const newCustomer = new Customer({
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
      });
      await newCustomer.save();
      customer = newCustomer;
    } else {
      customer = customerExists;
    }
    items = JSON.parse(items);
    const branchId = pathname;
    const ship_cost = 0;
    const date = newCSTDate();

    let paymentInfo;
    let layAwayIntent;
    let currentOrderStatus;
    let payMethod;
    let payIntent;

    if (payType === "layaway") {
      payIntent = "partial";
    } else {
      payIntent = "paid";
    }

    if (transactionNo === "EFECTIVO") {
      payMethod = "EFECTIVO";
    } else if (!isNaN(transactionNo)) {
      payMethod = "TERMINAL";
    }
    if (payType === "layaway") {
      paymentInfo = {
        id: "partial",
        status: "unpaid",
        amountPaid: amountReceived,
        taxPaid: 0,
        paymentIntent: "partial",
      };
      currentOrderStatus = "Apartado";
      layAwayIntent = true;
    } else {
      paymentInfo = {
        id: "paid",
        status: "paid",
        amountPaid: amountReceived,
        taxPaid: 0,
        paymentIntent: "paid",
      };
      currentOrderStatus = "Pagado";
      layAwayIntent = false;
    }

    const cartItems: any[] = [];
    await Promise.all(
      items?.map(async (item: any) => {
        const variationId = item._id.toString();
        const product = await Product.findOne({
          "variations._id": variationId,
        });

        const variation = product.variations.find((variation: any) =>
          variation._id.equals(variationId)
        );
        // Find the stock object for the specified branch
        const stockForBranch = variation.stock.find(
          (stockItem: { branch: any }) => stockItem.branch === branchId
        );

        // Check if there is enough stock for the branch
        if (!stockForBranch || stockForBranch.amount < item.quantity) {
          return {
            error: {
              title: { _errors: ["Este producto no cuenta con existencias"] },
            },
          };
        } else {
          // Reduce the stock amount for the branch
          stockForBranch.amount -= item.quantity;

          // Reduce the overall product stock if needed
          product.stock = product.stock.find(
            (stockItem: { branch: any }) => stockItem.branch === branchId
          );
          if (product.stock) {
            product.stock.amount -= item.quantity;
          }

          // Add the item to the cart
          cartItems.push({
            product: product._id,
            variation: variationId,
            name: item.title,
            color: item.color,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          });

          // Save the updated product
          product.save();
        }
      })
    );

    let orderData = {
      customer: customer._id,
      phone: customer?.phone,
      email: customer?.email,
      customerName: customerName,
      comment: note,
      ship_cost,
      createdAt: date,
      branch: branchId,
      paymentInfo,
      orderItems: cartItems,
      orderStatus: currentOrderStatus,
      layaway: layAwayIntent,
      affiliateId: "",
    };

    let newOrder = await new Order(orderData);
    await newOrder.save();
    const newOrderString = JSON.stringify(newOrder);

    let paymentTransactionData = {
      type: "sucursal",
      paymentIntent: payIntent,
      amount: amountReceived,
      reference: transactionNo,
      pay_date: date,
      method: payMethod,
      order: newOrder?._id,
      customer: newOrder?.customer,
    };
    try {
      const newPaymentTransaction = await new Payment(paymentTransactionData);

      await newPaymentTransaction.save();
    } catch (error) {
      console.log("dBberror", error);
    }

    revalidatePath("/admin/");
    revalidatePath("/puntodeventa/");
    const responseData = {
      message: "Nuevo pedido",
      newOrder: newOrderString,
    };
    return NextResponse.json(responseData, { status: 200 });
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
