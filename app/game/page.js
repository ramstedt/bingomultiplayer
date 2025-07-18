'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './game.module.css';
import { ref, onValue, off } from 'firebase/database';
import { db } from '@/lib/firebase';
import BingoCard from '@/app/components/BingoCard/BingoCard';
import Confetti from 'react-confetti';
import { IoChevronForward, IoChevronDown } from 'react-icons/io5';
import Kofi from '../components/Kofi/Kofi';
import { IoCopy } from 'react-icons/io5';

export default function Game() {
  const [playerData, setPlayerData] = useState(null);
  const [visibleCardIndex, setVisibleCardIndex] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const toggleBingoCard = (index) => {
    setVisibleCardIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameContent
        playerData={playerData}
        setPlayerData={setPlayerData}
        toggleBingoCard={toggleBingoCard}
        visibleCardIndex={visibleCardIndex}
        showConfetti={showConfetti}
        setShowConfetti={setShowConfetti}
      />
    </Suspense>
  );
}

function GameContent({
  playerData,
  setPlayerData,
  toggleBingoCard,
  visibleCardIndex,
  showConfetti,
  setShowConfetti,
}) {
  const searchParams = useSearchParams();
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

  useEffect(() => {
    if (playerData?.currentPlayer.isWinner) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [playerData?.currentPlayer.isWinner]);

  return (
    <div>
      {playerData ? (
        <div>
          <p className={styles.center}>
            Others can join this Bingo by entering the code: <br />
            <span className={styles.gameId}>{gameId}</span>
            <br />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>
                Join my bingo game at https://multiplayerbingo.vercel.app ! Use
                code: {gameId}
              </span>
              <IoCopy
                onClick={() =>
                  navigator.clipboard.writeText(
                    `Join my bingo game at https://multiplayerbingo.vercel.app Use code: ${gameId}`
                  )
                }
                style={{ cursor: 'pointer' }}
                title='Copy to clipboard'
              />
            </div>
          </p>
          <br />
          <p className={styles.gameDetails}>
            <span className={styles.bold}>
              Playing as:
              <br />
            </span>
            <span className={styles.blue}>
              {playerData.currentPlayer.username}
            </span>
          </p>

          <BingoCard
            cellContent={playerData.currentPlayer.bingoCard}
            gameId={gameId}
            playerId={playerId}
            clickable={true}
          />
          {showConfetti && (
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          )}
          <h3 className={styles.subheader}>Other Players:</h3>
          <ul className={styles.list}>
            {playerData.otherPlayers.map((player, index) => (
              <span key={index}>
                <li
                  style={{ color: player.isWinner ? 'green' : '' }}
                  className={styles.player}
                >
                  {visibleCardIndex === index ? (
                    <IoChevronDown />
                  ) : (
                    <IoChevronForward />
                  )}
                  <span
                    onClick={() => toggleBingoCard(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    {player.username} {player.isWinner && '(Bingo!)'}
                  </span>
                </li>
                {visibleCardIndex === index && (
                  <BingoCard cellContent={player.bingoCard} clickable={true} />
                )}
              </span>
            ))}
          </ul>
        </div>
      ) : (
        <></>
      )}
      <Kofi />
    </div>
  );
}
