'use client';
import { useState, useEffect } from 'react';
import styles from './BingoCard.module.css';
import { CiStar } from 'react-icons/ci';

const BingoCard = ({ cellContent, playerId, gameId }) => {
  const initialMarkedGrid = Array(5)
    .fill(null)
    .map(() => Array(5).fill(false));

  const [grid, setGrid] = useState([]);
  const [markedGrid, setMarkedGrid] = useState(initialMarkedGrid);
  const [bingoStatus, setBingoStatus] = useState('');

  useEffect(() => {
    if (Array.isArray(cellContent) && cellContent.length >= 24) {
      const cellContentArray = [...cellContent];

      const newGrid = Array(5)
        .fill(null)
        .map((_, rowIndex) =>
          Array(5)
            .fill(null)
            .map((_, colIndex) => {
              const cell = cellContentArray[rowIndex * 5 + colIndex];
              if (rowIndex === 2 && colIndex === 2) {
                return (
                  <div
                    key={`free-${rowIndex}-${colIndex}`}
                    className={`${styles.free} ${styles.cell}`}
                  >
                    <CiStar /> <div>Free</div>
                  </div>
                );
              }
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${styles.cell} ${
                    cell.isMarked ? styles.marked : ''
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell.text || ' '}
                </div>
              );
            })
        );
      setGrid(newGrid);
    } else {
      console.warn('Invalid cellContent:', cellContent);
      setGrid(Array(5).fill(Array(5).fill({ text: '', isMarked: false })));
    }
  }, [cellContent]);

  const handleCellClick = async (rowIndex, colIndex) => {
    if (rowIndex === 2 && colIndex === 2) return;

    const cellIndex = rowIndex * 5 + colIndex;

    try {
      const response = await fetch('/api/updateSquare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId,
          gameId,
          cellIndex,
        }),
      });

      const { bingoCard, isWinner } = await response.json();
      if (isWinner) {
        setBingoStatus('Bingo! 🎉');
      } else {
        setBingoStatus('');
      }

      // Update the grid and marked grid state
      setGrid(bingoCard);
      const updatedMarkedGrid = bingoCard.map((cell) => cell.isMarked);
      setMarkedGrid(updatedMarkedGrid);
    } catch (error) {
      console.error('Error toggling square or checking bingo:', error);
    }
  };

  return (
    <div>
      <div className={styles.bingoCard}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`${styles.cell} ${
                markedGrid[rowIndex][colIndex] ? styles.marked : ''
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      {bingoStatus && <div className={styles.status}>{bingoStatus}</div>}
    </div>
  );
};

export default BingoCard;
