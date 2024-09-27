import dbConnect from "@/lib/db";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "@/backend/models/User";
import { NextResponse } from "next/server";
import axios from "axios";
import Customer from "@/backend/models/Customer";

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
    const {
      username,
      email,
      phone,
      password: pass,
      recaptcha,
      honeypot,
    } = await request.json();

    if (honeypot) {
      console.log("no bots thank you!");
      throw new Error("hubo un error al iniciar session");
    }
    const secretKey = process?.env?.RECAPTCHA_SECRET_KEY;
    const formData = `secret=${secretKey}&response=${recaptcha}`;
    let response: any;
    try {
      response = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
    } catch (error) {
      console.log("recaptcha error:", error);
    }

    if (response && response.data?.success && response.data?.score > 0.5) {
      // Save data to the database from here
      await dbConnect();
      const isExistingUser = await User?.findOne({
        $or: [{ email: email }, { phone: phone }],
      });
      const isExistingCustomer = await Customer?.findOne({
        $or: [{ email: email }, { phone: phone }],
      });
      if (isExistingUser || isExistingCustomer) {
        return new Response("User is already registered", { status: 400 });
      }
      const name = username;
      // Generate a random 64-byte token
      const verificationToken = crypto.randomBytes(64).toString("hex");

      const hashedPassword = await bcrypt.hash(pass, 10);
      const newUser = new User({
        name,
        email,
        verificationToken,
        password: hashedPassword,
      });

      const newCustomer = new Customer({
        name,
        email,
        phone,
        user: newUser._id,
      });

      const res = await newUser.save();

      // if (res?._id) {
      //   await newCustomer.save();
      //   try {
      //     const subject = "Confirmar email";
      //     const body = `Por favor da click en confirmar email para verificar tu cuenta.`;
      //     const title = "Completar registro";
      //     const greeting = `Saludos ${name}`;
      //     const action = "CONFIRMAR EMAIL";
      //     const bestRegards = "Gracias por unirte a nuestro sitio.";
      //     const recipient_email = email;
      //     const sender_email = "yunuencompany01@gmail.com";
      //     const fromName = "yunuencompany";

      //     var transporter = nodemailer.createTransport({
      //       service: "gmail",
      //       auth: {
      //         user: process.env.GOOGLE_MAIL,
      //         pass: process.env.GOOGLE_MAIL_PASS,
      //       },
      //     });

      //     const mailOption = {
      //       from: `"${fromName}" ${sender_email}`,
      //       to: recipient_email,
      //       subject,
      //       html: `
      //       <!DOCTYPE html>
      //       <html lang="es">
      //       <body>
      //       <p>${greeting}</p>
      //       <p>${title}</p>
      //       <div>${body}</div>
      //       <a href="${process.env.NEXTAUTH_URL}/exito?token=${verificationToken}">${action}</a>
      //       <p>${bestRegards}</p>
      //       </body>

      //       </html>

      //       `,
      //     };

      //     await transporter.sendMail(mailOption);

      //     return NextResponse.json(
      //       { message: "Email sent successfully" },
      //       { status: 200 }
      //     );
      //   } catch (error) {
      //     console.log(error);
      //     return NextResponse.json(
      //       { message: "Failed to send email" },
      //       { status: 500 }
      //     );
      //   }
      // }
      //return new Response('New user registered', { status: 200 });
      console.log("response.data?.score:", response.data?.score);

      return NextResponse.json({
        message: "New user registered",
        success: true,
        email,
        score: response.data?.score,
      });
    } else {
      console.log("fail: res.data?.score:", response.data?.score);
      return NextResponse.json({
        success: false,
        email,
        score: response.data?.score,
      });
    }
  } catch (error: any) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}
