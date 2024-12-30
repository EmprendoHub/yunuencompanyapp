"use server";
import Address from "@/backend/models/Address";
import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import {
  AddressEntrySchema,
  ClientPasswordUpdateSchema,
  ClientUpdateSchema,
  PageEntrySchema,
  PageUpdateSchema,
  PostEntrySchema,
  PostUpdateSchema,
  ProductEntrySchema,
  VariationProductEntrySchema,
  VariationUpdateProductEntrySchema,
  VerifyEmailSchema,
} from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import Post from "@/backend/models/Post";
import Product from "@/backend/models/Product";
import User from "@/backend/models/User";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import axios from "axios";
import {
  cstDateTime,
  generateUrlSafeTitle,
  getTotalFromItems,
  newCSTDate,
} from "@/backend/helpers";
import Order from "@/backend/models/Order";
import APIPostsFilters from "@/lib/APIPostsFilters";
import APIFilters from "@/lib/APIFilters";
import APIOrderFilters from "@/lib/APIOrderFilters";
import APIClientFilters from "@/lib/APIClientFilters";
import Page from "@/backend/models/Page";
import Payment from "@/backend/models/Payment";
import Customer from "@/backend/models/Customer";
import Expense from "@/backend/models/Expense";
import APIExpenseFilters from "@/lib/APIExpensesFilters";
import { DateTime } from "luxon";
import mongoose from "mongoose";
import APIReportsFilters from "@/lib/APIReportsFilters";
import { subDays, format } from "date-fns";
import APIPaymentsFilters from "@/lib/APIPaymentsFilters";
import Template from "@/components/bulkmailer/template/Template";
import Comment from "@/backend/models/Comment";

// Function to get the document count for all from the previous month
const getDocumentCountPreviousMonth = async (model: any) => {
  const now = newCSTDate();
  const firstDayOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const lastDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  try {
    const documentCount = await model.countDocuments(
      {
        createdAt: {
          $gte: firstDayOfPreviousMonth,
          $lte: lastDayOfPreviousMonth,
        },
      },
      {
        published: { $ne: "false" },
      }
    );

    return documentCount;
  } catch (error: any) {
    console.error("Error counting documents from the previous month:", error);
    throw error;
  }
};

async function getQuantities(orderItems: any) {
  // Use reduce to sum up the 'quantity' fields
  const totalQuantity = orderItems?.reduce(
    (sum: any, obj: any) => sum + obj.quantity,
    0
  );
  return totalQuantity;
}

const formatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

async function getTotal(orderItems: any) {
  // Use reduce to sum up the 'total' field
  let totalAmount = orderItems?.reduce(
    (acc: number, cartItem: { quantity: number; price: number }) =>
      acc + cartItem.quantity * cartItem.price,
    0
  );
  totalAmount = formatter.format(totalAmount);
  return totalAmount;
}

async function getPendingTotal(orderItems: any[], orderAmountPaid: number) {
  // Use reduce to sum up the 'total' field
  const totalAmount = orderItems?.reduce(
    (acc: number, cartItem: { quantity: number; price: number }) =>
      acc + cartItem.quantity * cartItem.price,
    0
  );
  let pendingAmount: any = totalAmount - orderAmountPaid;
  pendingAmount = formatter.format(pendingAmount);
  return pendingAmount;
}

async function subtotal(order: any) {
  let sub: any = order?.paymentInfo?.amountPaid - order?.ship_cost;
  sub = formatter.format(sub);
  return sub;
}

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

async function getTotalValueOfPayments(payments: any) {
  let totalValue = 0;
  payments.forEach((payment: any) => {
    totalValue += payment.amount;
  });
  return totalValue;
}

export async function generateReports(searchParams: any) {
  const session = await getServerSession(options);
  if (!session || session.user.role !== "manager") {
    throw new Error("You are not authorized");
  }

  try {
    await dbConnect();

    let orderQuery = Order.find({ orderStatus: { $ne: "cancelada" } })
      .populate({
        path: "user",
        select: "name",
      })
      .populate({
        path: "branch",
        select: "name",
        model: User,
      });

    const apiReportsFilters: any = new APIReportsFilters(
      orderQuery,
      new URLSearchParams(searchParams)
    )
      .searchAllFields()
      .filter();

    let filteredOrdersData = await apiReportsFilters.query;

    const paymentTotals = filteredOrdersData.reduce(
      (total: number, order: any) => total + order.paymentInfo.amountPaid,
      0
    );

    const orderTotals = await getTotalValueOfItems(filteredOrdersData);
    const itemCount = filteredOrdersData.length;

    filteredOrdersData.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const dataObject = {
      orders: { orders: filteredOrdersData },
      totalOrderCount: itemCount,
      itemCount,
      paymentTotals,
      orderTotals,
    };
    const dataString = JSON.stringify(dataObject);

    return dataString;
  } catch (error) {
    console.error(error);
    throw new Error("Orders loading error");
  }
}

