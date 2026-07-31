import { NextResponse } from 'next/server';
import { getAll, where } from '@/lib/firestore-helpers';
import { COLLECTIONS } from '@/lib/collections';

export async function GET() {
  try {
    // Replaces: SELECT id_occupant, name, foto FROM occupant WHERE status = 'approved' AND foto IS NOT NULL
    const occupants = await getAll(COLLECTIONS.OCCUPANT, [
      where('status', '==', 'approved'),
    ]);

    const faces = occupants
      .filter((row) => row.foto && row.foto.trim() !== '')
      .map((row) => ({
        id: row.id_occupant,
        name: row.name,
        foto: row.foto,
      }));

    return NextResponse.json({ status: 'success', data: faces });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: `Query error: ${error.message}` }, { status: 500 });
  }
}
