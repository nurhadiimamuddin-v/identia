import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, Timestamp } from 'firebase/firestore';
import { randomBytes } from 'crypto';

export async function GET() {
  try {
    const tokensRef = collection(db, 'door_tokens');
    const currentTime = Date.now();
    const fiveMinsAgo = currentTime - 300 * 1000; // 5 minutes

    // Cleanup expired or used tokens
    // Equivalent to the manual file loop in api_generate_door_token.php
    const qExpired = query(
      tokensRef,
      where('created_at', '<=', Timestamp.fromMillis(fiveMinsAgo))
    );
    const expiredSnap = await getDocs(qExpired);
    for (const doc of expiredSnap.docs) {
      await deleteDoc(doc.ref);
    }

    const qUsed = query(tokensRef, where('used', '==', true));
    const usedSnap = await getDocs(qUsed);
    for (const doc of usedSnap.docs) {
      await deleteDoc(doc.ref);
    }

    // Generate new random token (32 hex chars)
    const newToken = randomBytes(16).toString('hex');

    await addDoc(tokensRef, {
      token: newToken,
      created_at: Timestamp.fromMillis(currentTime),
      used: false
    });

    return NextResponse.json({
      status: 'success',
      token: newToken,
      expires_in: 300
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