export async function generatePaymentsExpenseReports(searchParams: any) {
  const session = await getServerSession(options);

  if (!session || session.user.role !== "manager") {
    throw new Error("You are not authorized");
  }

  try {
    await dbConnect();
    let orderQuery;
    let apiReportsFilters: any;
    if (searchParams.type === "Ventas") {
      orderQuery = Order.find({ orderStatus: { $ne: "cancelada" } })
        .populate({
          path: "user",
          select: "name",
        })
        .populate({
          path: "branch",
          select: "name",
          model: User,
        });
      apiReportsFilters = new APIReportsFilters(
        orderQuery,
        new URLSearchParams(searchParams)
      )
        .searchAllFields()
        .filter();
    } else {
      orderQuery = Payment.find({ paymentIntent: { $eq: "pagado" } })
        .populate({
          path: "user",
          select: "name",
        })
        .populate({
          path: "expense",
          model: Expense,
        });

      apiReportsFilters = new APIPaymentsFilters(
        orderQuery,
        new URLSearchParams(searchParams)
      )
        .searchAllFields()
        .filter();
    }

    let filteredOrdersData = await apiReportsFilters.query;

    if (searchParams.type === "Ventas") {
      const paymentTotals = filteredOrdersData.reduce(
        (total: number, order: any) => total + order.paymentInfo.amountPaid,
        0
      );

      const orderTotals = await getTotalValueOfItems(filteredOrdersData);
      const itemCount = filteredOrdersData.length;

      filteredOrdersData.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const dataObject = {
        orders: { orders: filteredOrdersData },
        totalOrderCount: itemCount,
        itemCount,
        paymentTotals,
        orderTotals,
      };
      const dataString = JSON.stringify(dataObject);

      return dataString;
    } else {
      const paymentTotals = filteredOrdersData.reduce(
        (total: number, payment: any) => total + payment.amount,
        0
      );

      const orderTotals = await getTotalValueOfPayments(filteredOrdersData);
      const itemCount = filteredOrdersData.length;
      filteredOrdersData.sort(
        (a: any, b: any) =>
          new Date(b.pay_date).getTime() - new Date(a.pay_date).getTime()
      );

      const dataObject = {
        orders: { orders: filteredOrdersData },
        totalOrderCount: itemCount,
        itemCount,
        paymentTotals,
        orderTotals,
      };

      const dataString = JSON.stringify(dataObject);

      return dataString;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Orders loading error");
  }
}

export async function getProductCategories(token: string, inputSearch: string) {
  const response = await fetch(
    `https://api.mercadolibre.com/sites/MLM/domain_discovery/search?limit=8&q=${inputSearch}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create item");
  }
  const data = await response.json();
  return { data };
}

export async function runRevalidationTo(path: string) {
  try {
    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function payPOSDrawer(data: any) {
  try {
    let { items, transactionNo, payType, amountReceived, note } =
      Object.fromEntries(data);

    await dbConnect();
    let customer;
    let customerEmail = "yunuencompany01@gmail.com";
    let customerPhone = "";
    let customerName = "SUCURSAL";
    const session = await getServerSession(options);
    const userId = session.user._id.toString();

    const customerExists = await Customer.findOne({ email: customerEmail });

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
    const branchInfo = userId;
    const ship_cost = 0;
    const date = cstDateTime();

    let paymentInfo;
    let layAwayIntent;
    let currentOrderStatus;
    let payMethod = payType;
    let payIntent;

    payIntent = "paid";

    paymentInfo = {
      id: "paid",
      status: "paid",
      amountPaid: amountReceived,
      taxPaid: 0,
      paymentIntent: "paid",
    };
    currentOrderStatus = "Pagado";
    layAwayIntent = false;

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
          (stockItem: { branch: any }) => stockItem.branch === userId
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
            (stockItem: { branch: any }) => stockItem.branch === userId
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
      branch: branchInfo,
      paymentInfo,
      orderItems: cartItems,
      orderStatus: currentOrderStatus,
      layaway: layAwayIntent,
      affiliateId: payMethod,
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
    } catch (error: any) {
      console.log("dBberror", error);
    }

    revalidatePath("/admin/");
    revalidatePath("/puntodeventa/");
    return { newOrder: newOrderString };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getDashboard() {
  try {
    await dbConnect();
    let thisWeeksOrder;
    let totalPaymentsThisWeek;
    let totalExpensesThisWeek;
    let dailyOrders;
    let dailyPaymentsTotals;
    let dailyExpensesTotals;
    let monthlyPaymentsTotals;
    let monthlyExpensesTotals;
    let yearlyExpensesTotals;
    let yearlyPaymentsTotals;
    let monthlyOrderBranchTotals;
    let weeklyOrderBranchTotals;

    const cstOffset = 6 * 60 * 60 * 1000; // CST is UTC+6

    const minusCstOffset = -6 * 60 * 60 * 1000; // CST is UTC+6

    // Create a new date with the offset applied
    const today = new Date(Date.now() + minusCstOffset);

    today.setUTCHours(0, 0, 0, 0); // Set time to midnight
    // Set start of the current year
    const startOfYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);

    // Set end of the current year
    const endOfYear = new Date(
      today.getFullYear() + 1,
      0,
      0,
      23, // 23 hours
      59, // 59 minutes
      59, // 59 seconds
      999
    );

    // Set start of the current month
    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1,
      0,
      0,
      0,
      0
    );

    // Set end of the current month
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1, // Next month
      0, // Day 0 of next month is the last day of the current month
      23, // 23 hours
      59, // 59 minutes
      59, // 59 seconds
      999
    );

    // Set start of the current week (Monday)
    const startOfCurrentWeek = new Date(today);
    const dayOfWeek = today.getDay(); // Sunday is 0, Monday is 1, etc.
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calculate offset for Monday
    startOfCurrentWeek.setDate(today.getDate() - offset);
    startOfCurrentWeek.setUTCHours(0, 0, 0, 0); // Set time to midnight

    // Clone the start of the current week to avoid mutating it
    const endOfCurrentWeek = new Date(startOfCurrentWeek);
    endOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + 6); // Add six days to get to the end of the week
    endOfCurrentWeek.setUTCHours(23, 59, 59, 999); // Set time to the end of the day

    // End of the last 7 days (yesterday at 23:59:59.999)
    const endOfLast7Days = new Date(today);
    endOfLast7Days.setDate(today.getDate() - 1); // Go back one day to get yesterday
    endOfLast7Days.setUTCHours(23, 59, 59, 999); // Set to the end of the day

    // Start of the last 7 days (7 days before the end date, at 00:00:00.000)
    const startOfLast7Days = new Date(endOfLast7Days);
    startOfLast7Days.setDate(endOfLast7Days.getDate() - 6); // Go back 6 more days to cover the last 7 days
    startOfLast7Days.setUTCHours(0, 0, 0, 0); // Set to the start of the day

    const startOfLastWeek = new Date(today);
    startOfLastWeek.setDate(startOfCurrentWeek.getDate() - 7);
    startOfLastWeek.setUTCHours(0, 0, 0, 0); // Set time to midnight

    // Clone the start of the current week to avoid mutating it
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Add six days to get to the end of the week
    endOfLastWeek.setUTCHours(23, 59, 59, 999); // Set time to the end of the day

    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
      0,
      0,
      0
    );
    startOfLastMonth.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC

    // Set end of the last month
    const endOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(), // First day of the current month, but setting day to 0 gives the last day of the previous month
      0,
      23,
      59,
      59,
      999
    );

    const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    startOfLastYear.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC

    // Clone the start of the current week to avoid mutating it
    const endOfLastYear = new Date(startOfLastYear);
    endOfLastYear.setDate(startOfLastYear.getDate() + 364); // Add six days to get to the end of the week
    endOfLastYear.setUTCHours(23, 59, 59, 999); // Set time to the end of the day

    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getUTCDate(),
      0,
      0,
      0,
      0
    );

    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getUTCDate(),
      23,
      59,
      59,
      999
    );

    // Calculate yesterday's date
    const yesterday = new Date(today);
    // Set start and end of yesterday
    yesterday.setDate(today.getDate() - 1); // Set it to yesterday
    const endOfYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getUTCDate(),
      23,
      59,
      59,
      999
    );

    let weeklyPaymentData: any = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfLast7Days,
            $lt: endOfLast7Days,
          },
          orderStatus: "Pagado", // Add filter for paymentIntent
        },
      },
      {
        $group: {
          // Group by day using the $dateToString operator
          _id: { $dateToString: { format: "%m-%d-%Y", date: "$createdAt" } },
          totalAmount: { $sum: "$paymentInfo.amountPaid" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0, // Optional: Remove the _id field
          date: "$_id", // Rename _id to date
          Total: "$totalAmount", // Rename totalAmount to Total
          count: 1, // Include the count field as is
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date in ascending order
      },
    ]);

    // Step 2: Query the database
    let weeklyExpenseData: any = await Expense.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfLast7Days,
            $lt: endOfLast7Days,
          },
          expenseIntent: "pagado",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%m-%d-%Y", date: "$pay_date" } },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          Total: "$totalAmount",
          count: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    const last7DaysArray = Array.from({ length: 8 }, (_, i) =>
      format(subDays(startOfToday, i), "MM-dd-yyyy")
    ).reverse(); // Ascending order

    weeklyExpenseData = last7DaysArray.map((date: any) => {
      const dayData = weeklyExpenseData.find((data: any) => data.date === date);
      return dayData || { date, Total: 0, count: 0 };
    });

    let dailyData: any = await Payment.aggregate([
      // Match documents for the desired day
      {
        $match: {
          // Filter documents based on the pay_date field
          pay_date: {
            $gte: startOfToday, // Start of the day
            $lt: endOfToday, // End of the day
          },
          paymentIntent: { $ne: "cancelado" },
        },
      },
      // Group documents by day
      {
        $group: {
          // Group by day using the $dateToString operator on the pay_date field
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$pay_date" } }, // Group by date in YYYY-MM-DD format
          totalAmount: { $sum: "$amount" }, // Sum up the amount field for each day
          count: { $sum: 1 }, // Count the number of payments for each day (optional)
        },
      },
    ]);

    dailyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfToday,
            $lt: endOfToday,
          },
        },
      },
      {
        $unwind: "$orderItems",
      },
      {
        $group: {
          _id: {
            orderStatus: "$orderStatus",
            orderId: "$orderId",
            _id: "$_id",
          },
          total: { $sum: "$orderItems.price" },
        },
      },
      {
        $project: {
          _id: "$_id._id",
          total: 1,
          orderStatus: "$_id.orderStatus",
          orderId: "$_id.orderId",
        },
      },
    ]);
    dailyPaymentsTotals = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfToday,
            $lt: endOfToday,
          },
          orderStatus: { $ne: "cancelada" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$paymentInfo.amountPaid" }, // Sum up the amount field for each payment
        },
      },
    ]);

    dailyExpensesTotals = await Expense.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfToday,
            $lt: endOfToday,
          },
          expenseIntent: { $ne: "cancelada" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }, // Sum up the amount field for each payment
        },
      },
    ]);

    // Perform aggregation to get yesterday's totals
    let yesterdaysPaymentsTotals = await Payment.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfToday,
            $lt: endOfToday,
          },
          paymentIntent: { $ne: "cancelado" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }, // Sum up the amount field for each payment
        },
      },
    ]);

    // Perform aggregation to get last weeks totals
    let lastWeeksPaymentsTotals = await Payment.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfCurrentWeek,
            $lt: endOfCurrentWeek,
          },
          paymentIntent: { $ne: "cancelado" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }, // Sum up the amount field for each payment
        },
      },
    ]);

    // Perform aggregation to get last months totals
    let lastMonthsPaymentsTotals = await Payment.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
          paymentIntent: { $ne: "cancelado" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }, // Sum up the amount field for each payment
        },
      },
    ]);

    // Perform aggregation to get last months totals
    let lastYearsPaymentsTotals = await Payment.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
          paymentIntent: { $ne: "cancelado" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }, // Sum up the amount field for each payment
        },
      },
    ]);

    thisWeeksOrder = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfCurrentWeek,
            $lt: endOfCurrentWeek,
          },
        },
      },
      {
        $unwind: "$orderItems", // Deconstruct the orderItems array
      },
      {
        $group: {
          _id: {
            orderStatus: "$orderStatus",
            orderId: "$orderId", // Include orderId in the _id
            _id: "$_id", // Include _id in the _id
          },
          total: { $sum: "$orderItems.price" }, // Calculate the total sum of prices
        },
      },
      {
        $project: {
          _id: "$_id._id", // Project the _id from _id
          total: 1,
          orderStatus: "$_id.orderStatus",
          orderId: "$_id.orderId", // Project orderId
        },
      },
    ]);

    totalPaymentsThisWeek = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfCurrentWeek,
            $lt: endOfCurrentWeek,
          },
          orderStatus: { $ne: "cancelada" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$paymentInfo.amountPaid" }, // Sum up the amount field for each payment
        },
      },
    ]);

    totalExpensesThisWeek = await Expense.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfCurrentWeek,
            $lt: endOfCurrentWeek,
          },
          expenseIntent: { $ne: "cancelada" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }, // Sum up the amount field for each payment
        },
      },
    ]);

    // Perform aggregation to get this month's totals
    monthlyPaymentsTotals = await Payment.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
          paymentIntent: { $ne: "cancelado" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }, // Sum up the amount field for each payment
        },
      },
    ]);

    // Perform aggregation to get this month's totals
    let monthlyOrderTotals = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
          orderStatus: { $ne: "cancelada" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$paymentInfo.amountPaid" }, // Sum up the amount field for each payment
        },
      },
    ]);

    monthlyExpensesTotals = await Expense.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
          expenseIntent: { $ne: "cancelada" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }, // Sum up the amount field for each payment
        },
      },
    ]);

    // Perform aggregation to get this year's totals
    yearlyPaymentsTotals = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
          orderStatus: { $ne: "cancelada" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$paymentInfo.amountPaid" }, // Sum up the amount field for each payment
        },
      },
    ]);

    yearlyExpensesTotals = await Expense.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
          expenseIntent: { $ne: "cancelada" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }, // Sum up the amount field for each payment
        },
      },
    ]);

    // Perform aggregation to sum up all orderItems quantities for valid orders
    let totalProductsSoldThisMonth = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
          orderStatus: { $ne: "cancelada" },
        },
      },
      {
        $unwind: "$orderItems", // Unwind the orderItems array
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$orderItems.quantity" }, // Sum up the quantity field in orderItems
        },
      },
    ]);

    monthlyOrderBranchTotals = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
          orderStatus: { $ne: "cancelada" },
        },
      },
      {
        $group: {
          _id: "$branch", // Group by the 'branch' field
          totalAmountPaid: { $sum: "$paymentInfo.amountPaid" },
        },
      },
      {
        $addFields: { branchObjectId: { $toObjectId: "$_id" } }, // Convert string 'branch' to ObjectId
      },
      {
        $lookup: {
          from: "users",
          localField: "branchObjectId", // Use the converted ObjectId
          foreignField: "_id",
          as: "branchInfo",
        },
      },
      {
        $unwind: "$branchInfo",
      },
      {
        $project: {
          _id: 1,
          totalAmountPaid: 1,
          branchName: "$branchInfo.name",
        },
      },
    ]);

    weeklyOrderBranchTotals = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfCurrentWeek,
            $lt: endOfCurrentWeek,
          },
          orderStatus: { $ne: "cancelada" },
        },
      },
      {
        $group: {
          _id: "$branch", // Group by the 'branch' field
          totalAmountPaid: { $sum: "$paymentInfo.amountPaid" },
        },
      },
      {
        $addFields: { branchObjectId: { $toObjectId: "$_id" } }, // Convert string 'branch' to ObjectId
      },
      {
        $lookup: {
          from: "users",
          localField: "branchObjectId", // Use the converted ObjectId
          foreignField: "_id",
          as: "branchInfo",
        },
      },
      {
        $unwind: "$branchInfo",
      },
      {
        $project: {
          _id: 1,
          totalAmountPaid: 1,
          branchName: "$branchInfo.name",
        },
      },
    ]);

    let weekByWeekPaymentData: any = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfLastMonth, // Adjust this range if you want more than just the last 60 days
            $lt: endOfMonth,
          },
          orderStatus: "Pagado", // Add filter for paymentIntent
        },
      },
      {
        $group: {
          // Group by week and year using $isoWeek and $isoWeekYear to avoid mixing weeks from different years
          _id: {
            week: { $isoWeek: "$createdAt" }, // Extract the ISO week number
            year: { $isoWeekYear: "$createdAt" }, // Extract the ISO week year
          },
          totalAmount: { $sum: "$paymentInfo.amountPaid" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0, // Optional: Remove the _id field
          week: "$_id.week", // Keep the week number
          year: "$_id.year", // Keep the year
          total: "$totalAmount", // Rename totalAmount to Total
          count: 1, // Include the count field as is
        },
      },
      {
        $sort: { year: 1, week: 1 }, // Sort by year and week in ascending order
      },
    ]);

    let weekByWeekExpenseData: any = await Expense.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfLastMonth,
            $lt: endOfMonth,
          },
          expenseIntent: "pagado", // Add filter for paymentIntent
        },
      },
      {
        $group: {
          // Group by week and year using $isoWeek and $isoWeekYear to avoid mixing weeks from different years
          _id: {
            week: { $isoWeek: "$pay_date" }, // Extract the ISO week number
            year: { $isoWeekYear: "$pay_date" }, // Extract the ISO week year
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0, // Optional: Remove the _id field
          date: "$_id", // Rename _id to date
          total: "$totalAmount", // Rename totalAmount to Total
          count: 1, // Include the count field as is
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date in ascending order
      },
    ]);

    const totalOrderCount = await Order.countDocuments({
      orderStatus: { $ne: "Cancelado" },
    });
    const totalPostCount = await Post.countDocuments();
    const totalCustomerCount = await Customer.countDocuments({
      name: { $ne: "SUCURSAL" },
    });

    const orderCountPreviousMonth = await getDocumentCountPreviousMonth(Order);

    dailyOrders = JSON.stringify(dailyOrders);
    weeklyPaymentData = JSON.stringify(weeklyPaymentData);
    weeklyExpenseData = JSON.stringify(weeklyExpenseData);
    dailyData = JSON.stringify(dailyData);
    thisWeeksOrder = JSON.stringify(thisWeeksOrder);
    monthlyOrderBranchTotals = JSON.stringify(monthlyOrderBranchTotals);
    weeklyOrderBranchTotals = JSON.stringify(weeklyOrderBranchTotals);
    weekByWeekPaymentData = JSON.stringify(weekByWeekPaymentData);
    weekByWeekExpenseData = JSON.stringify(weekByWeekExpenseData);

    totalPaymentsThisWeek = totalPaymentsThisWeek[0]?.total;
    totalExpensesThisWeek = totalExpensesThisWeek[0]?.total;

    dailyPaymentsTotals = dailyPaymentsTotals[0]?.total;
    dailyExpensesTotals = dailyExpensesTotals[0]?.total;

    yesterdaysPaymentsTotals = yesterdaysPaymentsTotals[0]?.total;
    totalProductsSoldThisMonth = totalProductsSoldThisMonth[0]?.total;
    monthlyPaymentsTotals = monthlyPaymentsTotals[0]?.total;
    monthlyOrderTotals = monthlyOrderTotals[0]?.total;
    monthlyExpensesTotals = monthlyExpensesTotals[0]?.total;
    yearlyExpensesTotals = yearlyExpensesTotals[0]?.total;

    yearlyPaymentsTotals = yearlyPaymentsTotals[0]?.total;

    lastWeeksPaymentsTotals = lastWeeksPaymentsTotals[0]?.total;
    lastMonthsPaymentsTotals = lastMonthsPaymentsTotals[0]?.total;
    lastYearsPaymentsTotals = lastYearsPaymentsTotals[0]?.total;
    return {
      dailyData: dailyData,
      weeklyPaymentData: weeklyPaymentData,
      weeklyExpenseData: weeklyExpenseData,
      weekByWeekExpenseData: weekByWeekExpenseData,
      weekByWeekPaymentData: weekByWeekPaymentData,
      dailyOrders: dailyOrders,
      monthlyOrderBranchTotals: monthlyOrderBranchTotals,
      weeklyOrderBranchTotals: weeklyOrderBranchTotals,
      dailyPaymentsTotals: dailyPaymentsTotals,
      dailyExpensesTotals: dailyExpensesTotals,
      yesterdaysPaymentsTotals: yesterdaysPaymentsTotals,
      thisWeeksOrder: thisWeeksOrder,
      totalProductsSoldThisMonth: totalProductsSoldThisMonth,
      totalOrderCount: totalOrderCount,
      totalCustomerCount: totalCustomerCount,
      orderCountPreviousMonth: orderCountPreviousMonth,
      totalPaymentsThisWeek: totalPaymentsThisWeek,
      totalExpensesThisWeek: totalExpensesThisWeek,
      monthlyExpensesTotals: monthlyExpensesTotals,
      monthlyPaymentsTotals: monthlyPaymentsTotals,
      monthlyOrderTotals: monthlyOrderTotals,
      yearlyPaymentsTotals: yearlyPaymentsTotals,
      yearlyExpensesTotals: yearlyExpensesTotals,
      totalPostCount: totalPostCount,
      lastWeeksPaymentsTotals: lastWeeksPaymentsTotals,
      lastMonthsPaymentsTotals: lastMonthsPaymentsTotals,
      lastYearsPaymentsTotals: lastYearsPaymentsTotals,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getPOSDashboard() {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orders: any;
    let todaysOrders: any;
    let products: any;
    let thisWeeksOrder: any;
    let totalOrdersThisWeek: any;
    let dailyOrders: any;
    let dailyOrdersTotals: any | undefined;

    const today = newCSTDate();
    today.setUTCHours(0, 0, 0, 0); // Set time to midnight

    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - today.getDay());
    startOfCurrentWeek.setUTCHours(0, 0, 0, 0); // Set time to midnight

    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0
    );

    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      0,
      0
    );

    if (session) {
      if (session?.user?.role === "sucursal") {
        orders = await Order.find({ orderStatus: { $ne: "Cancelado" } })
          .sort({ createdAt: -1 }) // Sort in descending order of creation date
          .limit(5);

        dailyOrders = await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfToday,
                $lt: endOfToday,
              },
            },
          },
          {
            $unwind: "$orderItems",
          },
          {
            $group: {
              _id: {
                orderStatus: "$orderStatus",
                orderId: "$orderId",
                _id: "$_id",
              },
              total: { $sum: "$orderItems.price" },
            },
          },
          {
            $project: {
              _id: "$_id._id",
              total: 1,
              orderStatus: "$_id.orderStatus",
              orderId: "$_id.orderId",
            },
          },
        ]);
        dailyOrdersTotals = await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfToday,
                $lt: endOfToday,
              },
            },
          },
          {
            $unwind: "$orderItems",
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$orderItems.price" },
            },
          },
        ]);

        thisWeeksOrder = await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfCurrentWeek,
                $lt: today,
              },
            },
          },
          {
            $unwind: "$orderItems", // Deconstruct the orderItems array
          },
          {
            $group: {
              _id: {
                orderStatus: "$orderStatus",
                orderId: "$orderId", // Include orderId in the _id
                _id: "$_id", // Include _id in the _id
              },
              total: { $sum: "$orderItems.price" }, // Calculate the total sum of prices
            },
          },
          {
            $project: {
              _id: "$_id._id", // Project the _id from _id
              total: 1,
              orderStatus: "$_id.orderStatus",
              orderId: "$_id.orderId", // Project orderId
            },
          },
        ]);
        totalOrdersThisWeek = await Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfCurrentWeek,
                $lt: today,
              },
            },
          },
          {
            $unwind: "$orderItems", // Deconstruct the orderItems array
          },
          {
            $group: {
              _id: null, // Group all documents without any specific criteria
              total: { $sum: "$orderItems.price" }, // Calculate the total sum of prices
            },
          },
        ]);

        products = await Product.find({ published: { $ne: "false" } })
          .sort({ createdAt: -1 }) // Sort in descending order of creation date
          .limit(5);
      }
    }

    const totalOrderCount = await Order.countDocuments({
      orderStatus: { $ne: "Cancelado" },
    });
    const totalProductCount = await Product.countDocuments({
      published: { $ne: "false" },
    });
    const orderCountPreviousMonth = await getDocumentCountPreviousMonth(Order);

    orders = JSON.stringify(orders);
    dailyOrders = JSON.stringify(dailyOrders);

    products = JSON.stringify(products);
    thisWeeksOrder = JSON.stringify(thisWeeksOrder);
    const thisWeekOrderTotals = totalOrdersThisWeek[0]?.total;
    dailyOrdersTotals = dailyOrdersTotals[0]?.total;
    return {
      orders: orders,
      dailyOrders: dailyOrders,
      dailyOrdersTotals: dailyOrdersTotals,
      thisWeeksOrder: thisWeeksOrder,
      products: products,
      totalOrderCount: totalOrderCount,
      orderCountPreviousMonth: orderCountPreviousMonth,
      totalProductCount: totalProductCount,
      thisWeekOrderTotals: thisWeekOrderTotals,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOnePost(slug: any) {
  try {
    await dbConnect();

    let post = await Post.findOne({ slug: slug });
    const postCategory = post.category;
    // Find products matching any of the tag values
    let trendingProducts: any = await Product.find({
      "tags.value": postCategory,
    }).limit(4);

    // convert to string
    post = JSON.stringify(post);
    trendingProducts = JSON.stringify(trendingProducts);

    return { post: post, trendingProducts: trendingProducts };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllPost(searchQuery: any) {
  const session = await getServerSession(options);

  try {
    await dbConnect();
    let postQuery;
    if (session) {
      if (session?.user?.role === "manager") {
        postQuery = Post.find({});
      } else {
        postQuery = Post.find({ published: true });
      }
    } else {
      postQuery = Post.find({ published: true });
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get("page")) || 1;
    // total number of documents in database
    const itemCount = await Post.countDocuments();
    // Extract all possible categories
    const allCategories = await Post.distinct("category");

    // Apply search Filters
    const apiPostFilters: any = new APIPostsFilters(postQuery, searchParams)
      .searchAllFields()
      .filter();

    let postsData = await apiPostFilters.query;

    const filteredPostsCount = postsData.length;

    // Pagination filter
    apiPostFilters.pagination(resPerPage, page);
    postsData = await apiPostFilters.query.clone();

    let sortedPosts = postsData
      .slice()
      .sort(
        (a: { createdAt: string }, b: { createdAt: string }) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    sortedPosts = JSON.stringify(sortedPosts);
    return {
      posts: sortedPosts,
      itemCount: itemCount,
      filteredPostsCount: filteredPostsCount,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOneOrder(id: any) {
  try {
    await dbConnect();

    let order = await Order.findOne({ _id: id });
    let orderPayments: any = await Payment.find({ order: order._id });
    let customer = await Customer.findOne({ email: order.email });

    // convert to string
    order = JSON.stringify(order);
    orderPayments = JSON.stringify(orderPayments);
    customer = JSON.stringify(customer);

    return {
      order: order,
      customer: customer,
      orderPayments: orderPayments,
    };
    // return { product };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllOrder(searchQuery: any) {
  try {
    await dbConnect();
    // Enable profiling for all database operations (level 2)

    const session = await getServerSession(options);
    let orderQuery;

    orderQuery = Order.find({ orderStatus: { $ne: "Cancelado" } }).populate(
      "user"
    );

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get("perpage")) || 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get("page")) || 1;
    // Apply descending order based on a specific field (e.g., createdAt)
    orderQuery = orderQuery.sort({ createdAt: -1 });
    const totalOrderCount = await Order.countDocuments();

    // Apply search Filters including order_id and orderStatus
    const apiOrderFilters: any = new APIOrderFilters(
      orderQuery,
      searchParams
    ).searchAllFields();

    let ordersData = await apiOrderFilters.query;

    const itemCount = ordersData.length;
    apiOrderFilters.pagination(resPerPage, page);
    ordersData = await apiOrderFilters.query.clone();

    let orders = JSON.stringify(ordersData);

    return {
      orders: orders,
      totalOrderCount: totalOrderCount,
      itemCount: itemCount,
      resPerPage: resPerPage,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function updateOneOrder(data: any) {
  try {
    let { transactionNo, paidOn, note, amount, orderId } =
      Object.fromEntries(data);
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
    } catch (error: any) {
      console.log("dBberror", error);
    }
    revalidatePath(`/admin/pedidos`);
    revalidatePath(`/admin/pedido/${order?._id}`);
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function changeOrderNoteStatus(data: any) {
  try {
    let { orderId, note, orderStatus } = Object.fromEntries(data);
    const newStatus = orderStatus;
    const newNote = note;
    await dbConnect();
    const date = cstDateTime();

    const updateOrder = await Order.updateOne(
      { _id: orderId },
      {
        orderStatus: newStatus,
        comment: newNote,
        updatedAt: date,
      }
    );
    return {
      ok: true,
    };
  } catch (error: any) {
    throw Error(error);
  }
}

export async function getAllPOSOrder(searchQuery: any) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orderQuery: any;
    if (session?.user?.role === "sucursal") {
      orderQuery = Order.find({
        $and: [
          { branch: session?.user?._id.toString() },
          { orderStatus: { $ne: "Cancelado" } },
        ],
      }).populate("user");
    }

    const searchParams = new URLSearchParams(searchQuery);

    const resPerPage = Number(searchParams.get("perpage")) || 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get("page")) || 1;
    // Apply descending order based on a specific field (e.g., createdAt)
    orderQuery = orderQuery.sort({ createdAt: -1 });

    // Apply search Filters including order_id and orderStatus
    const apiOrderFilters: any = new APIOrderFilters(orderQuery, searchParams)
      .searchAllFields()
      .filter();
    let ordersData = await apiOrderFilters.query;

    const itemCount = ordersData.length;

    apiOrderFilters.pagination(resPerPage, page);
    ordersData = await apiOrderFilters.query.clone();
    let orders = JSON.stringify(ordersData);

    return {
      orders: orders,
      itemCount: itemCount,
      resPerPage: resPerPage,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getEndOfDayReport(searchQuery: any) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    const currentDate = DateTime.now().setZone("America/Mexico_City");
    const userId = session?.user?._id.toString();
    let startOfDay, endOfDay;
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "production"
    ) {
      // Get the start of the day in local time and convert it to UTC
      startOfDay = currentDate
        .startOf("day")
        .toUTC()
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .toJSDate();
      // Get the end of the day in local time and convert it to UTC
      endOfDay = currentDate
        .startOf("day")
        .toUTC()
        .set({ hour: 23, minute: 59, second: 59, millisecond: 999 })
        .toJSDate();
    }

    // To see it properly in the log:
    // Aggregate payments with orders and expenses
    let paymentQuery = await Payment.aggregate([
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
          "orderDetails.branch": userId,
          "orderDetails.paymentInfo.paymentIntent": "paid",
          pay_date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $addFields: {
          isTerminal: { $eq: ["$method", "TERMINAL"] }, // Mark if the payment method is TERMINAL
          isTransfer: { $eq: ["$method", "TRANSFERENCIA"] }, // Mark if the payment method is TRANSFER
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ["$isTerminal", false] },
                    { $eq: ["$isTransfer", false] },
                  ],
                },
                then: "$amount",
                else: 0, // Ignore TERMINAL in totalAmount sum
              },
            },
          },
          payments: { $push: "$$ROOT" }, // Keep all payments, including TERMINAL
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          payments: 1,
        },
      },
    ]);

    const paymentTotals = paymentQuery[0]?.totalAmount || 0;
    paymentQuery = paymentQuery[0]?.payments;
    // Aggregate expenses with paymentIntent "pagado"
    const expenseQuery = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(session?.user?._id), // Convert string ID to ObjectId
          expenseIntent: "pagado", // Match documents where paymentIntent is 'pagado'
          pay_date: { $gte: startOfDay, $lte: endOfDay }, // Date range filter
        },
      },
      {
        $sort: { pay_date: -1 }, // Sort by expense date in descending order
      },
    ]);

    const expenseTotals = expenseQuery.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    const itemCount = paymentQuery?.length + expenseQuery.length;

    const dataPacket = {
      payments: paymentQuery,
      expenses: expenseQuery,
      itemCount,
      totalAmount: paymentTotals - expenseTotals,
    };
    const dataString = JSON.stringify(dataPacket);

    return dataString;
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllPOSOExpenses(searchQuery: any) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let expenseQuery: any;

    if (session?.user?.role === "sucursal") {
      expenseQuery = Expense.find({
        $and: [
          { user: session?.user?._id.toString() },
          { expenseIntent: { $ne: "cancelado" } },
        ],
      }).populate("user");
    }

    const searchParams = new URLSearchParams(searchQuery);

    const resPerPage = Number(searchParams.get("perpage")) || 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get("page")) || 1;
    // Apply descending expense based on a specific field (e.g., createdAt)
    expenseQuery = expenseQuery.sort({ pay_date: -1 });

    // Apply search Filters including expense_id and expenseStatus
    const apiExpenseFilters: any = new APIExpenseFilters(
      expenseQuery,
      searchParams
    )
      .searchAllFields()
      .filter();
    let expensesData = await apiExpenseFilters.query;

    const itemCount = expensesData.length;

    apiExpenseFilters.pagination(resPerPage, page);
    expensesData = await apiExpenseFilters.query.clone();
    let expenses = JSON.stringify(expensesData);

    return {
      expenses: expenses,
      itemCount: itemCount,
      resPerPage: resPerPage,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllExpenses(searchQuery: any) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let expenseQuery: any;

    expenseQuery = Expense.find({
      $and: [{ expenseIntent: { $ne: "cancelado" } }],
    }).populate("user");

    const searchParams = new URLSearchParams(searchQuery);

    const resPerPage = Number(searchParams.get("perpage")) || 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get("page")) || 1;
    // Apply descending expense based on a specific field (e.g., createdAt)
    expenseQuery = expenseQuery.sort({ pay_date: -1 });

    // Apply search Filters including expense_id and expenseStatus
    const apiExpenseFilters: any = new APIExpenseFilters(
      expenseQuery,
      searchParams
    )
      .searchAllFields()
      .filter();
    let expensesData = await apiExpenseFilters.query;

    const itemCount = expensesData.length;

    apiExpenseFilters.pagination(resPerPage, page);
    expensesData = await apiExpenseFilters.query.clone();
    let expenses = JSON.stringify(expensesData);

    return {
      expenses: expenses,
      itemCount: itemCount,
      resPerPage: resPerPage,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllPOSBranches() {
  try {
    await dbConnect();
    const allBranches: any = await User.find({
      $and: [{ role: "sucursal" }],
    });

    const branches = JSON.stringify(allBranches);

    return branches;
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOneProduct(slug: any, id: any = "") {
  try {
    await dbConnect();
    let product;
    if (id) {
      product = await Product.findOne({ _id: id });
    } else {
      product = await Product.findOne({ slug: slug });
    }

    // convert to string
    product = JSON.stringify(product);
    return { product: product };
    // return { product };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function createOneExpense(data: any) {
  const session = await getServerSession(options);
  if (session.user.role !== "manager") {
    // Return immediately if not authorized
    throw Error("Unauthorized");
  }
  try {
    await dbConnect();

    let { userId, type, amount, reference, method, comment, startDate } =
      Object.fromEntries(data);

    const workingId = userId ? userId : session?.user?._id;
    const user = { _id: workingId };
    const pay_date = startDate;
    const expenseIntent = "pagado";

    const newExpense = new Expense({
      type,
      amount,
      reference,
      expenseIntent,
      method,
      comment,
      pay_date,
      user,
    });

    // Save the Product to the database
    await newExpense.save();
    const expenseId = newExpense._id;
    let paymentTransactionData = {
      type: type,
      paymentIntent: "pagado",
      amount: -Math.abs(amount), // Ensure the amount is negative,
      reference: comment,
      pay_date,
      method,
      expense: expenseId,
      user,
    };
    const newPaymentTransaction = await new Payment(paymentTransactionData);
    await newPaymentTransaction.save();
    revalidatePath(`/admin/gastos`);
    revalidatePath(`/puntodeventa/gastos`);
    return { status: "success" };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function deleteOneExpense(data: any) {
  const session = await getServerSession(options);
  if (session.user.role !== "manager") {
    // Return immediately if not authorized
    throw Error("Unauthorized");
  }
  try {
    await dbConnect();

    let { note, expenseId } = Object.fromEntries(data);
    const soonToDeleteExpense = await Expense.findById(expenseId);

    if (!soonToDeleteExpense) {
      const notFoundResponse = "Expense not found";
      return new Response(JSON.stringify(notFoundResponse), { status: 404 });
    }
    const payment = await Payment.findOne({ expense: expenseId });
    // Iterate through order items and update Product quantities

    const cancelExpense = await Expense.findByIdAndUpdate(expenseId, {
      expenseIntent: "cancelada",
      comment: note,
    });

    await Payment.findByIdAndUpdate(payment._id, {
      paymentIntent: "cancelado",
      comment: note,
    });

    revalidatePath(`/admin/gastos`);
    revalidatePath(`/admin/gastos/gasto/${expenseId}`);
    revalidatePath(`/puntodeventa/gastos`);
    revalidatePath(`/puntodeventa/gastos/gasto/${expenseId}`);

    return { status: "success" };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOneExpense(id: any = "") {
  try {
    await dbConnect();
    let expense = await Expense.findOne({ _id: id });

    // convert to string
    expense = JSON.stringify(expense);
    return { expense: expense };
    // return { product };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOneProductWithTrending(slug: string, id: string) {
  try {
    await dbConnect();
    let product;
    if (id) {
      product = await Product.findOne({ _id: id });
    } else {
      product = await Product.findOne({ slug: slug });
    }
    let trendingProducts: any = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);
    // convert to string
    product = JSON.stringify(product);
    trendingProducts = JSON.stringify(trendingProducts);
    return { product: product, trendingProducts: trendingProducts };
    // return { product };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function updateProductQuantity(variationId: any) {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let product = await Product.findOne({ "variations._id": variationId });
    const session = await getServerSession(options);
    const userId = session.user._id.toString();

    if (product) {
      // Find the variation within the variations array
      let variation = product.variations.find(
        (variation: any) => variation._id.toString() === variationId
      );
      const stockForBranch = variation.stock.find(
        (stockItem: { branch: any }) => stockItem.branch === userId
      );
      // Update the stock of the variation
      stockForBranch.amount -= 1; // Example stock update
      // Save the product to persist the changes
      await product.save();
    } else {
      console.log("Product not found");
      throw Error("Product not found");
    }
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function changeProductStatus(productId: any) {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let product = await Product.findOne({ _id: productId });

    if (product.active === true) {
      product.active = false; // Deactivate Product
    } else {
      product.active = true; // ReActivate Product
    }
    // Save the product to persist the changes
    await product.save();
    revalidatePath("/admin/productos");
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function deleteOneProduct(productId: any) {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    await Product.findOneAndDelete({ _id: productId });

    revalidatePath("/admin/productos");
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function changeProductAvailability(productId: any, location: any) {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let product = await Product.findOne({ _id: productId });
    if (location === "Branch") {
      if (product.availability.branch === true) {
        product.availability.branch = false; // Remove from physical branch
      } else {
        product.availability.branch = true; // Add to physical branch
      }
    } else if (location === "Online") {
      if (product.availability.online === true) {
        product.availability.online = false; // Remove from physical branch
      } else {
        product.availability.online = true; // Add to physical branch
      }
    }
    // Save the product to persist the changes
    await product.save();
    revalidatePath("/admin/productos");
    revalidatePath("/puntodeventa/tienda");
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getVariationStock(variationId: any) {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let product = await Product.findOne({ "variations._id": variationId });
    const session = await getServerSession(options);
    const userId = session.user._id.toString();

    if (product) {
      // Find the variation within the variations array
      let variation = product.variations.find(
        (variation: any) => variation._id.toString() === variationId
      );
      const stockForBranch = variation.stock.find(
        (stockItem: { branch: any }) => stockItem.branch === userId
      );

      return { currentStock: stockForBranch.amount };
    } else {
      throw Error("Product not found");
    }
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getOnePOSProduct(variationId: any) {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let product = await Product.findOne({ "variations._id": variationId });

    if (product) {
      // Find the variation within the variations array
      let variation = product.variations.find(
        (variation: any) => variation._id.toString() === variationId
      );

      // Add product name and brand to the variation
      let { title, brand } = product;
      variation = {
        ...variation.toObject(), // Convert Mongoose document to plain object
        title: title,
        brand: brand,
      };

      // convert to string
      product = JSON.stringify(product);
      variation = JSON.stringify(variation);
      return {
        product: product,
        variation: variation,
        error: JSON.stringify("Producto no encontrado"),
      };
    } else {
      return {
        error: JSON.stringify("Producto no encontrado"),
        product: JSON.stringify({ product: "" }),
        variation: JSON.stringify({ variation: "" }),
      };
    }
  } catch (error: any) {
    return {
      error: JSON.stringify("Código Incorrecto"),
      product: JSON.stringify({ product: "" }),
      variation: JSON.stringify({ variation: "" }),
    };
  }
}

export async function getAllPOSProductOld(searchQuery: any) {
  try {
    await dbConnect();
    let productQuery;
    // Find the product that contains the variation with the specified variation ID
    productQuery = Product.find({
      $and: [{ stock: { $gt: 0 } }, { "availability.branch": true }],
    });

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get("perpage")) || 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get("page")) || 1;
    // total number of documents in database
    const productsCount = await Product.countDocuments();
    // Apply search Filters
    const apiProductFilters: any = new APIFilters(productQuery, searchParams)
      .searchAllFields()
      .filter();

    let productsData = await apiProductFilters.query;

    const filteredProductsCount = productsData.length;

    apiProductFilters.pagination(resPerPage, page);
    productsData = await apiProductFilters.query.clone();

    // descending order
    let sortedProducts = productsData
      .slice()
      .sort(
        (a: { createdAt: string }, b: { createdAt: string }) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    sortedProducts = JSON.stringify(sortedProducts);
    return {
      products: sortedProducts,
      productsCount: productsCount,
      filteredProductsCount: filteredProductsCount,
      resPerPage: resPerPage,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllPOSProduct(searchQuery: any) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    const branchId = session.user._id.toString();

    // Extract search parameters
    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get("perpage")) || 40;
    const page = Number(searchParams.get("page")) || 1;
    const skip = (page - 1) * resPerPage;

    // Create the aggregation query
    let productQuery = Product.aggregate([
      {
        $match: {
          $and: [
            { "variations.stock.amount": { $gt: 0 } },
            { "variations.stock.branch": branchId },
            { "availability.branch": true },
          ],
        },
      },
      {
        $addFields: {
          // Try to convert the title to a number, if it's not numeric assign null
          numericTitle: {
            $cond: {
              if: { $regexMatch: { input: "$title", regex: /^[0-9]+$/ } }, // Check if the title is a number
              then: { $toInt: "$title" }, // Convert to number
              else: null, // Otherwise assign null
            },
          },
          branchStock: {
            $filter: {
              input: "$stock",
              as: "s",
              cond: { $eq: ["$$s.branch", branchId] },
            },
          },
        },
      },
      {
        $sort: {
          numericTitle: 1, // Sort numeric titles in descending order
          title: 1, // Sort non-numeric titles alphabetically after numeric titles
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: resPerPage,
      },
    ]);

    // Get the total count of products that match the criteria
    const productsCount = await Product.countDocuments({
      "stock.amount": { $gt: 0 },
      "stock.branch": branchId,
      "availability.branch": true,
    });

    // Execute the query
    let productsData = await productQuery;

    // Convert the product data to a JSON string
    let products = JSON.stringify(productsData);

    // Return the products and count of filtered products
    return {
      products: products,
      filteredProductsCount: productsCount,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllPOSProductNoFilter() {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let productsData = await Product.find({
      $and: [{ stock: { $gt: 0 } }, { "availability.branch": true }],
    });

    const filteredProductsCount = productsData.length;
    let products = JSON.stringify(productsData);

    return {
      products: products,
      filteredProductsCount: filteredProductsCount,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllProduct(searchQuery: any) {
  try {
    await dbConnect();

    const session = await getServerSession(options);

    let productQuery: any;
    if (session && ["manager", "sucursal"].includes(session?.user?.role)) {
      productQuery = Product.find();
    } else {
      productQuery = Product.find({ published: true });
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get("perpage")) || 10;
    const page = Number(searchParams.get("page")) || 1;

    productQuery = productQuery.sort({ createdAt: -1 });

    const productsCount = await Product.countDocuments();

    const [allCategories, allBrands] = await Promise.all([
      Product.distinct("category"),
      Product.distinct("brand"),
    ]);

    const apiProductFilters: any = new APIFilters(productQuery, searchParams)
      .searchAllFields()
      .filter();

    let productsData = await apiProductFilters.query.exec();
    const filteredProductsCount = productsData.length;

    apiProductFilters.pagination(resPerPage, page);
    productsData = await apiProductFilters.query.clone().exec();

    const response = {
      products: JSON.stringify(productsData),
      productsCount,
      filteredProductsCount,
      allCategories: JSON.stringify(allCategories),
      allBrands: JSON.stringify(allBrands),
    };

    revalidatePath("/admin/producto");

    return response;
  } catch (error: any) {
    console.error("Error in getAllProduct:", error);
    throw new Error(`Failed to get all products: ${error.message}`);
  }
}

export async function getAllUserOrder(searchQuery: any, id: any) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orderQuery;

    orderQuery = Order.find({
      user: id,
      orderStatus: { $ne: "Cancelado" },
    });
    let client = await User.findOne({ _id: id });

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get("perpage")) || 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get("page")) || 1;
    // Apply descending order based on a specific field (e.g., createdAt)
    orderQuery = orderQuery.sort({ createdAt: -1 });
    const totalOrderCount = await Order.countDocuments();

    // Apply search Filters including order_id and orderStatus
    const apiOrderFilters: any = new APIOrderFilters(orderQuery, searchParams)
      .searchAllFields()
      .filter();
    let ordersData = await apiOrderFilters.query;

    const itemCount = ordersData.length;
    apiOrderFilters.pagination(resPerPage, page);
    ordersData = await apiOrderFilters.query.clone();

    let orders = JSON.stringify(ordersData);
    client = JSON.stringify(client);

    return {
      orders: orders,
      client: client,
      totalOrderCount: totalOrderCount,
      itemCount: itemCount,
      resPerPage: resPerPage,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllCustomerOrders(searchQuery: any, id: any) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orderQuery;

    orderQuery = Order.find({
      customer: id,
      orderStatus: { $ne: "Cancelado" },
    });
    let client = await Customer.findOne({ _id: id });

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get("perpage")) || 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get("page")) || 1;
    // Apply descending order based on a specific field (e.g., createdAt)
    orderQuery = orderQuery.sort({ createdAt: -1 });
    const totalOrderCount = await Order.countDocuments();

    // Apply search Filters including order_id and orderStatus
    const apiOrderFilters: any = new APIOrderFilters(orderQuery, searchParams)
      .searchAllFields()
      .filter();
    let ordersData = await apiOrderFilters.query;

    const itemCount = ordersData.length;
    apiOrderFilters.pagination(resPerPage, page);
    ordersData = await apiOrderFilters.query.clone();

    let orders = JSON.stringify(ordersData);
    client = JSON.stringify(client);

    return {
      orders: orders,
      client: client,
      totalOrderCount: totalOrderCount,
      itemCount: itemCount,
      resPerPage: resPerPage,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllClient(searchQuery: any) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let clientQuery: any;

    if (session) {
      if (
        session?.user?.role === "manager" ||
        session?.user?.role === "sucursal"
      ) {
        clientQuery = Customer.find({});
      }
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get("perpage")) || 10;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get("page")) || 1;
    // total number of documents in database
    const clientsCount = await Customer.countDocuments();

    // Extract all possible categories
    // Apply search Filters
    const apiClientFilters: any = new APIClientFilters(
      clientQuery,
      searchParams
    )
      .searchAllFields()
      .filter();

    let clientsData = await apiClientFilters.query;

    const filteredClientsCount = clientsData.length;

    apiClientFilters.pagination(resPerPage, page);
    clientsData = await apiClientFilters.query.clone();

    let clients = JSON.stringify(clientsData);

    return {
      clients: clients,
      clientsCount: clientsCount,
      filteredClientsCount: filteredClientsCount,
      resPerPage: resPerPage,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function changeClientStatus(_id: any) {
  try {
    await dbConnect();
    const client = await User.findOne({ _id: _id });
    if (client && client.active === false) {
      client.active = true;
    } else {
      client.active = false;
    }
    client.save();
    console.log(client);
    revalidatePath("/admin/clientes");
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function updateClient(data: any) {
  let { _id, name, phone, email, updatedAt } = Object.fromEntries(data);

  updatedAt = new Date(updatedAt);

  try {
    // validate form data
    const result = ClientUpdateSchema.safeParse({
      name: name,
      phone: phone,
      email: email,
      updatedAt: updatedAt,
    });

    //check for errors
    const { error: zodError } = result;
    if (zodError) {
      return { error: zodError.format() };
    }

    await dbConnect();
    let CustomZodError;
    const client = await User.findOne({ _id: _id });

    if (client?.email != email) {
      const emailExist = await User.find({ email: email });
      if (emailExist) {
        CustomZodError = {
          _errors: [],
          email: { _errors: ["El email ya esta en uso"] },
        };
        return { error: CustomZodError };
      }
    }

    if (client?.phone != phone) {
      const phoneExist = await User.find({ phone: phone });
      if (phoneExist.length > 0) {
        CustomZodError = {
          _errors: [],
          phone: { _errors: ["El teléfono ya esta en uso"] },
        };
        console.log({ error: CustomZodError });
        return { error: CustomZodError };
      }
    }

    client.name = name;
    client.phone = phone;
    client.email = email;
    client.updatedAt = updatedAt;
    // client.avatar = avatar;
    client.save();
    revalidatePath("/perfil/actualizar");
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function updateClientPassword(data: any) {
  let { _id, newPassword, currentPassword, updatedAt } =
    Object.fromEntries(data);

  updatedAt = new Date(updatedAt);

  try {
    // validate form data
    const result = ClientPasswordUpdateSchema.safeParse({
      newPassword: newPassword,
      currentPassword: currentPassword,
      updatedAt: updatedAt,
    });

    //check for errors
    const { error: zodError } = result;
    if (zodError) {
      return { error: zodError.format() };
    }

    await dbConnect();
    let CustomZodError;
    let hashedPassword;
    const client = await User.findOne({ _id: _id }).select("+password");
    const comparePass = await bcrypt.compare(currentPassword, client.password);
    if (!comparePass) {
      CustomZodError = {
        _errors: [],
        currentPassword: {
          _errors: ["La contraseña actual no es la correcta"],
        },
      };
      return { error: CustomZodError };
    } else {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    client.password = hashedPassword;
    client.updatedAt = updatedAt;
    client.save();
    revalidatePath("/perfil/actualizar_contrasena");
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function addAddress(data: any) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };
  const { street, city, province, zip_code, country, phone } =
    Object.fromEntries(data);

  // validate form data

  const { error: zodError } = AddressEntrySchema.safeParse({
    street,
    city,
    province,
    zip_code,
    country,
    phone,
  });
  if (zodError) {
    return { error: zodError.format() };
  }
  //check for errors
  await dbConnect();
  const { error } = await Address.create({
    street,
    city,
    province,
    zip_code,
    country,
    phone,
    user,
  });
  if (error) throw Error(error);
  revalidatePath("/perfil/direcciones");
  revalidatePath("/carrito/envio");
}

export async function deleteAddress(id: any) {
  //check for errors
  try {
    await dbConnect();
    const deleteAddress = await Address.findByIdAndDelete(id);
    revalidatePath("/perfil/direcciones");
    revalidatePath("/carrito/envio");
  } catch (error: any) {
    if (error) throw Error(error);
  }
}

export async function addNewPost(data: any) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };
  let {
    category,
    mainTitle,
    mainImage,
    sectionTwoTitle,
    sectionTwoParagraphOne,
    sectionTwoParagraphTwo,
    sectionThreeTitle,
    sectionThreeParagraphOne,
    sectionThreeImage,
    sectionThreeParagraphFooter,
    sectionFourTitle,
    sectionFourOptionOne,
    sectionFourOptionTwo,
    sectionFourOptionThree,
    sectionFourParagraphOne,
    sectionFourImage,
    sectionFourParagraphFooter,
    sectionFiveTitle,
    sectionFiveImage,
    sectionFiveParagraphOne,
    sectionFiveParagraphTwo,
    sectionSixColOneTitle,
    sectionSixColOneParagraph,
    sectionSixColOneImage,
    sectionSixColTwoTitle,
    sectionSixColTwoParagraph,
    sectionSixColTwoImage,
    sectionSixColThreeTitle,
    sectionSixColThreeParagraph,
    sectionSixColThreeImage,
    sectionSixColOneParagraphFooter,
    sectionSevenTitle,
    sectionSevenImage,
    sectionSevenParagraph,
    createdAt,
  } = Object.fromEntries(data);

  createdAt = new Date(createdAt);
  // validate form data
  const result = PostEntrySchema.safeParse({
    category: category,
    mainTitle: mainTitle,
    mainImage: mainImage,
    createdAt: createdAt,
  });
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }

  //check for errors
  await dbConnect();
  const slug = generateUrlSafeTitle(mainTitle);

  const slugExists = await Post.findOne({ slug: slug });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ["Este Titulo de publicación ya esta en uso"] },
      },
    };
  }
  const { error } = await Post.create({
    category,
    mainTitle,
    slug,
    mainImage,
    sectionTwoTitle,
    sectionTwoParagraphOne,
    sectionTwoParagraphTwo,
    sectionThreeTitle,
    sectionThreeParagraphOne,
    sectionThreeImage,
    sectionThreeParagraphFooter,
    sectionFourTitle,
    sectionFourOptionOne,
    sectionFourOptionTwo,
    sectionFourOptionThree,
    sectionFourParagraphOne,
    sectionFourImage,
    sectionFourParagraphFooter,
    sectionFiveTitle,
    sectionFiveImage,
    sectionFiveParagraphOne,
    sectionFiveParagraphTwo,
    sectionSixColOneTitle,
    sectionSixColOneParagraph,
    sectionSixColOneImage,
    sectionSixColTwoTitle,
    sectionSixColTwoParagraph,
    sectionSixColTwoImage,
    sectionSixColThreeTitle,
    sectionSixColThreeParagraph,
    sectionSixColThreeImage,
    sectionSixColOneParagraphFooter,
    sectionSevenTitle,
    sectionSevenImage,
    sectionSevenParagraph,
    createdAt,
    published: true,
    authorId: { _id: session?.user._id },
  });
  if (error) throw Error(error);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export async function updatePost(data: any) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };
  let {
    _id,
    category,
    mainTitle,
    mainImage,
    sectionTwoTitle,
    sectionTwoParagraphOne,
    sectionTwoParagraphTwo,
    sectionThreeTitle,
    sectionThreeParagraphOne,
    sectionThreeImage,
    sectionThreeParagraphFooter,
    sectionFourTitle,
    sectionFourOptionOne,
    sectionFourOptionTwo,
    sectionFourOptionThree,
    sectionFourParagraphOne,
    sectionFourImage,
    sectionFourParagraphFooter,
    sectionFiveTitle,
    sectionFiveImage,
    sectionFiveParagraphOne,
    sectionFiveParagraphTwo,
    sectionSixColOneTitle,
    sectionSixColOneParagraph,
    sectionSixColOneImage,
    sectionSixColTwoTitle,
    sectionSixColTwoParagraph,
    sectionSixColTwoImage,
    sectionSixColThreeTitle,
    sectionSixColThreeParagraph,
    sectionSixColThreeImage,
    sectionSixColOneParagraphFooter,
    sectionSevenTitle,
    sectionSevenImage,
    sectionSevenParagraph,
    updatedAt,
  } = Object.fromEntries(data);

  updatedAt = new Date(updatedAt);
  // validate form data
  const result = PostUpdateSchema.safeParse({
    category: category,
    mainTitle: mainTitle,
    mainImage: mainImage,
    updatedAt: updatedAt,
  });
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }

  //check for errors
  await dbConnect();
  const slug = generateUrlSafeTitle(mainTitle);
  const slugExists = await Post.findOne({ slug: slug, _id: { $ne: _id } });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ["Este Titulo de publicación ya esta en uso"] },
      },
    };
  }
  const { error }: any = await Post.updateOne(
    { _id },
    {
      category,
      mainTitle,
      slug,
      mainImage,
      sectionTwoTitle,
      sectionTwoParagraphOne,
      sectionTwoParagraphTwo,
      sectionThreeTitle,
      sectionThreeParagraphOne,
      sectionThreeImage,
      sectionThreeParagraphFooter,
      sectionFourTitle,
      sectionFourOptionOne,
      sectionFourOptionTwo,
      sectionFourOptionThree,
      sectionFourParagraphOne,
      sectionFourImage,
      sectionFourParagraphFooter,
      sectionFiveTitle,
      sectionFiveImage,
      sectionFiveParagraphOne,
      sectionFiveParagraphTwo,
      sectionSixColOneTitle,
      sectionSixColOneParagraph,
      sectionSixColOneImage,
      sectionSixColTwoTitle,
      sectionSixColTwoParagraph,
      sectionSixColTwoImage,
      sectionSixColThreeTitle,
      sectionSixColThreeParagraph,
      sectionSixColThreeImage,
      sectionSixColOneParagraphFooter,
      sectionSevenTitle,
      sectionSevenImage,
      sectionSevenParagraph,
      updatedAt,
      published: true,
      authorId: { _id: session?.user._id },
    }
  );
  if (error) throw Error(error);
  revalidatePath("/admin/blog");
  revalidatePath("/blog/publicacion/");
  revalidatePath("/admin/blog/editor");
  revalidatePath("/blog");
}

export async function addVariationProduct(data: any) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };
  const branchId = session.user._id.toString();

  let {
    title,
    description,
    category,
    tags,
    featured,
    branchAvailability,
    socialsAvailability,
    onlineAvailability,
    mainImage,
    brand,
    gender,
    variations,
    salePrice,
    salePriceEndDate,
    createdAt,
  } = Object.fromEntries(data);
  // Parse variations JSON string with reviver function to convert numeric strings to numbers
  let colors: any[] = [];
  variations = JSON.parse(variations, (key, value) => {
    if (key === "color") {
      const color = {
        value: value,
        label: value,
      };
      //check array of object to see if values exists
      const exists = colors.some((c) => c.value === value || c.label === value);
      if (!exists) {
        colors.push(color); // add to colors array
      }
    }
    // Check if the value is a string and represents a number
    if (!isNaN(value) && value !== "" && !Array.isArray(value)) {
      if (key != "size") {
        return Number(value); // Convert the string to a number
      }
    }
    return value; // Return unchanged for other types of values
  });

  tags = JSON.parse(tags);
  const sale_price = Number(salePrice);
  const sale_price_end_date = salePriceEndDate;
  const images = [{ url: mainImage }];

  // Calculate product stock as an array of objects for the given branch
  const stock = variations.map((variation: any) => ({
    branch: branchId, // Stock is per branch, so associate it with the current branch ID
    amount: variation.stock, // Use the stock amount from the variation for this branch
  }));

  createdAt = new Date(createdAt);

  // validate form data
  const result = VariationProductEntrySchema.safeParse({
    title: title,
    description: description,
    brand: brand,
    category: category,
    tags: tags,
    images: images,
    variations: variations,
    stock: stock,
    gender: gender,
    createdAt: createdAt,
  });

  //check for errors
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }
  // Create a new Product in the database
  await dbConnect();
  const slug = generateUrlSafeTitle(title);

  const slugExists = await Product.findOne({ slug: slug });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ["Este Titulo de producto ya esta en uso"] },
      },
    };
  }
  const availability = {
    socials: socialsAvailability,
    branch: branchAvailability,
    online: onlineAvailability,
  };

  const { error } = await Product.create({
    type: "variation",
    title,
    slug,
    description,
    featured,
    availability,
    brand,
    gender,
    category,
    tags,
    images,
    colors,
    variations,
    stock,
    sale_price,
    sale_price_end_date,
    createdAt,
    user,
  });
  console.log(error);
  if (error) throw Error(error);
  revalidatePath("/admin/productos");
}

export async function updateVariationProduct(data: any) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };
  const branchId = session.user._id.toString();

  let {
    title,
    description,
    category,
    tags,
    featured,
    branchAvailability,
    socialsAvailability,
    onlineAvailability,
    mainImage,
    brand,
    gender,
    variations,
    salePrice,
    salePriceEndDate,
    updatedAt,
    _id,
  } = Object.fromEntries(data);
  // Parse variations JSON string with reviver function to convert numeric strings to numbers
  let colors: any[] = [];
  variations = JSON.parse(variations, (key, value) => {
    if (key === "color") {
      const color = {
        value: value,
        label: value,
      };
      //check array of object to see if values exists
      const exists = colors.some((c) => c.value === value || c.label === value);
      if (!exists) {
        colors.push(color); // add to colors array
      }
    }
    // Check if the value is a string and represents a number
    if (!isNaN(value) && value !== "" && !Array.isArray(value)) {
      if (key != "size") {
        return Number(value); // Convert the string to a number
      }
    }
    return value; // Return unchanged for other types of values
  });

  tags = JSON.parse(tags);
  const sale_price = Number(salePrice);
  const sale_price_end_date = salePriceEndDate;
  const images = [{ url: mainImage }];

  // Calculate product stock as an array of objects for the given branch
  const stock = variations.map((variation: any) => ({
    branch: branchId, // Stock is per branch, so associate it with the current branch ID
    amount: variation.stock, // Use the stock amount from the variation for this branch
  }));

  updatedAt = new Date(updatedAt);
  // validate form data
  const result = VariationUpdateProductEntrySchema.safeParse({
    title: title,
    description: description,
    brand: brand,
    category: category,
    tags: tags,
    images: images,
    variations: variations,
    stock: stock,
    gender: gender,
    updatedAt: updatedAt,
  });

  //check for errors
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }

  // Create a new Product in the database
  await dbConnect();

  const slug = generateUrlSafeTitle(title);
  const slugExists = await Product.findOne({ slug: slug, _id: { $ne: _id } });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ["Este Titulo de producto ya esta en uso"] },
      },
    };
  }
  const availability = {
    socials: socialsAvailability,
    branch: branchAvailability,
    online: onlineAvailability,
  };

  const { error }: any = await Product.updateOne(
    { _id },
    {
      type: "variation",
      title,
      slug,
      description,
      featured,
      availability,
      brand,
      gender,
      category,
      tags,
      images,
      colors,
      variations,
      stock,
      sale_price,
      sale_price_end_date,
      updatedAt,
      user,
    }
  );
  if (error) throw Error(error);
  revalidatePath("/admin/productos");
}

export async function updateRevalidateProduct() {
  revalidatePath("/admin/productos");
}

export async function addProduct(data: any) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };

  let {
    title,
    description,
    category,
    cost,
    price,
    sizes,
    tags,
    colors,
    featured,
    images,
    brand,
    gender,
    salePrice,
    salePriceEndDate,
    stock,
    createdAt,
  } = Object.fromEntries(data);
  // Parse images as JSON
  images = JSON.parse(images);
  sizes = JSON.parse(sizes);
  tags = JSON.parse(tags);
  colors = JSON.parse(colors);
  stock = Number(stock);
  cost = Number(cost);
  price = Number(price);
  const sale_price = Number(salePrice);
  const sale_price_end_date = salePriceEndDate;

  createdAt = new Date(createdAt);

  // validate form data
  const result = ProductEntrySchema.safeParse({
    title: title,
    description: description,
    brand: brand,
    category: category,
    colors: colors,
    sizes: sizes,
    tags: tags,
    images: images,
    gender: gender,
    stock: stock,
    price: price,
    cost: cost,
    createdAt: createdAt,
  });

  //check for errors
  const { error: zodError } = result;
  if (zodError) {
    return { error: zodError.format() };
  }
  // Create a new Product in the database
  await dbConnect();
  const slug = generateUrlSafeTitle(title);
  const slugExists = await Post.findOne({ slug: slug });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ["Este Titulo de producto ya esta en uso"] },
      },
    };
  }
  const { error } = await Product.create({
    type: "simple",
    title,
    slug,
    description,
    featured,
    brand,
    gender,
    category,
    colors,
    sizes,
    tags,
    images,
    stock,
    price,
    sale_price,
    sale_price_end_date,
    cost,
    createdAt,
    user,
  });
  if (error) throw Error(error);
  revalidatePath("/admin/productos");
}

export async function resendEmail(data: any) {
  let { email, gReCaptchaToken } = Object.fromEntries(data);
  const secretKey = process?.env?.RECAPTCHA_SECRET_KEY;

  //check for errors
  const { error: zodError } = VerifyEmailSchema.safeParse({
    email,
  });
  if (zodError) {
    return { error: zodError.format() };
  }

  const formData = `secret=${secretKey}&response=${gReCaptchaToken}`;
  let res: any;
  try {
    res = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  } catch (e) {
    console.log("recaptcha error:", e);
  }

  if (res && res.data?.success && res.data?.score > 0.5) {
    // Save data to the database from here
    try {
      await dbConnect();
      const user = await User.findOne({ email: email });
      if (!user) {
        return { error: { email: { _errors: ["Email does not exist"] } } };
      }
      if (user?.isActive === true) {
        return { error: { email: { _errors: ["Email is already verified"] } } };
      }
      if (user?._id) {
        try {
          const subject = "Confirmar email";
          const body = `Por favor da click en confirmar email para verificar tu cuenta.`;
          const title = "Completar registro";
          const greeting = `Saludos ${user?.name}`;
          const action = "CONFIRMAR EMAIL";
          const bestRegards = "Gracias por unirte a nuestro sitio.";
          const recipient_email = email;
          const sender_email = "yunuencompany01@gmail.com";
          const fromName = "yunuencompany";

          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env.GOOGLE_MAIL,
              pass: process.env.GOOGLE_MAIL_PASS,
            },
          });

          try {
            // Verify your transporter
            //await transporter.verify();

            const mailOptions = {
              from: `"${fromName}" ${sender_email}`,
              to: recipient_email,
              subject,
              html: `
        <!DOCTYPE html>
        <html lang="es">
        <body>
        <p>${greeting}</p>
        <p>${title}</p>
        <div>${body}</div>
        <a href="${process.env.NEXTAUTH_URL}/exito?token=${user?.verificationToken}">${action}</a>
        <p>${bestRegards}</p>
        </body>
        
        </html>
        
        `,
            };
            await transporter.sendMail(mailOptions);

            return {
              error: {
                success: {
                  _errors: [
                    "El correo se envió exitosamente revisa tu bandeja de entrada y tu correo no deseado",
                  ],
                },
              },
            };
          } catch (error: any) {
            console.log(error);
          }
        } catch (error: any) {
          return { error: { email: { _errors: ["Error al enviar email"] } } };
        }
      }
    } catch (error: any) {
      console.log(error);
      throw Error(error);
    }
  } else {
    return {
      error: {
        email: { _errors: [`Failed Google Captcha Score: ${res.data?.score}`] },
      },
    };
  }
}

export async function resetAccountEmail(data: any) {
  let { email, gReCaptchaToken } = Object.fromEntries(data);
  const secretKey = process?.env?.RECAPTCHA_SECRET_KEY;

  //check for errors
  const { error: zodError } = VerifyEmailSchema.safeParse({
    email,
  });
  if (zodError) {
    return { error: zodError.format() };
  }

  const formData = `secret=${secretKey}&response=${gReCaptchaToken}`;
  let res: any;
  try {
    res = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  } catch (e) {
    console.log("recaptcha error:", e);
  }

  if (res && res.data?.success && res.data?.score > 0.5) {
    // Save data to the database from here
    try {
      await dbConnect();
      const user = await User.findOne({ email: email });
      if (!user) {
        return { error: { email: { _errors: ["El correo no existe"] } } };
      }
      if (user?.active === false) {
        return {
          error: { email: { _errors: ["El correo no esta verificado"] } },
        };
      }
      if (user?._id) {
        try {
          const subject = "Desbloquear Cuenta yunuencompany";
          const body = `Por favor da click en desbloquear para reactivar tu cuenta`;
          const title = "Desbloquear Cuenta";
          const btnAction = "DESBLOQUEAR";
          const greeting = `Saludos ${user?.name}`;
          const bestRegards =
            "¿Problemas? Ponte en contacto yunuencompany01@gmail.com";
          const recipient_email = email;
          const sender_email = "yunuencompany01@gmail.com";
          const fromName = "yunuencompany";

          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env.GOOGLE_MAIL,
              pass: process.env.GOOGLE_MAIL_PASS,
            },
          });

          const mailOption = {
            from: `"${fromName}" ${sender_email}`,
            to: recipient_email,
            subject,
            html: `
              <!DOCTYPE html>
              <html lang="es">
              <body>
              <p>${greeting}</p>
              <p>${title}</p>
              <div>${body}</div>
              <a href="${process.env.NEXTAUTH_URL}/reiniciar?token=${user?.verificationToken}">${btnAction}</a>
              <p>${bestRegards}</p>
              </body>
              
              </html>
              
              `,
          };

          await transporter.sendMail(mailOption);

          return {
            error: {
              success: {
                _errors: [
                  "El correo electrónico fue enviado exitosamente revisa tu bandeja de entrada y spam",
                ],
              },
            },
          };
        } catch (error: any) {
          return { error: { email: { _errors: ["Failed to send email"] } } };
        }
      }
    } catch (error: any) {
      if (error) throw Error(error);
    }
  } else {
    return {
      error: {
        email: { _errors: [`Failed Google Captcha Score: ${res.data?.score}`] },
      },
    };
  }
}

export async function getSorteoParams() {
  try {
    // Define the model name with the suffix appended with the lottery ID
    await dbConnect();
    // Retrieve the dynamically created Ticket model

    let customerCount = await Customer?.countDocuments();
    let customersData = await Customer?.find({}).select("name phone -_id"); // Include name and phone, exclude _id
    const customers = JSON.stringify(customersData);
    return {
      ticketCount: customerCount,
      customers: customers,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function setOneWinnerTicket(searchNumber: string) {
  try {
    // Define the model name with the suffix appended with the lottery ID
    await dbConnect();
    // Retrieve the dynamically created Ticket model
    let ticket = await Customer.findOne({
      $or: [
        { num: searchNumber }, // Search in the `num` field
        { "numbers.num": searchNumber }, // Search in the `numbers` array of objects
      ],
    });
    if (ticket) {
      let customer;
      if (ticket.customer) {
        customer = await Customer.findOne(ticket.customer);
        customer = JSON.stringify(customer);
      }
      console.log(customer, ticket.customer);
      ticket = JSON.stringify(ticket);
      revalidatePath(`/admin/ganador/`);
      return {
        ticket: ticket,
        customer: customer,
      };
    }
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function sendSMSMessage(
  message: string,
  phone: string,
  name: string
): Promise<boolean> {
  const data = JSON.stringify({
    message: message,
    tpoa: "Sender",
    recipient: [
      {
        msisdn: `521${phone}`,
      },
    ],
  });

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.labsmobile.com/json/send",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.LABS_MOBILE_API_USER}:${process.env.LABS_MOBILE_API_KEY}`
        ).toString("base64"),
    },
    data: data,
  };

  try {
    const response = await axios.request(config);

    // Check for success based on API response
    if (response.data && response.data.success) {
      return true; // SMS sent successfully
    } else {
      return false; // API response indicates failure
    }
  } catch (error) {
    console.error("SMS sending failed:", error);
    return false; // Request failed
  }
}

