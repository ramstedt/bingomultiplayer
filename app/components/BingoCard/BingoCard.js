'use client';
import { useState, useEffect } from 'react';
import styles from './BingoCard.module.css';

const BingoCard = ({ cellContent }) => {

  const initialGrid = Array(5)
    .fill(null)
    .map(() => Array(5).fill(false));
  const [grid, setGrid] = useState(initialGrid);
  const [bingoStatus, setBingoStatus] = useState('');

  useEffect(() => {
    const cellContentArray = Object.values(cellContent);

    cellContentArray.splice(12, 0, "");

    const newGrid = Array(5)
      .fill(null)
      .map((_, rowIndex) =>
        Array(5)
          .fill(false)
          .map((_, colIndex) =>
            rowIndex === 2 && colIndex === 2
              ? 'Free'
              : cellContentArray[rowIndex * 5 + colIndex]
          )
      );

    setGrid(newGrid);
  }, [cellContent]);

  const checkBingo = (grid) => {
    for (let row of grid) {
      if (row.every((cell) => cell === true || cell === 'Free')) {
        return true;
      }
    }

    for (let col = 0; col < 5; col++) {
      if (grid.every((row) => row[col] === true || row[col] === 'Free')) {
        return true;
      }
    }

    if (
      grid.every((row, index) => row[index] === true || row[index] === 'Free')
    ) {
      return true;
    }
    if (
      grid.every(
        (row, index) => row[4 - index] === true || row[4 - index] === 'Free'
      )
    ) {
      return true;
    }

    return false;
  };

  const handleClick = (rowIndex, colIndex) => {
    const updatedGrid = grid.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? true : cell
      )
    );

    setGrid(updatedGrid);
  };

  useEffect(() => {
    if (checkBingo(grid)) {
      const announce = window.confirm(
        'You got Bingo! Do you want to announce it?'
      );
      if (announce) {
        setBingoStatus('Bingo! 🎉');
      }
    }
  }, [grid]);

  return (
    <div>
      <div className={styles.bingoCard}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`${styles.cell} ${cell === true ? styles.marked : ''}`}
              onClick={() => handleClick(rowIndex, colIndex)}
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
