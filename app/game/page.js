'use client';
import BingoCard from '@/app/components/BingoCard/BingoCard';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Game() {
  const [playerData, setPlayerData] = useState(null);
  const [players, setPlayers] = useState([]);
  const searchParams = useSearchParams();

  const gameId = searchParams.get('gameId');
  const playerId = searchParams.get('playerId');

  useEffect(() => {
    if (!playerId || !gameId) return;

    const fetchPlayerData = async () => {
      try {
        const response = await fetch(
          `/api/game?gameId=${gameId}&playerId=${playerId}`
        );

        if (response.ok) {
          const data = await response.json();
          setPlayerData(data);

          const allPlayers = data.players || [];
          setPlayers(allPlayers);
        } else {
          setPlayerData(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPlayerData();

    const intervalId = setInterval(() => {
      fetchPlayerData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [gameId, playerId]);

  return (
    <div>
      {playerData ? (
        <div>
          <p>Username: {playerData.username}</p>
          <p>Others can join this Bingo by entering the code: {gameId}</p>
          <BingoCard cellContent={playerData.bingoSquares} />

          <h3>Players in this game:</h3>
          <ul>
            {players
              .filter((player) => player.playerId !== playerId)
              .map((player) => (
                <li
                  key={player.playerId}
                  style={{ color: player.isWinner ? 'green' : 'black' }}
                >
                  {player.username} {player.isWinner && '(Winner!)'}
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <p>No player found.</p>
      )}
    </div>
  );
}