export async function sendWATemplateMessage(
  phone: string,
  name: string
): Promise<boolean> {
  const data = JSON.stringify({
    messaging_product: "whatsapp",
    to: `52${phone}`,
    type: "template",
    template: {
      name: "descuento_especial",
      language: {
        code: "es_MX",
      },
    },
  });
  console.log(data, "data", process.env.WA_BUSINESS_TOKEN);

  const config = {
    method: "post",
    url: "https://graph.facebook.com/v21.0/431500516723038/messages",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WA_BUSINESS_TOKEN}`,
    },
    data: data,
  };

  try {
    const response: any = await axios(config);

    // Check for success based on API response
    if (response && response.status === 200) {
      return true; // SMS sent successfully
    } else {
      return false; // API response indicates failure
    }
  } catch (error) {
    console.error("WA Template sending failed:", error);
    return false; // Request failed
  }
}

export async function sendWATextMessage(
  message: string,
  phone: string,
  name: string
): Promise<boolean> {
  const data = JSON.stringify({
    messaging_product: "whatsapp",
    to: `52${phone}`,
    type: "text",
    text: {
      body: message,
    },
  });

  const config = {
    method: "post",
    url: "https://graph.facebook.com/v21.0/431500516723038/messages",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WA_BUSINESS_TOKEN}`,
    },
    data: data,
  };

  try {
    const response: any = await axios(config);

    // Check for success based on API response
    if (response && response.status === 200) {
      return true; // SMS sent successfully
    } else {
      return false; // API response indicates failure
    }
  } catch (error) {
    console.error("WA Template sending failed:", error);
    return false; // Request failed
  }
}

