import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/collections';
import { getSession } from '@/lib/session';

/**
 * Next.js API Route replacing chat_api.php
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    const id_account = session ? session.user_id : 1; // Default to 1 for development/fallback

    const formData = await request.formData();
    const action = formData.get('action');

    if (action === 'get_contacts') {
      const occupantsRef = collection(db, COLLECTIONS.OCCUPANT);
      const occupantSnap = await getDocs(occupantsRef);

      const contacts = [];
      for (const occupantDoc of occupantSnap.docs) {
        const o = occupantDoc.data();
        
        // Fetch last message for this occupant
        const chatsRef = collection(db, COLLECTIONS.CHATS);
        const qLastMsg = query(
          chatsRef,
          where('id_occupant', '==', o.id_occupant),
          where('id_account', '==', id_account),
          orderBy('created_at', 'desc')
        );
        const chatSnap = await getDocs(qLastMsg);
        
        const lastMsg = chatSnap.docs.length > 0 ? chatSnap.docs[0].data() : null;
        
        // Count unread
        const qUnread = query(
          chatsRef,
          where('id_occupant', '==', o.id_occupant),
          where('id_account', '==', id_account),
          where('sender', '==', 'occupant'),
          where('is_read', '==', 0)
        );
        const unreadSnap = await getDocs(qUnread);
        
        if (lastMsg || o.telegram_id) {
          contacts.push({
            ...o,
            last_message: lastMsg ? lastMsg.message : null,
            last_time: lastMsg ? lastMsg.created_at : null,
            unread_count: unreadSnap.size,
            foto: o.foto && o.foto.trim() !== '' ? o.foto : 'images/faces/user.jpg',
          });
        }
      }

      // Sort by last_time desc
      contacts.sort((a, b) => {
        const timeA = a.last_time ? a.last_time.toMillis() : 0;
        const timeB = b.last_time ? b.last_time.toMillis() : 0;
        return timeB - timeA;
      });

      return NextResponse.json({ status: 'success', data: contacts });
    }

    if (action === 'get_messages') {
      const id_occupant = parseInt(formData.get('id_occupant') as string, 10);
      const viewer = formData.get('viewer') || 'account';

      // Update occupant last_active if viewer is occupant
      if (viewer === 'occupant') {
        const qOcc = query(collection(db, COLLECTIONS.OCCUPANT), where('id_occupant', '==', id_occupant));
        const occSnap = await getDocs(qOcc);
        if (!occSnap.empty) {
          await updateDoc(occSnap.docs[0].ref, { last_active: Timestamp.now() });
        }
      }

      // Fetch messages
      const chatsRef = collection(db, COLLECTIONS.CHATS);
      const qChats = query(
        chatsRef,
        where('id_occupant', '==', id_occupant),
        where('id_account', '==', id_account),
        orderBy('created_at', 'asc')
      );
      const chatSnap = await getDocs(qChats);

      const messages = [];
      for (const chatDoc of chatSnap.docs) {
        const c = chatDoc.data();
        
        // Mark as read based on viewer
        if (viewer === 'account' && c.sender === 'occupant' && c.is_read === 0) {
          await updateDoc(chatDoc.ref, { is_read: 1 });
          c.is_read = 1;
        } else if (viewer === 'occupant' && c.sender === 'account' && c.is_read === 0) {
          await updateDoc(chatDoc.ref, { is_read: 1 });
          c.is_read = 1;
        }

        // Filter out deleted messages if viewed by occupant
        if (viewer === 'occupant' && c.deleted_by_occupant === 1) {
          continue;
        }

        messages.push({
          id_chat: chatDoc.id,
          ...c,
        });
      }

      return NextResponse.json({ status: 'success', data: messages });
    }

    if (action === 'send_message') {
      const id_occupant = parseInt(formData.get('id_occupant') as string, 10);
      const message = formData.get('message') as string;
      const sender = formData.get('sender') || 'account';
      const reply_to_chat_id = formData.get('reply_to_chat_id');

      if (!message || !message.trim()) {
        return NextResponse.json({ status: 'error', message: 'Message cannot be empty.' });
      }

      const docRef = await addDoc(collection(db, COLLECTIONS.CHATS), {
        id_account,
        id_occupant,
        sender,
        message: message.trim(),
        is_read: 0,
        deleted_by_occupant: 0,
        is_pinned: 0,
        reply_to_chat_id: reply_to_chat_id || null,
        created_at: Timestamp.now(),
      });

      // Insert logic to push notification / telegram bot API here

      return NextResponse.json({ status: 'success', id: docRef.id });
    }

    if (action === 'delete_message') {
      const id_chat = formData.get('id_chat') as string;
      const deleter = formData.get('deleter') || 'account';

      if (deleter === 'account') {
        await deleteDoc(doc(db, COLLECTIONS.CHATS, id_chat));
      } else {
        await updateDoc(doc(db, COLLECTIONS.CHATS, id_chat), { deleted_by_occupant: 1 });
      }

      return NextResponse.json({ status: 'success' });
    }

    if (action === 'delete_all_chats') {
      const id_occupant = parseInt(formData.get('id_occupant') as string, 10);
      
      const chatsRef = collection(db, COLLECTIONS.CHATS);
      const qChats = query(
        chatsRef,
        where('id_occupant', '==', id_occupant),
        where('id_account', '==', id_account)
      );
      const chatSnap = await getDocs(qChats);
      
      for (const chatDoc of chatSnap.docs) {
        await deleteDoc(chatDoc.ref);
      }
      
      return NextResponse.json({ status: 'success' });
    }

    return NextResponse.json({ status: 'error', message: 'Unknown action' });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
