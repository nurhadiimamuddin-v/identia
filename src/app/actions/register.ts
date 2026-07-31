'use server';

import { hash } from 'bcryptjs';
import { getByField, insertWithAutoId, toTimestamp } from '@/lib/firestore-helpers';
import { COLLECTIONS } from '@/lib/collections';
import { Timestamp } from 'firebase/firestore';

/**
 * Server Action: Register Account
 * Replaces the POST handler in register.php
 *
 * Flow (1:1 with PHP):
 * 1. Validate all fields
 * 2. Check for duplicate username
 * 3. Upload photo to Firebase Storage (placeholder: store path)
 * 4. Hash password with bcrypt
 * 5. Generate code_register
 * 6. Insert into account collection with status='rejected' (needs approval)
 * 7. Return success (in PHP this redirects to pin.php for PIN setup)
 */
export async function registerAction(formData: FormData) {
  const name = (formData.get('name') as string)?.trim() || '';
  const username = (formData.get('username') as string)?.trim() || '';
  const password = (formData.get('password') as string) || '';
  const confirmPassword = (formData.get('confirm_password') as string) || '';

  // Validate required fields
  if (!name || !username || !password || !confirmPassword) {
    return { success: false, error: 'All fields are required.' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' };
  }

  try {
    // Check for duplicate username
    // Mirrors: SELECT id_account FROM account WHERE username = ?
    const existing = await getByField(COLLECTIONS.ACCOUNT, 'username', username);
    if (existing) {
      return { success: false, error: 'Username already taken. Please use a different one.' };
    }

    // Generate registration code — mirrors: sprintf("%06d", mt_rand(1, 999999))
    const codeRegister = String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0');

    // Hash password — mirrors: password_hash($password, PASSWORD_DEFAULT)
    const passwordHash = await hash(password, 10);

    // For now, foto will be handled separately via Firebase Storage upload
    // In PHP, the file is uploaded to uploads/ directory
    const fotoPath = ''; // Will be set after file upload

    // Insert into Firestore — mirrors: INSERT INTO account
    const result = await insertWithAutoId(COLLECTIONS.ACCOUNT, 'id_account', {
      name,
      username,
      password: passwordHash,
      password_enc: password, // Mirrors: $password_enc = $password (plain stored for legacy)
      pin: null,
      foto: fotoPath,
      finger_id: null,
      finger_device: null,
      code_register: codeRegister,
      status: 'rejected', // Mirrors: $status = 'rejected' (needs admin approval)
      is_new: 1,
    });

    return {
      success: true,
      accountId: result.id,
      codeRegister,
      message: 'Registration successful. Please wait for admin approval.',
    };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'System error. Please try again.' };
  }
}

/**
 * Server Action: Check Username Availability
 * Replaces: check_username.php (AJAX endpoint)
 */
export async function checkUsernameAction(username: string) {
  if (!username || username.trim().length < 3) {
    return { available: false, message: 'Username must be at least 3 characters.' };
  }

  const existing = await getByField(COLLECTIONS.ACCOUNT, 'username', username.trim());
  if (existing) {
    return { available: false, message: 'Username is already taken.' };
  }

  return { available: true, message: 'Username is available.' };
}