export async function sendWAMediaMessage(
  message: string,
  phone: string,
  mainImage: string,
  name: string
): Promise<boolean> {
  const data = JSON.stringify({
    messaging_product: "whatsapp",
    to: `52${phone}`,
    type: "image",
    image: {
      link: mainImage,
      caption: message,
    },
  });
  console.log(data, "data");

  const config = {
    method: "post",
    url: "https://graph.facebook.com/v21.0/431500516723038/messages",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.WA_BUSINESS_TOKEN}`,
    },
    data: data,
  };

  try {
    const response: any = await axios(config);

    // Check for success based on API response
    if (response && response.status === 200) {
      return true; // SMS sent successfully
    } else {
      return false; // API response indicates failure
    }
  } catch (error) {
    console.error("WA Template sending failed:", error);
    return false; // Request failed
  }
}

export async function getVideoMessages(videoId: string) {
  const video = videoId || "421878677666248_122131066880443689";

  // Expanded fields to get more user information
  const baseUrl = `https://graph.facebook.com/v21.0/${video}/comments?pretty=0&limit=200`;

  const headers = {
    Authorization: `Bearer ${process.env.FB_LAIF_TOKEN}`,
  };

  let messages: any[] = [];
  let nextPageUrl: string | null = baseUrl;

  try {
    // console.log("Initial API Call URL:", nextPageUrl);

    while (nextPageUrl) {
      const config: any = {
        method: "get",
        url: nextPageUrl,
        headers,
      };

      try {
        const response = await axios(config);

        if (response && response.status === 200) {
          const liveMessages = response.data?.data || [];

          // Log detailed information about each comment
          // const processedMessages = liveMessages.map((message: any) => {
          //   console.log("Individual Comment Debug:", {
          //     id: message.id,
          //     message: message.message,
          //     from: message.from
          //       ? {
          //           id: message.from.id,
          //           name: message.from.name,
          //           hasUsername: !!message.from.username,
          //         }
          //       : "NO FROM INFORMATION",
          //   });

          //   return message;
          // });

          messages = [...messages, ...liveMessages];

          // Safely handle the next page URL
          nextPageUrl = response.data?.paging?.next || null;

          // console.log("Next Page URL:", nextPageUrl);
          // console.log("Current Messages Count:", messages.length);
        } else {
          console.warn("Unexpected response status:", response.status);
          break;
        }
      } catch (axiosError: any) {
        // More detailed Axios error logging
        if (axiosError.response) {
          // The request was made and the server responded with a status code
          console.error("Error Response Data:", axiosError.response.data);
          console.error("Error Response Status:", axiosError.response.status);
          console.error("Error Response Headers:", axiosError.response.headers);
        } else if (axiosError.request) {
          // The request was made but no response was received
          console.error("No response received:", axiosError.request);
        } else {
          // Something happened in setting up the request
          console.error("Error setting up request:", axiosError.message);
        }
        break;
      }
    }

    return {
      status: 200,
      messages: JSON.stringify(messages),
      messageCount: messages.length,
    };
  } catch (error) {
    console.error(
      "Catastrophic error in fetching Facebook Live Messages:",
      error
    );
    return { status: 400, messages: "", messageCount: 0 };
  }
}

