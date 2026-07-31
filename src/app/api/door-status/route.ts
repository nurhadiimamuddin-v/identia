import { NextResponse } from 'next/server';
import { getByField, updateById, insertWithAutoId } from '@/lib/firestore-helpers';
import { COLLECTIONS } from '@/lib/collections';
import { Timestamp } from 'firebase/firestore';

/**
 * GET & POST /api/door-status
 * Replaces: api_door_status.php
 */

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const action = formData.get('action');

    // We store the door status in the monitoring_components table under 'solenoid_lock'
    const lockComponent = await getByField(COLLECTIONS.MONITORING_COMPONENTS, 'component_key', 'solenoid_lock');

    if (action === 'lock') {
      if (lockComponent) {
        await updateById(COLLECTIONS.MONITORING_COMPONENTS, lockComponent._docId, {
          status: 'offline', // Using offline for locked to match UI colors in monitoring
          value: 'locked',
          last_seen: Timestamp.now(),
        });
      }

      await insertWithAutoId(COLLECTIONS.NOTIFICATIONS, 'id', {
        icon: 'mdi-door-closed-lock',
        title: 'Door Locked',
        message: 'The FTM room door has been successfully locked.',
        detail: 'System detected that the door is now closed and locked.',
        time: Timestamp.now(),
        is_read: 0,
        is_danger: 0,
        is_deleted: 0,
      });

      return NextResponse.json({ status: 'success', door_state: 'locked' });
    }

    if (action === 'unlock') {
      if (lockComponent) {
        await updateById(COLLECTIONS.MONITORING_COMPONENTS, lockComponent._docId, {
          status: 'online', // Using online for unlocked
          value: 'unlocked',
          last_seen: Timestamp.now(),
        });
      }

      await insertWithAutoId(COLLECTIONS.NOTIFICATIONS, 'id', {
        icon: 'mdi-door-open',
        title: 'Door Unlocked',
        message: 'The FTM room door has been opened.',
        detail: 'System detected that the door is currently open.',
        time: Timestamp.now(),
        is_read: 0,
        is_danger: 0,
        is_deleted: 0,
      });

      // Push notification broadcast omitted here (would integrate with Firebase Cloud Messaging)

      return NextResponse.json({ status: 'success', door_state: 'unlocked' });
    }

    return NextResponse.json({ status: 'error', message: 'Aksi tidak dikenal' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const lockComponent = await getByField(COLLECTIONS.MONITORING_COMPONENTS, 'component_key', 'solenoid_lock');
    let state = 'locked';
    let lastTime = new Date();

    if (lockComponent && lockComponent.value) {
      state = lockComponent.value;
      if (lockComponent.last_seen) {
        lastTime = lockComponent.last_seen.toDate();
      }
    }

    const dayMapping: Record<number, string> = {
      0: 'Minggu', 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu'
    };
    const monthMapping: Record<number, string> = {
      0: 'Januari', 1: 'Februari', 2: 'Maret', 3: 'April', 4: 'Mei', 5: 'Juni',
      6: 'Juli', 7: 'Agustus', 8: 'September', 9: 'Oktober', 10: 'November', 11: 'Desember'
    };

    const hari = dayMapping[lastTime.getDay()];
    const tanggal = String(lastTime.getDate()).padStart(2, '0');
    const bln = monthMapping[lastTime.getMonth()];
    const thn = lastTime.getFullYear();

    const date_formatted = `${hari}, ${tanggal} ${bln} ${thn}`;
    const time_formatted = `${String(lastTime.getHours()).padStart(2, '0')}:${String(lastTime.getMinutes()).padStart(2, '0')}:${String(lastTime.getSeconds()).padStart(2, '0')}`;

    return NextResponse.json({
      status: 'success',
      door_state: state,
      last_updated_time: time_formatted,
      last_updated_date: date_formatted,
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
