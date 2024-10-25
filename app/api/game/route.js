import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';

const getPlayerAndGamePlayers = async (gameId, playerId) => {
  try {
    const playerRef = ref(db, `Players/${playerId}`);
    const playerSnapshot = await get(playerRef);

    if (!playerSnapshot.exists()) {
      return { error: 'Player not found' };
    }

    const currentPlayer = playerSnapshot.val();

    if (currentPlayer.gameId !== gameId) {
      return { error: 'This player and game combo does not exist' };
    }

    const playersRef = ref(db, 'Players');
    const playersSnapshot = await get(playersRef);

    const allPlayers = [];
    if (playersSnapshot.exists()) {
      playersSnapshot.forEach((player) => {
        const playerData = player.val();
        if (playerData.gameId === gameId && player.key !== playerId) {
          allPlayers.push({
            username: playerData.username,
            isWinner: playerData.isWinner,
          });
        }
      });
    }

    return {
      currentPlayer: {
        ...currentPlayer,
        bingoCard: currentPlayer.bingoCard.map((square, index) => ({
          text: square.text,
          isMarked: square.isMarked,
        })),
      },
      otherPlayers: allPlayers,
    };
  } catch (error) {
    console.error('Error fetching player or game players:', error);
    return { error: 'An error occurred while fetching data.' };
  }
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get('gameId');
  const playerId = searchParams.get('playerId');

  if (!gameId || !playerId) {
    return new Response(
      JSON.stringify({ error: 'Game ID and Player ID are required.' }),
      { status: 400 }
    );
  }

  try {
    const data = await getPlayerAndGamePlayers(gameId, playerId);

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), {
        status: 404,
      });
    } else {
      return new Response(JSON.stringify(data), { status: 200 });
    }
  } catch (error) {
    console.error('Error in API:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while fetching the game or player data.',
      }),
      { status: 500 }
    );
  }
}
