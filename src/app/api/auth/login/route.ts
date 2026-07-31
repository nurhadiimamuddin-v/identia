import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ilockgada-secret-key-change-in-production'
);

const COOKIE_NAME = 'ilockgada_session';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Bypass check for user test request
    if (username === 'nurhadiimamuddin' && password === '180105') {
      const token = await new SignJWT({
        username: 'nurhadiimamuddin',
        role: 'admin',
        id_account: 1
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);

      const response = NextResponse.json({ success: true, message: 'Login berhasil' });
      response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    // Since Firebase config is mock, any other login will fail for now until env is set
    return NextResponse.json({ success: false, message: 'Invalid credentials or Firebase not configured' }, { status: 401 });

  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
