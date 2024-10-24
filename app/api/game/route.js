import { db } from '@/firebase.config';
import { ref, get } from 'firebase/database';

const getGameData = async (gameId) => {
  try {
    const gameRef = ref(db, `Games/${gameId}`);
    const gameSnapshot = await get(gameRef);

    if (!gameSnapshot.exists()) {
      console.log('No game found with that ID.');
      return { error: 'Game not found' };
    }

    const playersRef = ref(db, `Players`);
    const playersSnapshot = await get(playersRef);

    const players = [];
    playersSnapshot.forEach((childSnapshot) => {
      const playerData = childSnapshot.val();
      const playerId = childSnapshot.key;
      if (playerData.gameId === gameId) {
        players.push({ playerId, ...playerData });
      }
    });

    return { ...gameSnapshot.val(), players };
  } catch (error) {
    console.error('Error getting game or player data:', error);
    throw error;
  }
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get('gameId');
  const playerId = searchParams.get('playerId');

  if (!gameId || !playerId) {
    return new Response(
      JSON.stringify({ error: 'Game ID and Player ID are required.' }),
      {
        status: 400,
      }
    );
  }

  try {
    const gameData = await getGameData(gameId);

    if (gameData.error) {
      return new Response(JSON.stringify({ error: gameData.error }), {
        status: 404,
      });
    } else {
      return new Response(JSON.stringify(gameData), { status: 200 });
    }
  } catch (error) {
    console.error('Error getting game or player data:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while fetching game or player data.',
      }),
      { status: 500 }
    );
  }
}
