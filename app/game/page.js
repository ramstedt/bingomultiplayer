'use client';
import BingoCard from '@/app/components/BingoCard/BingoCard';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Game() {
  const [playerData, setPlayerData] = useState(null);
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
        } else {
          setPlayerData(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPlayerData();
  }, [gameId, playerId]);

  return (
    <div>
      {playerData ? (
        <div>
          <p>Username: {playerData.currentPlayer.username}</p>
          <p>Others can join this Bingo by entering the code: {gameId}</p>

          <BingoCard
            cellContent={playerData.currentPlayer.bingoCard}
            gameId={gameId}
            playerId={playerId}
          />

          <h3>Other Players in this game:</h3>
          <ul>
            {playerData.otherPlayers.map((player, index) => (
              <li
                key={index}
                style={{ color: player.isWinner ? 'green' : 'black' }}
              >
                {player.username} {player.isWinner && '(Winner!)'}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>This game does not exist.</p>
      )}
    </div>
  );
}
