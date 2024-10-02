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
import Affiliate from "@/backend/models/Affiliate";
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
import APIAffiliateFilters from "@/lib/APIAffiliateFilters";
import Page from "@/backend/models/Page";
import Payment from "@/backend/models/Payment";
import Customer from "@/backend/models/Customer";
import { getToken } from "next-auth/jwt";
import TestUser from "@/backend/models/TestUser";
import Expense from "@/backend/models/Expense";
import APIExpenseFilters from "@/lib/APIExpensesFilters";

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

export async function updateUserMercadoToken(tokenData: any) {
  if (!tokenData) {
    throw new Error(`No token sent`);
  }
  const session = await getServerSession(options);
  try {
    await dbConnect();
    const updatedUser = await User.updateOne(
      { _id: session?.user?._id }, // Query condition
      { $set: { mercado_token: tokenData } }, // Update operation
      { new: true, runValidators: true } // Options
    );
  } catch (error: any) {
    console.log(error);

    throw new Error(`Failed to update user: we got error: ${error.message}`);
  }
}

export async function getUserMercadoToken() {
  const session = await getServerSession(options);
  if (!session) {
    throw new Error(`No session available`);
  }
  try {
    await dbConnect();
    const user = await User.findOne(
      { _id: session?.user?._id } // Query condition
    );

    const accessToken = user.mercado_token.access_token;
    return { accessToken };
  } catch (error: any) {
    console.log(error);

    throw new Error(`Failed to update user: we got error: ${error.message}`);
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

export async function getAllOrders(searchParams: any, session: any) {
  try {
    const urlParams = {
      keyword: searchParams.keyword,
      page: searchParams.page,
    };
    const stringSession = JSON.stringify(session);
    // Filter out undefined values
    const filteredUrlParams = Object.fromEntries(
      Object.entries(urlParams).filter(([key, value]) => value !== undefined)
    );
    const searchQuery = new URLSearchParams(filteredUrlParams).toString();
    const URL = `${process.env.NEXTAUTH_URL}/api/orders?${searchQuery}`;
    const res = await fetch(URL, {
      headers: {
        Session: stringSession,
        "Content-Type": "application/json; charset=utf-8",
      },
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.log(error.message);
  }
}

export async function runRevalidationTo(path: string) {
  try {
    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export const getAffiliateDashboard = async (
  currentCookies: string,
  email: any
) => {
  const URL = `${process.env.NEXTAUTH_URL}/api/affiliate/dashboard`;
  const { data } = await axios.get(URL, {
    headers: {
      Cookie: currentCookies,
      userEmail: email,
    },
  });

  return data;
};

export async function payPOSDrawer(data: any) {
  try {
    let {
      items,
      transactionNo,
      payType,
      amountReceived,
      note,
      email,
      phone,
      name,
    } = Object.fromEntries(data);

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
      customerName = "PUBLICO GENERAL";
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
    const branchInfo = "Sucursal";
    const ship_cost = 0;
    const date = cstDateTime();

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
        // Check if there is enough stock
        if (variation.stock < item.quantity) {
          return {
            error: {
              title: { _errors: ["Este producto no cuenta con existencias"] },
            },
          };
        } else {
          variation.stock -= 1;
          product.stock -= 1;
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
    } catch (error: any) {
      console.log("dBberror", error);
    }

    // send email after order is confirmed
    if (
      customerEmail.includes("@noemail.com") ||
      customerEmail === "yunuencompany01@gmail.com"
    ) {
      console.log("did not send email");
    } else {
      try {
        const subject = "¡Gracias por tu compra!";
        const bodyOne = `Queríamos expresarte nuestro más sincero agradecimiento por haber elegido yunuencompany para realizar tu compra reciente. Nos complace enormemente saber que confías en nuestros productos/servicios.`;
        const bodyTwo = `Tu apoyo significa mucho para nosotros y nos comprometemos a brindarte la mejor experiencia posible. Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en ponerte en contacto con nuestro equipo de atención al cliente. Estamos aquí para ayudarte en cualquier momento.`;
        const title = "Recibo de compra";
        const greeting = `Estimado/a ${customer?.name}`;
        const senderName = "www.yunuencompany.com";
        const bestRegards = "¡Que tengas un excelente día!";
        const recipient_email = customer?.email;
        const sender_email = "yunuencompany01@gmail.com";
        const fromName = "yunuencompany";

        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GOOGLE_MAIL,
            pass: process.env.GOOGLE_MAIL_PASS,
          },
        });

        const formattedAmountPaid = formatter.format(
          newOrder?.paymentInfo?.amountPaid || 0
        );

        const mailOption = {
          from: `"${fromName}" ${sender_email}`,
          to: recipient_email,
          subject,
          html: `
        <!DOCTYPE html>
        <html lang="es">
        <body>
        <div>
        <p>${greeting}</p>
        <div>${bodyOne}</div>
        <p>${title}</p>
        <table style="width: 100%; font-size: 0.875rem; text-align: left;">
          <thead style="font-size: .7rem; color: #4a5568;  text-transform: uppercase;">
            <tr>
              <th style="padding: 0.75rem;">Nombre</th>
              <th style="padding: 0.75rem;">Tamaño</th>
              <th style="padding: 0.75rem;">Color</th>
              <th style="padding: 0.75rem;">Cant.</th>
              <th style="padding: 0.75rem;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${newOrder?.orderItems
              ?.map(
                (item: any, index: number) =>
                  `<tr style="background-color: #fff;" key="${index}">
                <td style="padding: 0.75rem;">${item.name}</td>
                <td style="padding: 0.75rem;">${item.size}</td>
                <td style="padding: 0.75rem;">${item.color}</td>
                <td style="padding: 0.75rem;">${item.quantity}</td>
                <td style="padding: 0.75rem;">${item.price}</td>
              </tr>`
              )
              .join("")}
              <tr>
              <div style="max-width: 100%; width: 100%; margin: 0 auto; background-color: #ffffff; display: flex; flex-direction: column; padding: 0.5rem;">
        ${
          newOrder?.orderStatus === "Apartado"
            ? `<ul style="margin-bottom: .75rem; padding-left: 0px;">
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Total de Artículos:</span>
              <span style="color: #48bb78;">
                ${await getQuantities(newOrder?.orderItems)} (Artículos)
              </span>
            </li>
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Sub-Total:</span>
              <span>
                ${(await subtotal(newOrder)) || 0}
              </span>
            </li>
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Total:</span>
              <span>
                ${(await getTotal(newOrder?.orderItems)) || 0}
              </span>
            </li>
            <li style="font-size: 1.25rem; font-weight: bold; border-top: 1px solid #cbd5e0; display: flex; justify-content: space-between; gap: 0.75rem; padding-top: 0.75rem;">
              <span>Abono:</span>
              <span>
                - ${formattedAmountPaid}
              </span>
            </li>
            <li style="font-size: 1.25rem; color: #ff9900; font-weight: bold; border-top: 1px solid #cbd5e0; display: flex; justify-content: space-between; gap: 0.75rem; padding-top: 0.25rem;">
              <span>Pendiente:</span>
              <span>
                ${
                  (await getPendingTotal(
                    newOrder?.orderItems,
                    newOrder?.paymentInfo?.amountPaid
                  )) || 0
                }
                
              </span>
            </li>
          </ul>`
            : `<ul style="margin-bottom: 1.25rem;">
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Sub-Total:</span>
              <span>
                ${(await subtotal(newOrder)) || 0}
              </span>
            </li>
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Total de Artículos:</span>
              <span style="color: #086e4f;">
                ${await getQuantities(newOrder?.orderItems)} (Artículos)
              </span>
            </li>
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Envió:</span>
              <span>
                ${newOrder?.ship_cost}
              </span>
            </li>
            <li style="font-size: 1.875rem; font-weight: bold; border-top: 1px solid #cbd5e0; display: flex; justify-content: space-between; gap: 0.75rem; margin-top: 1rem; padding-top: 0.75rem;">
              <span>Total:</span>
              <span>
                ${formattedAmountPaid}
                
              </span>
            </li>
          </ul>`
        }
        </div>
              </tr>
          </tbody>
        </table>
        <div>${bodyTwo}</div>
        <p>${senderName}</p>
        <p>${bestRegards}</p>
        </div>
        </body>
        </html>
        `,
        };

        await transporter.sendMail(mailOption);
      } catch (error: any) {
        console.log(error);
        throw Error(error);
      }
    }

    revalidatePath("/admin/");
    revalidatePath("/puntodeventa/");
    return { newOrder: newOrderString };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function payPOSSocialsDrawer(data: any) {
  try {
    let {
      items,
      transactionNo,
      payType,
      amountReceived,
      note,
      email,
      phone,
      name,
    } = Object.fromEntries(data);

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
      customerName = "SOCIALS";
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
    const branchInfo = "Socials";
    const ship_cost = 0;
    const date = cstDateTime();

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
        // Check if there is enough stock
        if (variation.stock < item.quantity) {
          return {
            error: {
              title: { _errors: ["Este producto no cuenta con existencias"] },
            },
          };
        } else {
          variation.stock -= 1;
          product.stock -= 1;
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
    } catch (error: any) {
      console.log("dBberror", error);
    }

    // send email after order is confirmed
    if (
      customerEmail.includes("@noemail.com") ||
      customerEmail === "yunuencompany01@gmail.com"
    ) {
      console.log("did not send email");
    } else {
      try {
        const subject = "¡Gracias por tu compra!";
        const bodyOne = `Queríamos expresarte nuestro más sincero agradecimiento por haber elegido yunuencompany para realizar tu compra reciente. Nos complace enormemente saber que confías en nuestros productos/servicios.`;
        const bodyTwo = `Tu apoyo significa mucho para nosotros y nos comprometemos a brindarte la mejor experiencia posible. Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en ponerte en contacto con nuestro equipo de atención al cliente. Estamos aquí para ayudarte en cualquier momento.`;
        const title = "Recibo de compra";
        const greeting = `Estimado/a ${customer?.name}`;
        const senderName = "www.yunuencompany.com";
        const bestRegards = "¡Que tengas un excelente día!";
        const recipient_email = customer?.email;
        const sender_email = "yunuencompany01@gmail.com";
        const fromName = "yunuencompany";

        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GOOGLE_MAIL,
            pass: process.env.GOOGLE_MAIL_PASS,
          },
        });

        const formattedAmountPaid = formatter.format(
          newOrder?.paymentInfo?.amountPaid || 0
        );

        const mailOption = {
          from: `"${fromName}" ${sender_email}`,
          to: recipient_email,
          subject,
          html: `
        <!DOCTYPE html>
        <html lang="es">
        <body>
        <div>
        <p>${greeting}</p>
        <div>${bodyOne}</div>
        <p>${title}</p>
        <table style="width: 100%; font-size: 0.875rem; text-align: left;">
          <thead style="font-size: .7rem; color: #4a5568;  text-transform: uppercase;">
            <tr>
              <th style="padding: 0.75rem;">Nombre</th>
              <th style="padding: 0.75rem;">Tamaño</th>
              <th style="padding: 0.75rem;">Color</th>
              <th style="padding: 0.75rem;">Cant.</th>
              <th style="padding: 0.75rem;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${newOrder?.orderItems
              ?.map(
                (item: any, index: number) =>
                  `<tr style="background-color: #fff;" key="${index}">
                <td style="padding: 0.75rem;">${item.name}</td>
                <td style="padding: 0.75rem;">${item.size}</td>
                <td style="padding: 0.75rem;">${item.color}</td>
                <td style="padding: 0.75rem;">${item.quantity}</td>
                <td style="padding: 0.75rem;">${item.price}</td>
              </tr>`
              )
              .join("")}
              <tr>
              <div style="max-width: 100%; width: 100%; margin: 0 auto; background-color: #ffffff; display: flex; flex-direction: column; padding: 0.5rem;">
        ${
          newOrder?.orderStatus === "Apartado"
            ? `<ul style="margin-bottom: .75rem; padding-left: 0px;">
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Total de Artículos:</span>
              <span style="color: #48bb78;">
                ${await getQuantities(newOrder?.orderItems)} (Artículos)
              </span>
            </li>
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Sub-Total:</span>
              <span>
                ${(await subtotal(newOrder)) || 0}
              </span>
            </li>
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Total:</span>
              <span>
                ${(await getTotal(newOrder?.orderItems)) || 0}
              </span>
            </li>
            <li style="font-size: 1.25rem; font-weight: bold; border-top: 1px solid #cbd5e0; display: flex; justify-content: space-between; gap: 0.75rem; padding-top: 0.75rem;">
              <span>Abono:</span>
              <span>
                - ${formattedAmountPaid}
              </span>
            </li>
            <li style="font-size: 1.25rem; color: #ff9900; font-weight: bold; border-top: 1px solid #cbd5e0; display: flex; justify-content: space-between; gap: 0.75rem; padding-top: 0.25rem;">
              <span>Pendiente:</span>
              <span>
                ${
                  (await getPendingTotal(
                    newOrder?.orderItems,
                    newOrder?.paymentInfo?.amountPaid
                  )) || 0
                }
                
              </span>
            </li>
          </ul>`
            : `<ul style="margin-bottom: 1.25rem;">
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Sub-Total:</span>
              <span>
                ${(await subtotal(newOrder)) || 0}
              </span>
            </li>
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Total de Artículos:</span>
              <span style="color: #086e4f;">
                ${await getQuantities(newOrder?.orderItems)} (Artículos)
              </span>
            </li>
            <li style="display: flex; justify-content: space-between; gap: 0.75rem; color: #4a5568; margin-bottom: 0.25rem;">
              <span>Envió:</span>
              <span>
                ${newOrder?.ship_cost}
              </span>
            </li>
            <li style="font-size: 1.875rem; font-weight: bold; border-top: 1px solid #cbd5e0; display: flex; justify-content: space-between; gap: 0.75rem; margin-top: 1rem; padding-top: 0.75rem;">
              <span>Total:</span>
              <span>
                ${formattedAmountPaid}
                
              </span>
            </li>
          </ul>`
        }
        </div>
              </tr>
          </tbody>
        </table>
        <div>${bodyTwo}</div>
        <p>${senderName}</p>
        <p>${bestRegards}</p>
        </div>
        </body>
        </html>
        `,
        };

        await transporter.sendMail(mailOption);
      } catch (error: any) {
        console.log(error);
        throw Error(error);
      }
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
    let orders;
    let products;
    let affiliates;
    let clients;
    let posts;
    let thisWeeksOrder;
    let totalPaymentsThisWeek;
    let dailyOrders;
    let dailyPaymentsTotals;
    let monthlyOrdersTotals;
    let yearlyOrdersTotals;

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

    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - today.getDay());
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
    startOfLastWeek.setDate(today.getDate() - 14);
    startOfLastWeek.setUTCHours(0, 0, 0, 0); // Set time to midnight

    // Clone the start of the current week to avoid mutating it
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Add six days to get to the end of the week
    endOfLastWeek.setUTCHours(23, 59, 59, 999); // Set time to the end of the day

    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    startOfLastMonth.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC

    // Clone the start of the current week to avoid mutating it
    const endOfLastMonth = new Date(startOfLastMonth);
    endOfLastMonth.setDate(startOfLastMonth.getDate() + 30); // Add six days to get to the end of the week
    endOfLastMonth.setUTCHours(23, 59, 59, 999); // Set time to the end of the day

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

    orders = await Order.find({ orderStatus: { $ne: "Cancelado" } })
      .sort({ createdAt: -1 }) // Sort in descending order of creation date
      .limit(5);

    affiliates = await Affiliate.find({ published: { $ne: "false" } })
      .sort({ createdAt: -1 }) // Sort in descending order of creation date
      .limit(5);
    clients = await Customer.find()
      .sort({ createdAt: -1 }) // Sort in descending order of creation date
      .limit(5);
    posts = await Post.find({ published: { $ne: "false" } })
      .sort({ createdAt: -1 }) // Sort in descending order of creation date
      .limit(5);

    let weeklyData: any = await Payment.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfLast7Days,
            $lt: endOfLast7Days,
          },
        },
      },
      {
        $group: {
          // Group by day using the $dateToString operator
          _id: { $dateToString: { format: "%m-%d-%Y", date: "$pay_date" } },
          totalAmount: { $sum: "$amount" },
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

    let dailyData: any = await Payment.aggregate([
      // Match documents for the desired day
      {
        $match: {
          // Filter documents based on the pay_date field
          pay_date: {
            $gte: startOfToday, // Start of the day
            $lt: endOfToday, // End of the day
          },
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
    dailyPaymentsTotals = await Payment.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfToday,
            $lt: endOfToday,
          },
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
    let yesterdaysOrdersTotals = await Payment.aggregate([
      {
        $match: {
          pay_date: {
            $gte: yesterday,
            $lt: endOfYesterday,
          },
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
            $gte: startOfLastWeek,
            $lt: endOfLastWeek,
          },
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
            $gte: startOfLastMonth,
            $lt: endOfLastMonth,
          },
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
            $gte: startOfLastYear,
            $lt: endOfLastYear,
          },
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

    totalPaymentsThisWeek = await Payment.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfLast7Days,
            $lt: endOfLast7Days,
          },
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
    let lastWeeksLayawayPaymentsTotals = await Payment.aggregate([
      {
        $match: {
          $and: [
            {
              pay_date: {
                $gte: startOfLastWeek,
                $lt: endOfLastWeek,
              },
            },
            {
              paymentIntent: "partial",
            },
          ],
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
    monthlyOrdersTotals = await Payment.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
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
    yearlyOrdersTotals = await Payment.aggregate([
      {
        $match: {
          pay_date: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }, // Sum up the amount field for each payment
        },
      },
    ]);

    products = await Product.find({ published: { $ne: "false" } })
      .sort({ createdAt: -1 }) // Sort in descending order of creation date
      .limit(5);

    const totalOrderCount = await Order.countDocuments({
      orderStatus: { $ne: "Cancelado" },
    });
    const totalPostCount = await Post.countDocuments();
    const totalCustomerCount = await Customer.countDocuments({
      name: { $ne: "SUCURSAL" },
    });
    const totalProductCount = await Product.countDocuments({
      published: { $ne: "false" },
    });
    const orderCountPreviousMonth = await getDocumentCountPreviousMonth(Order);

    orders = JSON.stringify(orders);
    clients = JSON.stringify(clients);
    dailyOrders = JSON.stringify(dailyOrders);
    affiliates = JSON.stringify(affiliates);
    products = JSON.stringify(products);
    posts = JSON.stringify(posts);
    weeklyData = JSON.stringify(weeklyData);
    dailyData = JSON.stringify(dailyData);
    thisWeeksOrder = JSON.stringify(thisWeeksOrder);
    totalPaymentsThisWeek = totalPaymentsThisWeek[0]?.total;
    dailyPaymentsTotals = dailyPaymentsTotals[0]?.total;

    yesterdaysOrdersTotals = yesterdaysOrdersTotals[0]?.total;
    monthlyOrdersTotals = monthlyOrdersTotals[0]?.total;
    yearlyOrdersTotals = yearlyOrdersTotals[0]?.total;
    lastWeeksPaymentsTotals = lastWeeksPaymentsTotals[0]?.total;
    lastMonthsPaymentsTotals = lastMonthsPaymentsTotals[0]?.total;
    lastYearsPaymentsTotals = lastYearsPaymentsTotals[0]?.total;
    return {
      dailyData: dailyData,
      weeklyData: weeklyData,
      orders: orders,
      clients: clients,
      posts: posts,
      affiliates: affiliates,
      dailyOrders: dailyOrders,
      dailyPaymentsTotals: dailyPaymentsTotals,
      yesterdaysOrdersTotals: yesterdaysOrdersTotals,
      thisWeeksOrder: thisWeeksOrder,
      products: products,
      totalOrderCount: totalOrderCount,
      totalCustomerCount: totalCustomerCount,
      orderCountPreviousMonth: orderCountPreviousMonth,
      totalProductCount: totalProductCount,
      totalPaymentsThisWeek: totalPaymentsThisWeek,
      monthlyOrdersTotals: monthlyOrdersTotals,
      yearlyOrdersTotals: yearlyOrdersTotals,
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
      if (session?.user?.role === "socials") {
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

export async function getSocialsDashboard() {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orders: any | undefined;
    let todaysOrders: any | undefined;
    let products: any | undefined;
    let thisWeeksOrder: any | undefined;
    let totalOrdersThisWeek: any | undefined;
    let dailyOrders: any | undefined;
    let dailyOrdersTotals: any | undefined;
    const today = newCSTDate();
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(
      startOfCurrentWeek.getDate() - startOfCurrentWeek.getDay()
    );
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
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

export async function addNewPage(data: any) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };
  let {
    category,
    preTitle,
    mainTitle,
    subTitle,
    mainImage,
    sections,
    createdAt,
  } = Object.fromEntries(data);

  sections = JSON.parse(sections);
  createdAt = new Date(createdAt);
  // validate form data
  const result = PageEntrySchema.safeParse({
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

  const slugExists = await Page.findOne({ slug: slug });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ["Este Titulo de Pagina ya esta en uso"] },
      },
    };
  }
  const { error } = await Page.create({
    category,
    preTitle,
    mainTitle,
    subTitle,
    slug,
    mainImage,
    sections,
    createdAt,
    published: true,
    authorId: { _id: session?.user._id },
  });
  if (error) throw Error(error);
  revalidatePath("/");
}

export async function updatePage(data: any) {
  const session = await getServerSession(options);
  let {
    _id,
    category,
    preTitle,
    mainTitle,
    subTitle,
    mainImage,
    sections,
    createdAt,
  } = Object.fromEntries(data);
  sections = JSON.parse(sections);
  const updatedAt = new Date(createdAt);
  // validate form data
  const result = PageUpdateSchema.safeParse({
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
  const slugExists = await Page.findOne({
    slug: slug,
    _id: { $ne: _id },
  });
  if (slugExists) {
    return {
      error: {
        title: { _errors: ["Este Titulo de Pagina ya esta en uso"] },
      },
    };
  }
  const { error }: any = await Page.updateOne(
    { _id },
    {
      category,
      preTitle,
      mainTitle,
      subTitle,
      slug,
      mainImage,
      sections,
      updatedAt,
      published: true,
      authorId: { _id: session?.user._id },
    }
  );
  if (error) throw Error(error);
  revalidatePath("/");
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
    let deliveryAddress = await Address.findOne(order.shippingInfo);
    let orderPayments: any = await Payment.find({ order: order._id });
    let customer = await Customer.findOne({ email: order.email });

    // convert to string
    order = JSON.stringify(order);
    deliveryAddress = JSON.stringify(deliveryAddress);
    orderPayments = JSON.stringify(orderPayments);
    customer = JSON.stringify(customer);

    return {
      order: order,
      customer: customer,
      deliveryAddress: deliveryAddress,
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
    if (
      session?.user?.role === "manager" ||
      session?.user?.role === "sucursal"
    ) {
      orderQuery = Order.find({ orderStatus: { $ne: "Cancelado" } }).populate(
        "user"
      );
    } else if (session?.user?.role === "afiliado") {
      const affiliate = await Affiliate.findOne({ user: session?.user?._id });
      orderQuery = Order.find({
        affiliateId: affiliate?._id.toString(),
        orderStatus: { $ne: "Cancelado" },
      }).populate("user");
    } else {
      orderQuery = Order.find({
        user: session?.user?._id,
        orderStatus: { $ne: "Cancelado" },
      }).populate("user");
    }

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

export async function updateOneSocialsOrder(data: any) {
  try {
    let { transactionNo, paidOn, note, amount, orderId } =
      Object.fromEntries(data);
    let newOrderStatus;
    let newOrderPaymentStatus;
    // Define the model name with the suffix appended with the lottery ID
    await dbConnect();
    // Retrieve the dynamically created Ticket model
    const order = await Order.findOne({ _id: orderId });
    // Calculate total amount based on items
    const date = cstDateTime();
    const orderTotal = await getTotalFromItems(order?.orderItems);
    if (order.paymentInfo.amountPaid + Number(amount) >= orderTotal) {
      newOrderStatus = "Entregado";
      newOrderPaymentStatus = "Pagado";
    } else {
      newOrderStatus = "Apartado";
      newOrderPaymentStatus = "Pendiente";
    }

    let payMethod;
    if (transactionNo === "EFECTIVO") {
      payMethod = "EFECTIVO";
    } else if (!isNaN(transactionNo)) {
      payMethod = "TERMINAL";
    } else {
      payMethod = "EFECTIVO";
    }
    const updatedOrder = await Order.updateOne(
      { _id: orderId },
      {
        orderStatus: newOrderStatus,
        "paymentInfo.status": newOrderPaymentStatus,
        $inc: { "paymentInfo.amountPaid": Number(amount) },
      }
    );

    const lastOrder = await Order.findById(orderId);

    let paymentTransactionData = {
      type: "socials",
      paymentIntent: "",
      amount: amount,
      comment: note,
      reference: transactionNo,
      pay_date: date,
      method: payMethod,
      order: lastOrder?._id,
      user: lastOrder?.user,
    };

    try {
      const newPaymentTransaction = await new Payment(paymentTransactionData);

      await newPaymentTransaction.save();
    } catch (error: any) {
      console.log("dBberror", error);
    }
    revalidatePath(`/admin/pedidos`);
    revalidatePath(`/admin/pedido/${lastOrder?._id}`);
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
    revalidatePath(`/socials/pedidos`);
    revalidatePath(`/socials/pedido/${orderId}`);
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
    expenseQuery = expenseQuery.sort({ createdAt: -1 });

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

export async function getAllPOSSocialsOrder(searchQuery: any) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orderQuery: any;
    if (session?.user?.role === "socials") {
      orderQuery = Order.find({
        $and: [{ branch: "socials" }, { orderStatus: { $ne: "Cancelado" } }],
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

export async function getHomeProductsData() {
  try {
    await dbConnect();
    // Extract tag values from post.tags array
    let trendingProducts: any = await Product.find({}).limit(100);
    let editorsProducts: any = await Product.find({}).limit(10);

    trendingProducts = JSON.stringify(trendingProducts);
    editorsProducts = JSON.stringify(editorsProducts);
    return {
      trendingProducts: trendingProducts,
      editorsProducts: editorsProducts,
    };
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

    if (product) {
      // Find the variation within the variations array
      let variation = product.variations.find(
        (variation: any) => variation._id.toString() === variationId
      );
      // Update the stock of the variation
      variation.stock -= 1; // Example stock update
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
    if (location === "MercadoLibre") {
      if (product.availability.socials === true) {
        product.availability.socials = false; // Remove from physical branch
      } else {
        product.availability.socials = true; // Add to physical branch
      }
    } else if (location === "Branch") {
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
    revalidatePath("/admin/pos/tienda");
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

    if (product) {
      // Find the variation within the variations array
      let variation = product.variations.find(
        (variation: any) => variation._id.toString() === variationId
      );
      return { currentStock: variation.stock };
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

    // Extract search parameters
    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get("perpage")) || 20;
    const page = Number(searchParams.get("page")) || 1;
    const skip = (page - 1) * resPerPage;

    // Create the aggregation query
    let productQuery = Product.aggregate([
      {
        $match: {
          $and: [{ stock: { $gt: 0 } }, { "availability.branch": true }],
        },
      },
      {
        $addFields: {
          numericTitle: { $toInt: "$title" }, // Convert title to integer
        },
      },
      {
        $sort: { numericTitle: -1 }, // Sort by numeric title
      },
      {
        $skip: skip, // Pagination - skip the appropriate number of documents
      },
      {
        $limit: resPerPage, // Pagination - limit the number of documents returned
      },
    ]);

    // Get the total count of products that match the criteria
    const productsCount = await Product.countDocuments({
      stock: { $gt: 0 },
      "availability.branch": true,
    });

    // Execute the query
    let productsData = await productQuery;

    // Convert the product data to a JSON string
    let products = JSON.stringify(productsData);

    // Return the products and count of filtered products
    return {
      products: products,
      filteredProductsCount: productsCount, // Use total count as filtered count
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllPOSMercadoLibreProduct(searchQuery: any) {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    // let productQuery = Product.find({
    //   $and: [{ stock: { $gt: 0 } }, { "availability.socials": true }],
    // });
    let productQuery = Product.find({
      $and: [{ "availability.socials": true }],
    });
    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get("perpage")) || 20;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get("page")) || 1;
    productQuery = productQuery.sort({ createdAt: -1 });
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
    let products = JSON.stringify(productsData);
    const testUsersData = await TestUser.find({});
    const testUsers = JSON.stringify(testUsersData);
    revalidatePath("/admin/mercadolibre/producto");
    return {
      products: products,
      testUsers: testUsers,
      filteredProductsCount: filteredProductsCount,
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

export async function getAllPOSMercadoLibreProductNoFilter() {
  try {
    await dbConnect();
    // Find the product that contains the variation with the specified variation ID
    let productsData = await Product.find({
      $and: [{ stock: { $gt: 0 } }, { "availability.socials": true }],
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
    if (
      session &&
      ["manager", "sucursal", "socials"].includes(session?.user?.role)
    ) {
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

    revalidatePath("/admin/mercadolibre/producto/");

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
    const clientsCount = await User.countDocuments();
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

    let sortedClients = clientsData
      .slice()
      .sort(
        (a: { createdAt: string }, b: { createdAt: string }) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    let clients = JSON.stringify(sortedClients);

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

export async function getAllAffiliate(searchQuery: any) {
  try {
    await dbConnect();
    const session = await getServerSession(options);
    let affiliateQuery: any;

    if (session) {
      if (session?.user?.role === "manager") {
        affiliateQuery = Affiliate.find({});
      }
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get("perpage")) || 5;
    // Extract page and per_page from request URL
    const page = Number(searchParams.get("page")) || 1;
    // total number of documents in database
    const affiliatesCount = await Affiliate.countDocuments();
    // Extract all possible categories
    // Apply search Filters
    const apiAffiliateFilters: any = new APIAffiliateFilters(
      affiliateQuery,
      searchParams
    )
      .searchAllFields()
      .filter();

    let affiliatesData = await apiAffiliateFilters.query;

    const filteredAffiliatesCount = affiliatesData.length;

    apiAffiliateFilters.pagination(resPerPage, page);
    affiliatesData = await apiAffiliateFilters.query.clone();

    let sortedAffiliates: any[] = affiliatesData
      .slice()
      .sort(
        (a: { createdAt: string }, b: { createdAt: string }) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    let affiliates = JSON.stringify(sortedAffiliates);

    return {
      affiliates: affiliates,
      affiliatesCount: affiliatesCount,
      filteredAffiliatesCount: filteredAffiliatesCount,
      resPerPage: resPerPage,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function getAllAffiliateOrder(searchQuery: any, id: any) {
  const session = await getServerSession(options);

  try {
    await dbConnect();
    const session = await getServerSession(options);
    let orderQuery: any;
    let affiliate;
    if (session) {
      orderQuery = Order.find({
        affiliateId: id,
        orderStatus: { $ne: "Cancelado" },
      });
      affiliate = await Affiliate.findOne({ _id: id });
    }

    const searchParams = new URLSearchParams(searchQuery);
    const resPerPage = Number(searchParams.get("perpage")) || 5;
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
    affiliate = JSON.stringify(affiliate);

    return {
      orders: orders,
      affiliate: affiliate,
      totalOrderCount: totalOrderCount,
      itemCount: itemCount,
      resPerPage: resPerPage,
    };
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}

export async function updateAffiliate(_id: any) {
  //check for errors
  await dbConnect();
  try {
    const affiliate = await Affiliate.findOne({ _id: _id });
    if (affiliate && affiliate.isActive === false) {
      affiliate.isActive = true;
    } else {
      affiliate.isActive = false;
    }
    affiliate.save();
    revalidatePath("/admin/clientes");
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

  // calculate product stock
  const stock = variations.reduce(
    (total: any, variation: any) => total + variation.stock,
    0
  );
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
  revalidatePath("/tienda");
}

export async function updateVariationProduct(data: any) {
  const session = await getServerSession(options);
  const user = { _id: session?.user?._id };

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

  // calculate product stock
  const stock = variations.reduce(
    (total: any, variation: any) => total + variation.stock,
    0
  );
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
  revalidatePath("/tienda");
}

export async function updateRevalidateProduct() {
  revalidatePath("/admin/productos");
  revalidatePath("/tienda");
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
  revalidatePath("/tienda");
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
