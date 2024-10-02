import Payment from "@/backend/models/Payment";
import Expense from "@/backend/models/Expense"; // Import the Expense model
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request: any, res: any) => {
  const token = await request.headers.get("cookie");
  if (!token) {
    const notAuthorized = "You are not authorized no no no";
    return new Response(JSON.stringify(notAuthorized), {
      status: 400,
    });
  }

  try {
    await dbConnect();

    let startOfDay, endOfDay;
    const currentDate = new Date();
    console.log(token);
    if (process.env.NODE_ENV === "development") {
      startOfDay = new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate()
        )
      );
      endOfDay = new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate(),
          23,
          59,
          59,
          999
        )
      );
    } else if (process.env.NODE_ENV === "production") {
      startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);
      endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);
    }

    // Aggregate payments with orders and expenses
    const paymentQuery = await Payment.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "order",
          foreignField: "_id",
          as: "orderDetails",
        },
      },
      {
        $unwind: "$orderDetails",
      },
      {
        $match: {
          "orderDetails.branch": "Sucursal",
          "orderDetails.paymentInfo.paymentIntent": "paid",
          pay_date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $sort: { pay_date: -1 },
      },
    ]);

    // Aggregate expenses with paymentIntent "pagado"
    const expenseQuery = await Expense.aggregate([
      {
        $match: {
          expenseIntent: "pagado", // Match documents where paymentIntent is 'pagado'
          pay_date: { $gte: startOfDay, $lte: endOfDay }, // Date range filter
        },
      },
      {
        $sort: { pay_date: -1 }, // Sort by expense date in descending order
      },
    ]);

    // Calculate totals for payments and expenses
    const paymentTotals = paymentQuery.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    const expenseTotals = expenseQuery.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    const itemCount = paymentQuery.length + expenseQuery.length;

    const dataPacket = {
      payments: paymentQuery,
      expenses: expenseQuery,
      itemCount,
      totalAmount: paymentTotals - expenseTotals, // Combined total of payments and expenses
    };

    return new Response(JSON.stringify(dataPacket), { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Payments and expenses loading error",
      },
      { status: 500 }
    );
  }
};
