import { getDatabase, ref, get, update } from 'firebase/database';
import firebaseApp from '@/lib/firebase';

export async function POST(request) {
  try {
    const { playerId, gameId, cellIndex } = await request.json();
    const db = getDatabase(firebaseApp);

    const cardRef = ref(db, `Players/${playerId}/bingoCard`);
    const snapshot = await get(cardRef);

    if (!snapshot.exists()) {
      return new Response(JSON.stringify({ error: 'Bingo card not found' }), {
        status: 404,
      });
    }

    const bingoCard = snapshot.val();

    bingoCard[cellIndex].isMarked = !bingoCard[cellIndex].isMarked;
    await update(cardRef, { [cellIndex]: bingoCard[cellIndex] });

    const gridSize = 5;
    const rows = Array(gridSize).fill(true);
    const columns = Array(gridSize).fill(true);
    let diagonal1 = true;
    let diagonal2 = true;

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const isMarked = bingoCard[i * gridSize + j].isMarked;

        if (!isMarked) rows[i] = false;
        if (!isMarked) columns[j] = false;
        if (i === j && !isMarked) diagonal1 = false;
        if (i + j === gridSize - 1 && !isMarked) diagonal2 = false;
      }
    }

    const hasBingo =
      rows.includes(true) || columns.includes(true) || diagonal1 || diagonal2;

    if (hasBingo) {
      const playerRef = ref(db, `Players/${playerId}`);
      await update(playerRef, { isWinner: true });
    }

    return new Response(JSON.stringify({ bingoCard, hasBingo }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error toggling square and checking bingo:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500 }
    );
  }
}
