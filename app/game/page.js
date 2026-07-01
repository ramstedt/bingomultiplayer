'use client';
import { useState, useEffect, Suspense } from 'react';
import { colorFromUsername } from '@/lib/playerColors';

const minSquaresAwayFromBingo = (bingoCard) => {
  if (!bingoCard || bingoCard.length < 25) return null;
  const g = 5;
  const marked = (r, c) => bingoCard[r * g + c].isMarked;
  let min = Infinity;
  for (let i = 0; i < g; i++) {
    let rowMissing = 0, colMissing = 0;
    for (let j = 0; j < g; j++) {
      if (!marked(i, j)) rowMissing++;
      if (!marked(j, i)) colMissing++;
    }
    min = Math.min(min, rowMissing, colMissing);
  }
  let d1 = 0, d2 = 0;
  for (let i = 0; i < g; i++) {
    if (!marked(i, i)) d1++;
    if (!marked(i, g - 1 - i)) d2++;
  }
  min = Math.min(min, d1, d2);
  return min;
};
import { useSearchParams } from 'next/navigation';
import styles from './game.module.css';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';
import BingoCard from '@/app/components/BingoCard/BingoCard';
import Confetti from 'react-confetti';
import { IoChevronForward, IoChevronDown } from 'react-icons/io5';
import { IoCopy } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

export default function Game() {
  const [playerData, setPlayerData] = useState(null);
  const [visibleCardIndex, setVisibleCardIndex] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

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
        showLeaveModal={showLeaveModal}
        setShowLeaveModal={setShowLeaveModal}
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
  showLeaveModal,
  setShowLeaveModal,
}) {
  const searchParams = useSearchParams();
  const gameId = searchParams.get('gameId');
  const playerId = searchParams.get('playerId');
  const router = useRouter();

  const handleLeaveGame = async () => {
    await fetch('/api/leaveGame', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
    });
    localStorage.removeItem('bingo_gameId');
    localStorage.removeItem('bingo_playerId');
    router.push('/');
  };

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
                color: playerData.color,
              };
            } else {
              players.push({
                username: playerData.username,
                isWinner: playerData.isWinner,
                bingoCard: playerData.bingoCard || [],
                color: playerData.color,
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
        } else {
          setPlayerData((prev) =>
            prev ? { ...prev, otherPlayers: players } : null
          );
        }
      } else {
        setPlayerData(null);
      }
    });
    return unsubscribe;
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
            <span className={styles.gameId}>{gameId}</span>{' '}
            <IoCopy
              onClick={() =>
                navigator.clipboard.writeText(
                  `Join my bingo game at https://multiplayerbingo.vercel.app Use code: ${gameId}`,
                )
              }
              style={{ cursor: 'pointer' }}
              title='Copy to clipboard'
            />
            <br />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            ></div>
          </p>
          <br />
          <p className={styles.gameDetails}>
            <span className={styles.bold}>
              Playing as:
              <br />
            </span>
            <span
              style={{
                color:
                  playerData.currentPlayer.color ||
                  colorFromUsername(playerData.currentPlayer.username),
                fontWeight: 700,
              }}
            >
              {playerData.currentPlayer.username}
            </span>
          </p>

          <BingoCard
            cellContent={playerData.currentPlayer.bingoCard}
            gameId={gameId}
            playerId={playerId}
            clickable={true}
            markedColor={
              playerData.currentPlayer.color ||
              colorFromUsername(playerData.currentPlayer.username)
            }
          />
          {showConfetti && typeof window !== 'undefined' && (
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          )}
          <button
            onClick={() => setShowLeaveModal(true)}
            className={styles.leaveButton}
          >
            Leave Game
          </button>
          {showLeaveModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <p>
                  Are you sure you want to leave the game?
                  <br />
                  Your bingo card will be lost.
                </p>
                <div className={styles.modalButtons}>
                  <button
                    onClick={handleLeaveGame}
                    className={styles.modalConfirm}
                  >
                    Leave
                  </button>
                  <button
                    onClick={() => setShowLeaveModal(false)}
                    className={styles.modalCancel}
                  >
                    Stay
                  </button>
                </div>
              </div>
            </div>
          )}
          <h3 className={styles.subheader}>
            Other Players
            <span className={styles.playerCount}>
              {playerData.otherPlayers.length}
            </span>
          </h3>
          {playerData.otherPlayers.length === 0 ? (
            <p className={styles.noPlayers}>No one else has joined yet</p>
          ) : (
            <ul className={styles.list}>
              {playerData.otherPlayers.map((player, index) => (
                <li key={index} className={styles.playerCard}>
                  <button
                    className={styles.playerRow}
                    onClick={() => toggleBingoCard(index)}
                  >
                    <span
                      className={styles.avatar}
                      style={{
                        background:
                          player.color || colorFromUsername(player.username),
                      }}
                    >
                      {player.username[0].toUpperCase()}
                    </span>
                    <span className={styles.playerName}>{player.username}</span>
                    {player.isWinner ? (
                      <span className={styles.winnerBadge}>Bingo!</span>
                    ) : (() => {
                      const away = minSquaresAwayFromBingo(player.bingoCard);
                      if (away === 1) return <span className={styles.closeBadge}>1 away</span>;
                      if (away === 2) return <span className={styles.closeBadge}>2 away</span>;
                      return null;
                    })()}
                    <span className={styles.chevron}>
                      {visibleCardIndex === index ? (
                        <IoChevronDown />
                      ) : (
                        <IoChevronForward />
                      )}
                    </span>
                  </button>
                  {visibleCardIndex === index && (
                    <div className={styles.expandedCard}>
                      <BingoCard
                        cellContent={player.bingoCard}
                        clickable={false}
                        markedColor={
                          player.color || colorFromUsername(player.username)
                        }
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
