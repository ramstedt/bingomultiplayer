import { db } from '@/lib/firebase';
import { ref, remove } from 'firebase/database';

export async function POST(request) {
  try {
    const { playerId } = await request.json();

    if (!playerId) {
      return new Response(JSON.stringify({ error: 'Missing playerId.' }), {
        status: 400,
      });
    }

    await remove(ref(db, `Players/${playerId}`));

    return new Response(JSON.stringify({ message: 'Left game.' }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error leaving game:', error);
    return new Response(JSON.stringify({ error: 'Failed to leave game.' }), {
      status: 500,
    });
  }
}
