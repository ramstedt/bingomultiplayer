import { db } from '@/lib/firebase';
import { ref, get, remove } from 'firebase/database';

const isGameOlderThan30Days = (creationDate) => {
  const now = new Date();
  const gameDate = new Date(creationDate);
  const diffTime = Math.abs(now - gameDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 30;
};

export async function POST(req) {
  try {
    const gamesRef = ref(db, 'Games');
    const snapshot = await get(gamesRef);

    if (!snapshot.exists()) {
      return new Response(JSON.stringify({ message: 'No games found.' }), {
        status: 404,
      });
    }

    const games = snapshot.val();
    const gamesToDelete = [];
    const playersToDelete = [];

    Object.keys(games).forEach((gameId) => {
      const game = games[gameId];
      if (isGameOlderThan30Days(game.creationDate)) {
        gamesToDelete.push(gameId);
        playersToDelete.push(game.creatorPlayerId);
      }
    });

    if (gamesToDelete.length > 0) {
      const gameDeletePromises = gamesToDelete.map((gameId) =>
        remove(ref(db, `Games/${gameId}`))
      );

      const uniquePlayersToDelete = [...new Set(playersToDelete)];
      const playerDeletePromises = uniquePlayersToDelete.map((playerId) =>
        remove(ref(db, `Players/${playerId}`))
      );

      await Promise.all([...gameDeletePromises, ...playerDeletePromises]);

      return new Response(
        JSON.stringify({
          message: `${gamesToDelete.length} game(s) deleted. ${uniquePlayersToDelete.length} player(s) associated with those games were also deleted.`,
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'No games older than 30 days.' }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error cleaning old games:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to clean old games.' }),
      { status: 500 }
    );
  }
}
