'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ref, onValue, off } from 'firebase/database';
import { db } from '@/lib/firebase';
import BingoCard from '@/app/components/BingoCard/BingoCard';

export default function Game() {
  const [playerData, setPlayerData] = useState(null);
  const searchParams = useSearchParams();
  const [visibleCardIndex, setVisibleCardIndex] = useState(null);
  const toggleBingoCard = (index) => {
    setVisibleCardIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const gameId = searchParams.get('gameId');
  const playerId = searchParams.get('playerId');

  useEffect(() => {
    if (!gameId || !playerId) return;

    const playersRef = ref(db, 'Players');

    const unsubscribe = onValue(playersRef, (snapshot) => {
      if (snapshot.exists()) {
        const players = [];
        let currentPlayer = null;

        snapshot.forEach((player) => {
          const playerData = player.val();

          if (playerData.gameId === gameId) {
            if (player.key === playerId) {
              currentPlayer = {
                id: player.key,
                username: playerData.username,
                isWinner: playerData.isWinner,
                bingoCard: playerData.bingoCard || [],
              };
            } else {
              players.push({
                username: playerData.username,
                isWinner: playerData.isWinner,
                bingoCard: playerData.bingoCard || [],
              });
            }
          }
        });

        if (currentPlayer) {
          console.log('Current Player:', currentPlayer);

          setPlayerData({
            currentPlayer: {
              ...currentPlayer,
              bingoCard: currentPlayer.bingoCard.map((square) => ({
                text: square.text,
                isMarked: square.isMarked,
              })),
            },
            otherPlayers: players,
          });
        }
      } else {
        setPlayerData(null);
      }
    });

    return () => off(playersRef, 'value', unsubscribe);
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
            clickable={true}
          />

          <h3>Other Players in this game:</h3>
          <ul>
            {playerData.otherPlayers.map((player, index) => (
              <li
                key={index}
                style={{ color: player.isWinner ? 'green' : 'black' }}
              >
                <span
                  onClick={() => toggleBingoCard(index)}
                  style={{ cursor: 'pointer' }}
                >
                  {player.username} {player.isWinner && '(Bingo!)'}
                </span>

                {visibleCardIndex === index && (
                  <BingoCard cellContent={player.bingoCard} clickable={true} />
                )}
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
