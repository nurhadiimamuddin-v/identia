import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, addDoc, Timestamp, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/collections';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8184881871:AAFOz6uzIgxE7rk3WttcKKrr0DtcNGIt-Ho'; // Using the one from bot.php for now
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function tgRequest(method: string, data: any) {
  try {
    const res = await fetch(`${API_URL}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error('Telegram API Error:', error);
    return null;
  }
}

// Emulates auto_delete.php behavior (Background countdown & delete)
function runAutoDeleteTask(chatId: string, msgId: string, token: string, type: string, origText: string) {
  const expiresAt = Date.now() + 300 * 1000; // 5 minutes
  
  // Note: On Vercel this background task may be terminated before 5 mins.
  // On a standard Node.js server, it will run completely.
  const interval = setInterval(async () => {
    const now = Date.now();
    const remaining = expiresAt - now;
    
    if (remaining <= 0) {
      clearInterval(interval);
      await tgRequest('deleteMessage', { chat_id: chatId, message_id: msgId });
      
      // Cleanup token from Firestore
      const tokenRef = doc(db, 'bot_tokens', token);
      await deleteDoc(tokenRef);
      return;
    }

    const mins = Math.floor((remaining / 1000) / 60);
    const secs = Math.floor((remaining / 1000) % 60);
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
    const newText = `${origText}\n⏳ <i>Sisa waktu: ${timeStr}</i>`;

    await tgRequest('editMessageText', {
      chat_id: chatId,
      message_id: msgId,
      text: newText,
      parse_mode: 'HTML',
    });
  }, 2000); // Update every 2 seconds instead of 1 to reduce rate limits
}

export async function POST(request: Request) {
  try {
    const update = await request.json();

    if (!update) return NextResponse.json({ success: false });

    // Handle incoming messages
    if (update.message) {
      const chatId = update.message.chat.id.toString();

      // /start Command
      if (update.message.text === '/start') {
        const text = "Halo! Saya adalah <b>Identia</b>.\n\nPenting untuk diketahui: <b>Ini bukanlah Bot otomatis yang bisa menjawab pesan secara otomatis</b>. Ini adalah <b>saluran interaksi langsung</b> untuk terhubung secara personal dengan Admin Identia.\n\nNamun, untuk memulai obrolan langsung dengan Admin, kami perlu memverifikasi data Anda terlebih dahulu.\n\n👇 <b>Silakan Bagikan Kontak Terlebih Dahulu untuk Berinteraksi Langsung dengan Admin</b>\n\n<i>Catatan: Setelah berhasil, Anda dapat mengakses menu bantuan dengan mengetik /help.</i>";
        
        await tgRequest('sendMessage', {
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
          reply_markup: {
            keyboard: [[{ text: '📱 Bagikan Kontak Saya', request_contact: true }]],
            resize_keyboard: true,
            is_persistent: true
          }
        });
        return NextResponse.json({ success: true });
      }

      // Contact Verification
      if (update.message.contact) {
        const phoneNumber = update.message.contact.phone_number;
        const normalizedPhone = phoneNumber.replace(/^\+?62/, '0');
        const intlPhone = "62" + normalizedPhone.substring(1);

        const occRef = collection(db, COLLECTIONS.OCCUPANT);
        const qOcc = query(occRef, where('no_hp', 'in', [phoneNumber, normalizedPhone, intlPhone]));
        const occSnap = await getDocs(qOcc);

        if (!occSnap.empty) {
          const occDoc = occSnap.docs[0];
          await updateDoc(occDoc.ref, { telegram_id: chatId });

          const text = "✅ <b>Verifikasi Berhasil!</b>\n\nNomor Anda telah terverifikasi sebagai Penghuni <b>Identia</b> yang sah.\n\nSaat ini, Anda sudah <b>Terhubung Langsung</b> dengan saluran pribadi Admin <b>Identia</b>.\n\nSilakan sampaikan pertanyaan, laporan kendala, atau pesan Anda di sini kapan pun Anda butuhkan. Admin akan membalas pesan Anda dari Control Panel sesegera mungkin.";
          
          await tgRequest('sendMessage', {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            reply_markup: { remove_keyboard: true }
          });
        } else {
          await tgRequest('sendMessage', {
            chat_id: chatId,
            text: `Maaf, nomor handphone Anda (${phoneNumber}) tidak ditemukan pada daftar Penghuni Identia.\n\nPastikan Anda mendaftar melalui Admin terlebih dahulu.`
          });
        }
        return NextResponse.json({ success: true });
      }

      // Normal Text Message (Chat routing)
      if (update.message.text && !update.message.text.startsWith('/')) {
        const text = update.message.text;
        
        // Find occupant
        const occRef = collection(db, COLLECTIONS.OCCUPANT);
        const qOcc = query(occRef, where('telegram_id', '==', chatId));
        const occSnap = await getDocs(qOcc);

        if (!occSnap.empty) {
          const occDoc = occSnap.docs[0];
          const occupantData = occDoc.data();

          // Assuming admin account ID is 1
          await addDoc(collection(db, COLLECTIONS.CHATS), {
            id_account: 1, 
            id_occupant: occupantData.id_occupant,
            sender: 'occupant',
            message: text,
            is_read: 0,
            deleted_by_occupant: 0,
            telegram_msg_id: update.message.message_id,
            created_at: Timestamp.now(),
          });
        }
        return NextResponse.json({ success: true });
      }

      // /help Command
      if (update.message.text === '/help') {
        const text = "<b>Pusat Bantuan & Layanan Mandiri</b>\nSilakan pilih layanan di bawah ini:\n\n<i>Pesan ini akan terhapus otomatis dalam 5 Menit!</i>";
        
        const inlineKeyboard = {
          inline_keyboard: [
            [{ text: "🔑 Input PIN Darurat", callback_data: "cmd_pin" }],
            [{ text: "📸 Verifikasi Wajah", callback_data: "cmd_wajah" }],
            [{ text: "✏️ Pembaruan Identitas", callback_data: "cmd_edit" }]
          ]
        };

        await tgRequest('sendMessage', {
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
          reply_markup: inlineKeyboard
        });
        
        // Optionally run auto-delete here if needed (omitted for brevity, handled below mostly)
        return NextResponse.json({ success: true });
      }
    }

    // Callback Queries (Inline button clicks)
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const chatId = callbackQuery.message.chat.id.toString();
      const msgId = callbackQuery.message.message_id;
      const data = callbackQuery.data;

      // Verify occupant exists
      const occRef = collection(db, COLLECTIONS.OCCUPANT);
      const qOcc = query(occRef, where('telegram_id', '==', chatId));
      const occSnap = await getDocs(qOcc);

      if (occSnap.empty) {
        await tgRequest('answerCallbackQuery', { callback_query_id: callbackQuery.id, text: "Akses Ditolak: Telegram belum ditautkan", show_alert: true });
        return NextResponse.json({ success: true });
      }

      const occupantId = occSnap.docs[0].data().id_occupant;
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      let type = '';
      let origText = '';
      let url = '';

      if (data === 'cmd_pin') {
        type = 'pin';
        origText = "Silakan klik tombol di bawah ini untuk memulai verifikasi darurat.";
        url = `https://your-domain.com/verify_any_pin.php?token=${token}`; // Domain placeholder
      } else if (data === 'cmd_wajah') {
        type = 'foto';
        origText = "Silakan klik tombol di bawah ini untuk memulai verifikasi wajah.";
        url = `https://your-domain.com/verifikasi_wajah.php?token=${token}`;
      } else if (data === 'cmd_edit') {
        type = 'edit';
        origText = "Sistem Pembaruan Data Identitas telah disediakan untuk Anda.";
        url = `https://your-domain.com/edit_data.php?token=${token}`;
      }

      if (type) {
        const replyMarkup = {
          inline_keyboard: [[{ text: "Buka Tautan", web_app: { url } }]]
        };

        // Save token to Firestore
        await setDoc(doc(db, 'bot_tokens', token), {
          type,
          id_occupant: occupantId,
          created_at: Timestamp.now(),
          expires_at: Date.now() + 300 * 1000
        });

        const newText = `${origText}\n⏳ <i>Sisa waktu: 5:00</i>`;
        await tgRequest('editMessageText', {
          chat_id: chatId,
          message_id: msgId,
          text: newText,
          parse_mode: 'HTML',
          reply_markup: replyMarkup
        });

        // Trigger background deletion task (async, not awaited)
        runAutoDeleteTask(chatId, msgId, token, type, origText);
      }

      await tgRequest('answerCallbackQuery', { callback_query_id: callbackQuery.id });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
