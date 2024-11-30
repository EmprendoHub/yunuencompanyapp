import dbConnect from "@/lib/db";
import { NextResponse } from "next/server";
import Customer from "@/backend/models/Customer";
import { runRevalidationTo } from "@/app/_actions";

export async function POST(request: any) {
  const cookie = await request.headers.get("cookie");

  if (!cookie) {
    // Not Signed in
    const notAuthorized = "You are not authorized no no no";
    return new Response(JSON.stringify(notAuthorized), {
      status: 400,
    });
  }

  try {
    const { name, lastName, phone, honeypot } = await request.json();

    if (honeypot) {
      console.log("no bots thank you!");
      throw new Error("hubo un error al iniciar session");
    }

    // Save data to the database from here
    await dbConnect();
    const username = name + " " + lastName;

    const isExistingCustomer = await Customer?.findOne({
      $or: [{ name: username }, { phone: phone }],
    });
    if (isExistingCustomer) {
      return new Response("Customer is already registered", { status: 400 });
    }

    const newCustomer = new Customer({
      name: username,
      phone,
    });

    const res = await newCustomer.save();
    runRevalidationTo("/admin/rifas");
    runRevalidationTo("/admin/rifa");

    return NextResponse.json({
      message: "New customer registered",
      success: true,
      phone,
    });
  } catch (error: any) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
