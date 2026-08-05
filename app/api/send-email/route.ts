import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

type EmailPayload = {
  fullName: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("sr-RS", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.ADMIN_EMAIL
  );
}

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { sent: false, message: "Email nije konfigurisan" },
      { status: 200 }
    );
  }

  try {
    const data: EmailPayload = await request.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const formattedDate = formatDate(data.date);

    await transporter.sendMail({
      from: `"Elitte Bella Italia" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Nova rezervacija stola — ${data.fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="color: #C4A35A;">Nova rezervacija stola</h2>
          <div style="background: #111; color: #f5f0e8; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px;"><strong>Ime:</strong> ${data.fullName}</p>
            <p style="margin: 0 0 8px;"><strong>Telefon:</strong> ${data.phone}</p>
            <p style="margin: 0 0 8px;"><strong>Broj osoba:</strong> ${data.guests}</p>
            <p style="margin: 0 0 8px;"><strong>Datum:</strong> ${formattedDate}</p>
            <p style="margin: 0;"><strong>Vrijeme:</strong> ${data.time}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { sent: false, message: "Greška pri slanju emaila" },
      { status: 500 }
    );
  }
}