export async function getFBLiveVideos() {
  const account = "173875102485412";
  // "173875102485412";
  const baseUrl = `https://graph.facebook.com/v21.0/${account}/posts`;
  const headers = {
    Authorization: `Bearer ${process.env.FB_LAIF_TOKEN}`,
  };

  let videos: any[] = [];
  let nextPageUrl: string | null = baseUrl;

  try {
    while (nextPageUrl) {
      const config: any = {
        method: "get",
        url: nextPageUrl,
        headers,
      };

      const response = await axios(config);

      if (response && response.status === 200) {
        const liveVideos = response.data?.data || [];
        videos = [...videos, ...liveVideos];
        nextPageUrl = response.data?.paging?.next || null;
      } else {
        break;
      }
    }

    return { status: 200, videos: JSON.stringify(videos) };
  } catch (error) {
    console.error("Failed to fetch Facebook Live Videos:", error);
    return { status: 400, videos: "" };
  }
}

export async function getPostDBComments(videoId: string) {
  const video = videoId || "421878677666248_122131066880443689";

  await dbConnect();

  try {
    const commentsData = await Comment.find({ postId: video }).sort({
      createdAt: -1,
    });
    return {
      status: 200,
      commentsData: JSON.stringify(commentsData),
      commentsDataCount: commentsData.length,
    };
  } catch (error: any) {
    // Something happened in setting up the request
    console.error("Error setting up request:", error);
  }
}

