import { db } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';

const generatePlayerID = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join('');
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export async function POST(req) {
  try {
    const { name, gameId } = await req.json();

    if (!name || !gameId) {
      return new Response(
        JSON.stringify({ error: 'Name and game ID are required.' }),
        {
          status: 400,
        }
      );
    }

    const gameRef = ref(db, `Games/${gameId}`);
    const gameSnapshot = await get(gameRef);

    if (!gameSnapshot.exists()) {
      return new Response(JSON.stringify({ error: 'Game not found.' }), {
        status: 404,
      });
    }

    let playerId;
    let playerExists = true;

    while (playerExists) {
      playerId = generatePlayerID();
      const playerRef = ref(db, `Players/${playerId}`);
      const playerSnapshot = await get(playerRef);
      playerExists = playerSnapshot.exists();
    }

    const gameData = gameSnapshot.val();
    const randomizedBingoCard = shuffleArray([...gameData.bingoSquares]);

    const freeSquare = {
      text: 'Free',
      isMarked: false,
    };

    randomizedBingoCard.splice(12, 0, freeSquare);

    const playerData = {
      username: name,
      gameId: gameId,
      bingoCard: randomizedBingoCard,
      isWinner: false,
    };

    await set(ref(db, `Players/${playerId}`), playerData);

    return new Response(JSON.stringify({ gameId, playerId }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error joining game:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while joining the game.',
        details: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}
