import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: any) {
  try {
    const {
      subject,
      body,
      title,
      greeting,
      bestRegards,
      recipient_email,
      sender_email,
      name,
    } = await request.json();

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_MAIL,
        pass: process.env.GOOGLE_MAIL_PASS,
      },
    });

    const mailOption = {
      from: `"${name}" ${sender_email}`,
      to: recipient_email,
      subject,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <body>
        <p>${greeting}</p>
        <p>${title}</p>
        <div>${body}</div>
        <p>${bestRegards}</p>
        </body>
        
        </html>
        
        `,
    };

    await transporter.sendMail(mailOption);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }
}
