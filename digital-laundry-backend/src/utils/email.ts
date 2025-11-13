
import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: env.SMTP_USER && env.SMTP_PASS ? {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  } : undefined,
});

export async function sendMail(opts: { to: string; subject: string; html: string; }) {
  if (!env.SMTP_HOST) {
    console.warn('SMTP not configured. Email would be sent:', opts);
    return;
  }
  await transporter.sendMail({ from: env.SMTP_FROM, ...opts });
}
