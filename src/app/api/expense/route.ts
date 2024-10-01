import { newCSTDate } from "@/backend/helpers";
import Expense from "@/backend/models/Expense";
import Payment from "@/backend/models/Payment";
import dbConnect from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { revalidatePath } from "next/cache";
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
    let paymentTransactionData = {
      type: type,
      paymentIntent: "pagado",
      amount: -Math.abs(amount), // Ensure the amount is negative,
      reference,
      pay_date,
      method,
      expense: newExpense._id,
      user,
    };
    const newPaymentTransaction = await new Payment(paymentTransactionData);
    await newPaymentTransaction.save();

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
    let { note, expenseId } = Object.fromEntries(payload);
    const soonToDeleteExpense = await Expense.findById(expenseId);

    if (!soonToDeleteExpense) {
      const notFoundResponse = "Expense not found";
      return new Response(JSON.stringify(notFoundResponse), { status: 404 });
    }
    const payment = await Payment.findOne({ expense: expenseId });
    // Iterate through order items and update Product quantities

    const date = newCSTDate();
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

    return new Response(JSON.stringify(cancelExpense), { status: 201 });
  } catch (error: any) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
