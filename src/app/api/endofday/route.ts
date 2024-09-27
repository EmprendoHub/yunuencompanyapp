import Payment from "@/backend/models/Payment";
import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request: any, res: any) => {
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
    // Get today's date at midnight
    let startOfDay, endOfDay;
    const currentDate = new Date();

    if (process.env.NODE_ENV === "development") {
      // Development: Use UTC for the start of the day
      startOfDay = new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate()
        )
      );

      // Development: End of the day in UTC (23:59:59.999)
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
      // Production: Use local time for start of the day
      startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0);

      // Production: End of the day in local time (23:59:59.999)
      endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999);
    }

    console.log("Start of the day:", startOfDay?.toISOString());
    console.log("End of the day:", endOfDay?.toISOString());
    // // Get yesterday's date at midnight
    // const startOfDay = new Date();
    // startOfDay.setDate(startOfDay.getDate() - 1);
    // startOfDay.setHours(0, 0, 0, 0);

    // // Get today's date at midnight (end of yesterday)
    // const endOfDay = new Date();
    // endOfDay.setDate(endOfDay.getDate() - 1);
    // endOfDay.setHours(23, 59, 59, 999);

    // Find payments between startOfDay and endOfDay
    const paymentQuery = await Payment.aggregate([
      {
        $lookup: {
          from: "orders", // This should match the name of the collection where orders are stored
          localField: "order", // The field in Payment schema
          foreignField: "_id", // The field in Order schema
          as: "orderDetails", // The name of the new array field to hold the joined documents
        },
      },
      {
        $unwind: "$orderDetails", // Deconstructs the 'orderDetails' array
      },
      {
        $match: {
          "orderDetails.branch": "Sucursal", // Match documents where the branch is 'Sucursal'
          "orderDetails.paymentInfo.paymentIntent": "paid",
          pay_date: { $gte: startOfDay, $lte: endOfDay }, // Date range filter
        },
      },
      {
        $sort: { pay_date: -1 }, // Sorting by payment date in descending order
      },
    ]);

    const paymentTotals = await paymentQuery.reduce(
      (total, payment) => total + payment.amount,
      0
    );

    const itemCount = paymentQuery.length;

    const payments = {
      payments: paymentQuery,
    };
    const dataPacket = {
      payments,
      itemCount,
      paymentTotals,
    };

    return new Response(JSON.stringify(dataPacket), { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Payments loading error",
      },
      { status: 500 }
    );
  }
};
