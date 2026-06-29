'use client';
import { useState, useEffect } from 'react';
import styles from './BingoCard.module.css';
import { CiStar } from 'react-icons/ci';

const BingoCard = ({ cellContent, playerId, gameId, clickable }) => {
  const [grid, setGrid] = useState([]);
  const [markedGrid, setMarkedGrid] = useState(() =>
    Array(5).fill(null).map(() => Array(5).fill(false))
  );
  const [bingoStatus, setBingoStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (Array.isArray(cellContent) && cellContent.length >= 24) {
      const cellContentArray = [...cellContent];

      const newGrid = Array(5)
        .fill(null)
        .map((_, rowIndex) =>
          Array(5)
            .fill(null)
            .map((_, colIndex) => {
              const cellIndex = rowIndex * 5 + colIndex;
              return (
                cellContentArray[cellIndex] || { text: '', isMarked: false }
              );
            })
        );

      setGrid(newGrid);

      const initializedMarkedGrid = Array(5)
        .fill(null)
        .map((_, rowIndex) =>
          cellContentArray
            .slice(rowIndex * 5, rowIndex * 5 + 5)
            .map((cell) => cell.isMarked)
        );
      setMarkedGrid(initializedMarkedGrid);
    } else {
      console.warn('Invalid cellContent:', cellContent);
      setGrid(Array(5).fill(Array(5).fill({ text: '', isMarked: false })));
    }
  }, [cellContent]);

  const handleCellClick = async (rowIndex, colIndex) => {
    if (!clickable || isUpdating) {
      return;
    }
    const cellIndex = rowIndex * 5 + colIndex;

    setIsUpdating(true);
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

      const { bingoCard, hasBingo } = await response.json();

      if (hasBingo) {
        setBingoStatus('Bingo! 🎉');
      } else {
        setBingoStatus('');
      }

      const updatedGrid = Array(5)
        .fill(null)
        .map((_, rowIndex) => bingoCard.slice(rowIndex * 5, rowIndex * 5 + 5));

      setGrid(updatedGrid);

      const updatedMarkedGrid = updatedGrid.map((row) =>
        row.map((cell) => cell.isMarked)
      );
      setMarkedGrid(updatedMarkedGrid);
    } catch (error) {
      console.error('Error toggling square or checking bingo:', error);
    } finally {
      setIsUpdating(false);
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
              onPointerUp={() => handleCellClick(rowIndex, colIndex)}
            >
              {rowIndex === 2 && colIndex === 2 ? (
                <div className={`${styles.free}`}>
                  <CiStar /> <div>Free</div>
                </div>
              ) : (
                cell.text
              )}
            </div>
          ))
        )}
      </div>
      {bingoStatus && <div className={styles.status}>{bingoStatus}</div>}
    </div>
  );
};

export default BingoCard;