export async function getFBPosts() {
  const account = "173875102485412";
  const baseUrl = `https://graph.facebook.com/v21.0/${account}/posts`;
  const headers = {
    Authorization: `Bearer ${process.env.FB_LAIF_TOKEN}`,
  };

  let posts: any[] = [];
  let nextPageUrl: string | null = baseUrl;

  try {
    while (nextPageUrl) {
      const config: any = {
        method: "get",
        url: nextPageUrl,
        headers,
      };

      const response = await axios(config);

      if (response && response.status === 200) {
        const postData = response.data?.data || [];
        const liveVideos = response.data?.data || [];
        posts = [...posts, ...liveVideos];

        // Fetch images for each post
        // const postsWithImages = await Promise.all(
        //   postData.map(async (post: any) => {
        //     const attachmentsResponse = await axios.get(
        //       `https://graph.facebook.com/v21.0/${post.id}?fields=attachments`,
        //       { headers }
        //     );

        //     const imageUrl =
        //       attachmentsResponse.data?.attachments?.data?.[0]?.media?.image
        //         ?.src || null;

        //     // return {
        //     //   ...post,
        //     //   imageUrl,
        //     // };

        //     return post
        //   })
        // );
        // posts = [...posts, ...postsWithImages];

        nextPageUrl = response.data?.paging?.next || null;
      } else {
        break;
      }
    }

    return { status: 200, posts: JSON.stringify(posts) };
  } catch (error) {
    console.error("Failed to fetch Facebook posts with images:", error);
    return { status: 400, posts: "" };
  }
}

