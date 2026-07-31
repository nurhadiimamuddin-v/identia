import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'ilockgada-secret-key-change-in-production'
);

const COOKIE_NAME = 'ilockgada_session';

// Routes that require authentication (admin panel)
const protectedPaths = [
  '/dashboard',
  '/account',
  '/room',
  '/access',
  '/history',
  '/schedule',
  '/chats',
  '/notifications',
  '/occupant',
];

// Routes that should redirect to dashboard if already logged in
const authPaths = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      // Token invalid or expired
      isAuthenticated = false;
    }
  }

  // Check if accessing protected route without auth
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check if accessing auth pages while already logged in
  const isAuthPage = authPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  if (isAuthPage && isAuthenticated) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and api
    '/((?!_next/static|_next/image|favicon.ico|images|css|js|vendors|fonts|api).*)',
  ],
};
