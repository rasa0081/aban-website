import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

// POST /api/contact  — save a contact form submission
// Stores the message as a SiteContent entry so the admin can read it.
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'نام، ایمیل و پیام الزامی هستند.' }, { status: 400 });
    }

    // Persist as a JSON blob under a timestamped key so nothing is lost.
    const key = `contact_submission_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const value = JSON.stringify({ name, email, phone, subject, message, receivedAt: new Date().toISOString() });

    await prisma.siteContent.create({ data: { key, value } });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json({ error: 'خطا در ارسال پیام' }, { status: 500 });
  }
}