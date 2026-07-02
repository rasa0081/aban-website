import { NextResponse } from 'next/server';

// POST /api/auth  — validate credentials server-side
// Credentials live in environment variables, never shipped to the browser.
export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validUsername || !validPassword) {
      console.error('ADMIN_USERNAME / ADMIN_PASSWORD env vars are not set');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (username === validUsername && password === validPassword) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}