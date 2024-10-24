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
    const fetchData = async () => {
      if (!playerId || !gameId) return;

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

    fetchData();
  }, [gameId, playerId]);

  return (
    <div>
      {playerData ? (
        <div>
          <p>Username: {playerData.username}</p>
          <p>Others can join this Bingo by entering the code: {gameId}</p>
          <BingoCard cellContent={playerData.bingoCard} />
        </div>
      ) : (
        <p>No player found.</p>
      )}
    </div>
  );
}
