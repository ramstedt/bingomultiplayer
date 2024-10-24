'use client';
import BingoCard from '@/app/components/BingoCard/BingoCard';
import { useState, useEffect } from 'react';

export default function Game() {
  const [playerData, setPlayerData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('playerId1');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/players?playerId=${searchQuery}`);
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
  }, [searchQuery]);

  return (
    <div>
      {playerData ? (
        <div>
          <p>Name: {playerData.name}</p>
          <BingoCard cellContent={playerData.bingocard} />
        </div>
      ) : (
        <p>No player found.</p>
      )}
    </div>
  );
}
