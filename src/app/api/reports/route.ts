import Order from "@/backend/models/Order";
import Payment from "@/backend/models/Payment";
import User from "@/backend/models/User";
import APIReportsFilters from "@/lib/APIReportsFilters";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

async function getTotalValueOfItems(orders: any) {
  let totalValue = 0;
  orders.forEach((order: any) => {
    if (order.orderItems && order.orderItems.length > 0) {
      const orderTotal = order.orderItems.reduce(
        (sum: any, item: any) => sum + item.quantity * item.price,
        0
      );
      totalValue += orderTotal;
    }
  });
  return totalValue;
}

export const GET = async (request: any, res: any) => {
  const sessionRaw = await request.headers.get("session");
  const session = JSON.parse(sessionRaw);
  const token = await request.headers.get("cookie");
  if (!token || session.user.role !== "manager") {
    // Not Signed in
    const notAuthorized = "You are not authorized no no no";
    return new Response(JSON.stringify(notAuthorized), {
      status: 400,
    });
  }

  try {
    await dbConnect();

    // Fetch the orders
    let ordersData = await Order.find({
      orderStatus: { $ne: "cancelada" },
    }).populate({
      path: "user",
      select: "name",
    });

    // Fetch payments related to these orders
    const orderIds = ordersData.map((order: any) => order._id);
    const payments = await Payment.find({ order: { $in: orderIds } }).select(
      "order method"
    );

    // Create a map of orderId -> paymentMethod
    const paymentMethodMap = new Map(
      payments.map((payment: any) => [payment.order.toString(), payment.method])
    );

    // Assign the payment method to the affiliateId field of each order and update the database
    const updatedOrders = await Promise.all(
      ordersData.map(async (order: any) => {
        const paymentMethod = paymentMethodMap.get(order._id.toString());
        order.affiliateId = paymentMethod || "No payment method"; // Assign the payment method or fallback value

        // Update each order in the database with the new affiliateId
        await Order.updateOne(
          { _id: order._id },
          { affiliateId: order.affiliateId }
        );

        return order;
      })
    );

    // Rebuild the query after updating the orders with affiliateId
    let orderQuery = Order.find({ orderStatus: { $ne: "cancelada" } }).populate(
      {
        path: "user",
        select: "name",
      }
    );
    orderQuery = orderQuery.populate({
      path: "branch", // assuming branch holds user _id as string
      select: "name", // fetch only the name field from User
      model: User, // Use User model to populate
    });

    // Continue with filtering logic
    const apiReportsFilters: any = new APIReportsFilters(
      orderQuery,
      request.nextUrl.searchParams
    )
      .searchAllFields()
      .filter();

    let filteredOrdersData = await apiReportsFilters.query;

    const paymentTotals = await filteredOrdersData.reduce(
      (total: any, order: any) => total + order.paymentInfo.amountPaid,
      0
    );

    const orderTotals = await getTotalValueOfItems(filteredOrdersData);
    const itemCount = filteredOrdersData.length;

    filteredOrdersData = filteredOrdersData
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    const orders = {
      orders: filteredOrdersData,
    };

    const dataPacket = {
      orders,
      totalOrderCount: filteredOrdersData.length,
      itemCount,
      paymentTotals,
      orderTotals,
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
