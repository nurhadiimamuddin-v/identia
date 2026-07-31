import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/collections';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const action = formData.get('action');
    const id = formData.get('id') as string;

    const notifRef = collection(db, COLLECTIONS.NOTIFICATIONS);

    if (action === 'check_new') {
      const qNew = query(
        notifRef,
        where('is_read', '==', 0),
        where('is_deleted', '==', 0),
        orderBy('time', 'desc'),
        limit(1)
      );
      const snap = await getDocs(qNew);
      const notif = snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
      return NextResponse.json({ status: 'success', data: notif });
    }

    if (action === 'mark_read' && id) {
      await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id), { is_read: 1 });
      return NextResponse.json({ status: 'success' });
    }

    if (action === 'mark_all_read') {
      const qActive = query(notifRef, where('is_deleted', '==', 0));
      const snap = await getDocs(qActive);
      const updates = snap.docs.map((d) => updateDoc(d.ref, { is_read: 1 }));
      await Promise.all(updates);
      return NextResponse.json({ status: 'success' });
    }

    if (action === 'delete_all_to_trash') {
      const qActive = query(notifRef, where('is_deleted', '==', 0));
      const snap = await getDocs(qActive);
      const updates = snap.docs.map((d) =>
        updateDoc(d.ref, { is_deleted: 1, deleted_at: Timestamp.now() })
      );
      await Promise.all(updates);
      return NextResponse.json({ status: 'success' });
    }

    if (action === 'move_trash' && id) {
      await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id), {
        is_deleted: 1,
        deleted_at: Timestamp.now(),
      });
      return NextResponse.json({ status: 'success' });
    }

    if (action === 'restore' && id) {
      await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id), {
        is_deleted: 0,
        deleted_at: null,
      });
      return NextResponse.json({ status: 'success' });
    }

    if (action === 'delete_permanently' && id) {
      await deleteDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id));
      return NextResponse.json({ status: 'success' });
    }

    if (action === 'empty_trash') {
      const qTrash = query(notifRef, where('is_deleted', '==', 1));
      const snap = await getDocs(qTrash);
      const deletions = snap.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deletions);
      return NextResponse.json({ status: 'success' });
    }

    if (action === 'create_notification') {
      const icon = (formData.get('icon') as string) || 'mdi-information';
      const title = (formData.get('title') as string) || 'Info';
      const message = (formData.get('message') as string) || '';
      const detail = (formData.get('detail') as string) || '';
      const is_danger = formData.get('is_danger') === '1' ? 1 : 0;

      await addDoc(notifRef, {
        icon,
        title,
        message,
        detail,
        time: Timestamp.now(),
        is_read: 0,
        is_danger,
        is_deleted: 0,
      });

      return NextResponse.json({ status: 'success' });
    }

    if (action === 'get_warnings') {
      // Exclude logic requires careful indexing in Firestore or client-side filtering.
      // We will do a generic fetch for danger and filter in memory since notifications count is usually low.
      const qWarnings = query(
        notifRef,
        where('is_deleted', '==', 0),
        where('is_read', '==', 0),
        orderBy('time', 'desc')
      );
      const snap = await getDocs(qWarnings);

      const excludeWords = ['baterai', 'battery', 'pesan', 'message', 'chat'];
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));

      const filtered = docs.filter((n) => {
        const t = (n.title || '').toLowerCase();
        return !excludeWords.some((word) => t.includes(word));
      });

      const warnings = filtered.filter((n) => n.is_danger === 1).slice(0, 5);
      const danger_unread = filtered.filter((n) => n.is_danger === 1).length;
      const total_unread = filtered.length;

      return NextResponse.json({ status: 'success', warnings, total_unread, danger_unread });
    }

    return NextResponse.json({ status: 'error', message: 'Invalid action' });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // Support GET request fallback for simple actions if needed
  return POST(request);
}
