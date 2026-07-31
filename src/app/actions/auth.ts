'use server';

import { compare } from 'bcryptjs';
import { createSession, destroySession } from '@/lib/session';
import { getByField, insertWithAutoId, toTimestamp } from '@/lib/firestore-helpers';
import { COLLECTIONS } from '@/lib/collections';
import { Timestamp } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

/**
 * Server Action: Login
 * Replaces the POST handler in login.php
 *
 * Flow (1:1 with PHP):
 * 1. Look up account by username
 * 2. Verify password (bcrypt hash OR plain-text fallback via password_enc)
 * 3. Create session (JWT cookie)
 * 4. Log to login_history
 * 5. Redirect to /dashboard
 */
export async function loginAction(formData: FormData) {
  const username = (formData.get('username') as string)?.trim() || '';
  const password = (formData.get('password') as string) || '';

  if (!username || !password) {
    return { success: false, error: 'Username and password are required.' };
  }

  try {
    // SELECT * FROM account WHERE username = ?
    const user = await getByField(COLLECTIONS.ACCOUNT, 'username', username);

    if (!user) {
      return { success: false, error: 'Invalid Username or Password.' };
    }

    // Check password hash or plain fallback
    // Mirrors: password_verify($password, $user['password']) || $password === $user['password_enc']
    let passwordValid = false;

    if (user.password) {
      try {
        passwordValid = await compare(password, user.password);
      } catch {
        passwordValid = false;
      }
    }

    if (!passwordValid && user.password_enc) {
      passwordValid = password === user.password_enc;
    }

    if (!passwordValid) {
      return { success: false, error: 'Invalid Username or Password.' };
    }

    // Create session — mirrors $_SESSION assignments
    await createSession({
      user_id: user.id_account,
      name: user.name,
      username: user.username,
      role: 'account',
    });

    // Log to login_history — mirrors INSERT INTO login_history
    try {
      const headersList = await headers();
      const device = headersList.get('user-agent') || 'Unknown Device';
      const ip =
        headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        headersList.get('x-real-ip') ||
        'Unknown IP';

      await insertWithAutoId(COLLECTIONS.LOGIN_HISTORY, 'id_log', {
        id_account: user.id_account,
        device_info: device,
        ip_address: ip,
        login_time: Timestamp.now(),
      });
    } catch {
      // Non-critical — continue even if logging fails (same as PHP try/catch)
    }

    return { success: true, redirect: '/dashboard' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'System error. Please try again.' };
  }
}

/**
 * Server Action: Logout
 * Replaces: session_destroy() + redirect to login.php
 */
export async function logoutAction() {
  await destroySession();
  redirect('/login');
}
