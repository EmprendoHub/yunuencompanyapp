import { NextResponse } from "next/server";
import Stripe from "stripe";

const calculateTotalAmount = (items: any) => {
  // Assuming each item has a 'price' and 'quantity' property
  return items.reduce(
    (total: any, item: any) => total + item.price * item.quantity,
    0
  );
};

export const POST = async (request: any) => {
  const sessionRaw = await request.headers.get("session");
  const session = JSON.parse(sessionRaw);
  if (!session) {
    // Not Signed in
    return new Response("You are not authorized, eh eh eh, no no no", {
      status: 400,
    });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const reqBody = await request.json();
    const { order, items, email, user, shipping, affiliateInfo } =
      await reqBody;

    const existingCustomers = await stripe.customers.list({
      email: user.email,
    });
    let customerId;

    if (existingCustomers.data.length > 0) {
      // Customer already exists, use the first customer found
      const existingCustomer = existingCustomers.data[0];
      customerId = existingCustomer.id;
    } else {
      // Customer doesn't exist, create a new customer
      const newCustomer = await stripe.customers.create({
        email: user.email,
      });

      customerId = newCustomer.id;
    }

    // Calculate total amount based on items
    let totalAmount = await calculateTotalAmount(items);

    const pendingAmount = totalAmount - order.paymentInfo.amountPaid;

    let session;

    const shippingInfo = JSON.stringify(shipping);

    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "oxxo", "customer_balance"],
      mode: "payment",
      customer: customerId,
      payment_method_options: {
        oxxo: {
          expires_after_days: 2,
        },
        customer_balance: {
          funding_type: "bank_transfer",
          bank_transfer: {
            type: "mx_bank_transfer",
          },
        },
      },
      locale: "es-419",
      client_reference_id: user?._id,
      success_url: `${process.env.NEXTAUTH_URL}/perfil/pedidos?pedido_exitoso=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/perfil/pedido/${order._id}`,
      metadata: {
        shippingInfo,
        layaway: true ? "true" : "false",
        payoff: true ? "true" : "false",
        order: order._id,
        referralID: affiliateInfo,
      },
      shipping_options: [
        {
          shipping_rate: "shr_1OW9lzF1B19DqtcQpzK984xg",
        },
      ],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            unit_amount: pendingAmount * 100, // Convert to cents
            product_data: {
              name: "Finiquitar Apartado",
              description: `Pago final del pedido #${order.orderId}`,
            },
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({
      message: "Connection is active",
      success: true,
      id: session.id,
      url: session.url,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
