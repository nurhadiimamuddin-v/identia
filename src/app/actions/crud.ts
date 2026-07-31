'use server';

import {
  getAll,
  getById,
  insertWithAutoId,
  updateById,
  deleteById,
  getByField,
  toTimestamp,
  where,
  orderBy,
} from '@/lib/firestore-helpers';
import { COLLECTIONS } from '@/lib/collections';
import { getSession } from '@/lib/session';
import { Timestamp } from 'firebase/firestore';

// ==================== ACCOUNT CRUD ====================

/**
 * Get all accounts.
 * Replaces: SELECT * FROM account ORDER BY id_account DESC
 */
export async function getAccounts() {
  return await getAll(COLLECTIONS.ACCOUNT, [orderBy('id_account', 'desc')]);
}

/**
 * Get a single account by ID.
 * Replaces: SELECT * FROM account WHERE id_account = ?
 */
export async function getAccountById(id: number) {
  return await getById(COLLECTIONS.ACCOUNT, String(id));
}

/**
 * Delete an account.
 * Replaces: DELETE FROM account WHERE id_account = ?
 */
export async function deleteAccount(id: number) {
  await deleteById(COLLECTIONS.ACCOUNT, String(id));
  return { success: true };
}

/**
 * Toggle account status (approved/rejected).
 * Replaces: toggle_status_account.php
 */
export async function toggleAccountStatus(id: number, newStatus: 'approved' | 'rejected') {
  await updateById(COLLECTIONS.ACCOUNT, String(id), { status: newStatus });
  return { success: true };
}

// ==================== OCCUPANT CRUD ====================

/**
 * Get all occupants.
 * Replaces: SELECT * FROM occupant ORDER BY id_occupant DESC
 */
export async function getOccupants() {
  return await getAll(COLLECTIONS.OCCUPANT, [orderBy('id_occupant', 'desc')]);
}

/**
 * Get occupant by ID.
 */
export async function getOccupantById(id: number) {
  return await getById(COLLECTIONS.OCCUPANT, String(id));
}

/**
 * Add a new occupant.
 * Replaces: tambah_occupant.php INSERT INTO occupant
 */
export async function addOccupant(data: {
  name: string;
  nik_nip: string;
  no_hp: string;
  telegram_id?: string;
  pin: string;
  foto: string;
}) {
  const codeRegister = String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0');

  const result = await insertWithAutoId(COLLECTIONS.OCCUPANT, 'id_occupant', {
    name: data.name,
    nik_nip: data.nik_nip,
    no_hp: data.no_hp,
    telegram_id: data.telegram_id || null,
    pin: data.pin,
    foto: data.foto,
    finger_id: '-',
    code_register: codeRegister,
    progress: 'unused',
    status: 'approved',
    access: 'active',
    last_active: null,
    is_new: 1,
  });

  return { success: true, id: result.id };
}

/**
 * Update an occupant.
 * Replaces: edit_occupant.php UPDATE occupant SET ...
 */
export async function updateOccupant(id: number, data: Record<string, any>) {
  await updateById(COLLECTIONS.OCCUPANT, String(id), data);
  return { success: true };
}

/**
 * Delete an occupant.
 * Replaces: delete_occupant.php
 */
export async function deleteOccupant(id: number) {
  await deleteById(COLLECTIONS.OCCUPANT, String(id));
  return { success: true };
}

/**
 * Toggle occupant status/access.
 * Replaces: toggle_status_occupant.php, update_access_occupant.php
 */
export async function toggleOccupantStatus(
  id: number,
  field: 'status' | 'access',
  value: string
) {
  await updateById(COLLECTIONS.OCCUPANT, String(id), { [field]: value });
  return { success: true };
}

// ==================== ROOM CRUD ====================

/**
 * Get all rooms.
 * Replaces: SELECT * FROM room
 */
export async function getRooms() {
  return await getAll(COLLECTIONS.ROOM);
}

/**
 * Add a room restriction.
 * Replaces: save_room_restriction.php
 */
export async function addRoom(data: { code_room: string; name_room: string }) {
  const result = await insertWithAutoId(COLLECTIONS.ROOM, 'id_room', {
    code_room: data.code_room,
    name_room: data.name_room,
  });
  return { success: true, id: result.id };
}

/**
 * Update a room.
 * Replaces: update_room_restriction.php
 */
export async function updateRoom(id: number, data: { code_room: string; name_room: string }) {
  await updateById(COLLECTIONS.ROOM, String(id), data);
  return { success: true };
}

/**
 * Delete a room.
 * Replaces: delete_room_restriction.php
 */
export async function deleteRoom(id: number) {
  await deleteById(COLLECTIONS.ROOM, String(id));
  return { success: true };
}

// ==================== HISTORY CRUD ====================

