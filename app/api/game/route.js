import { db } from '@/firebase.config'; // Adjust the path as necessary
import { ref, get } from 'firebase/database';

const getPlayerData = async (gameId, playerId) => {
  try {
    const gameRef = ref(db, `Games/${gameId}`);
    const gameSnapshot = await get(gameRef);

    if (!gameSnapshot.exists()) {
      console.log('No game found with that ID.');
      return { error: 'Game not found' };
    }

    const playerRef = ref(db, `Players/${playerId}`);
    const playerSnapshot = await get(playerRef);

    if (playerSnapshot.exists()) {
      const playerData = playerSnapshot.val();

      if (playerData.gameId === gameId) {
        return playerData;
      } else {
        return { error: 'Player does not belong to this game' };
      }
    } else {
      console.log('No player found with that ID.');
      return { error: 'Player not found' };
    }
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
    const playerData = await getPlayerData(gameId, playerId);

    if (playerData.error) {
      return new Response(JSON.stringify({ error: playerData.error }), {
        status: 404,
      });
    } else {
      return new Response(JSON.stringify(playerData), { status: 200 });
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
