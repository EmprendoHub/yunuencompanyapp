import { newCSTDate } from "@/backend/helpers";
import Expense from "@/backend/models/Expense";
import dbConnect from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function POST(request: any, res: any) {
  const token: any = await getToken({ req: request });
  if (!token) {
    // Return immediately if not authorized
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    await dbConnect();
    const { type, amount, reference, method, comment } = await request.json();

    const user = { _id: token?.user?._id };
    const pay_date = newCSTDate();
    const expenseIntent = "pagado";

    console.log(pay_date);

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
    console.log(newExpense);
    return NextResponse.json(
      { message: "Nuevo gasto agregado" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: JSON.stringify(error.message),
    });
  }
}