/**
 * Get history entries with occupant join data (denormalized).
 * Replaces: history_ajax.php — complex JOIN query
 */
export async function getHistories(page: number = 1, pageSize: number = 12, search?: string) {
  const allHistories = await getAll(COLLECTIONS.HISTORY, [orderBy('id_history', 'desc')]);

  // Denormalize: fetch occupant data for each history
  const enriched = await Promise.all(
    allHistories.map(async (h) => {
      let occupantData: any = null;
      if (h.occupant_id) {
        occupantData = await getById(COLLECTIONS.OCCUPANT, String(h.occupant_id));
      }

      // Fetch schedule data
      let scheduleData: any = null;
      if (h.schedule_id) {
        scheduleData = await getById(COLLECTIONS.SCHEDULE, String(h.schedule_id));
      }

      return {
        ...h,
        name: occupantData?.name || '',
        occupant_name: occupantData?.name || 'Deleted Occupant',
        occupant_foto: occupantData?.foto || '',
        nik_nip: occupantData?.nik_nip || '-',
        no_hp: occupantData?.no_hp || '-',
        kegiatan: scheduleData?.kegiatan || '',
        schedule_date: scheduleData?.date || null,
        history_foto: h.foto || '',
      };
    })
  );

  // Search filter
  let filtered = enriched;
  if (search) {
    const q = search.toLowerCase();
    filtered = enriched.filter(
      (h) =>
        (h.name || '').toLowerCase().includes(q) ||
        (h.kegiatan || '').toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;
  const paged = filtered.slice(offset, offset + pageSize);

  return { data: paged, total, totalPages, page };
}

/**
 * Delete a history entry.
 */
export async function deleteHistory(id: number) {
  await deleteById(COLLECTIONS.HISTORY, String(id));
  return { success: true };
}

/**
 * Mark history as read.
 */
export async function markHistoryRead(id: number) {
  await updateById(COLLECTIONS.HISTORY, String(id), { is_read: 1 });
  return { success: true };
}

// ==================== SCHEDULE CRUD ====================

/**
 * Get schedules for a given month and year.
 * Replaces: SELECT * FROM schedule WHERE MONTH(date)=? AND YEAR(date)=?
 */
export async function getSchedulesByMonth(month: number, year: number) {
  // Firestore doesn't support MONTH() / YEAR() extraction.
  // We query by date range instead.
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const allSchedules = await getAll(COLLECTIONS.SCHEDULE, [orderBy('date', 'asc')]);

  // Filter in-memory by month/year (safe for modest data sizes)
  return allSchedules.filter((s) => {
    const d = s.date?.toDate ? s.date.toDate() : new Date(s.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });
}

/**
 * Add a schedule entry.
 * Replaces: INSERT INTO schedule (date, kegiatan) VALUES (NOW(), ?)
 */
export async function addSchedule(kegiatan: string) {
  const result = await insertWithAutoId(COLLECTIONS.SCHEDULE, 'id_schedule', {
    date: Timestamp.now(),
    kegiatan,
  });
  return { success: true, id: result.id };
}

// ==================== NOTIFICATIONS CRUD ====================

/**
 * Get all notifications.
 * Replaces: SELECT * FROM notifications WHERE is_deleted = 0 ORDER BY time DESC
 */
export async function getNotifications() {
  const all = await getAll(COLLECTIONS.NOTIFICATIONS, [orderBy('time', 'desc')]);
  return all.filter((n) => n.is_deleted !== 1);
}

/**
 * Mark notification as read.
 */
export async function markNotificationRead(id: number) {
  await updateById(COLLECTIONS.NOTIFICATIONS, String(id), { is_read: 1 });
  return { success: true };
}

/**
 * Soft-delete a notification.
 * Replaces: UPDATE notifications SET is_deleted = 1, deleted_at = NOW() WHERE id = ?
 */
export async function deleteNotification(id: number) {
  await updateById(COLLECTIONS.NOTIFICATIONS, String(id), {
    is_deleted: 1,
    deleted_at: Timestamp.now(),
  });
  return { success: true };
}

// ==================== MONITORING CRUD ====================

/**
 * Get all monitoring components.
 * Replaces: SELECT * FROM monitoring_components ORDER BY id
 */
export async function getMonitoringComponents() {
  return await getAll(COLLECTIONS.MONITORING_COMPONENTS);
}

/**
 * Update a monitoring component (from ESP32).
 */
export async function updateMonitoringComponent(
  componentKey: string,
  data: Record<string, any>
) {
  const component = await getByField(COLLECTIONS.MONITORING_COMPONENTS, 'component_key', componentKey);
  if (component) {
    await updateById(COLLECTIONS.MONITORING_COMPONENTS, component._docId, {
      ...data,
      last_seen: Timestamp.now(),
      updated_at: Timestamp.now(),
    });
  }
  return { success: true };
}
