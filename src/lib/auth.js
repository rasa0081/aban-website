import { NextResponse } from 'next/server';

// ── Simple session validation ────────────────────────────────────────────────
// The admin page stores a session token in localStorage after successful login
// via POST /api/auth. We validate it by checking the Authorization header.
//
// For now this uses a simple approach: the admin page sends the credentials
// as a Base64-encoded token (username:password). The server validates against
// env vars. In production, consider using JWT or a proper session store.
export async function requireAuth(request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized — please log in' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    // Decode Base64 token → "username:password"
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validUsername || !validPassword) {
      console.error('ADMIN_USERNAME / ADMIN_PASSWORD env vars are not set');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return null; // Auth passed
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