export async function respondToFBComment(commentId: string, message: string) {
  const baseUrl = `https://graph.facebook.com/v21.0/${commentId}/comments`;
  const headers = {
    Authorization: `Bearer ${process.env.FB_LAIF_TOKEN}`,
  };

  try {
    const response = await axios.post(baseUrl, { message }, { headers });

    if (response.status === 200) {
      console.log("Successfully responded to comment:", response.data);
      return { status: 200, data: response.data };
    } else {
      console.error("Unexpected response status:", response.status);
      return { status: response.status, data: response.data };
    }
  } catch (error: any) {
    console.error(
      "Failed to respond to Facebook comment:",
      error.response?.data || error.message
    );
    return { status: 400, error: error.response?.data || error.message };
  }
}

export async function likeToFBComment(commentId: string) {
  const baseUrl = `https://graph.facebook.com/v21.0/${commentId}/likes`;
  const headers = {
    Authorization: `Bearer ${process.env.FB_LAIF_TOKEN}`,
  };

  try {
    const response = await axios.post(baseUrl, {}, { headers });

    if (response.status === 200) {
      console.log("Successfully liked to comment:", response.data);
      return { status: 200, data: response.data };
    } else {
      console.error("Unexpected response status to like:", response.status);
      return { status: response.status, data: response.data };
    }
  } catch (error: any) {
    console.error(
      "Failed to like Facebook comment:",
      error.response?.data || error.message
    );
    return { status: 400, error: error.response?.data || error.message };
  }
}

export async function subscribeToFbApp(pageId: string) {
  const fbPage = pageId || "173875102485412";

  // Expanded fields to get more user information
  const baseUrl = `https://graph.facebook.com/v21.0/${fbPage}/subscribed_apps?subscribed_fields=feed`;

  const headers = {
    Authorization: `Bearer ${process.env.FB_LAIF_TOKEN}`,
  };
  const config: any = {
    method: "post",
    url: baseUrl,
    headers,
  };

  try {
    // console.log("Initial API Call URL:", nextPageUrl);

    const response: any = await axios(config);

    if (response && response.status === 200) {
      const subscribeResponse = response;
      console.log(subscribeResponse.data);

      return {
        status: 200,
        response: JSON.stringify(subscribeResponse.data),
      };
    }

    if (response && response.error) {
      /* handle the result */
      console.log(response.error);
      return {
        status: 400,
        response: JSON.stringify(response.error),
      };
    }
  } catch (error) {
    console.error("Catastrophic error in subscribing to Facebook page:", error);
    return { status: 400 };
  }
}
