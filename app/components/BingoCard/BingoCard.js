'use client';
import { useState, useEffect } from 'react';
import styles from './BingoCard.module.css';
import { CiStar } from 'react-icons/ci';

const BingoCard = ({ cellContent }) => {
  const initialMarkedGrid = Array(5)
    .fill(null)
    .map(() => Array(5).fill(false));

  const [grid, setGrid] = useState([]);
  const [markedGrid, setMarkedGrid] = useState(initialMarkedGrid);
  const [bingoStatus, setBingoStatus] = useState('');

  useEffect(() => {
    const cellContentArray = Object.values(cellContent);

    cellContentArray.splice(12, 0, '');

    const newGrid = Array(5)
      .fill(null)
      .map((_, rowIndex) =>
        Array(5)
          .fill(null)
          .map((_, colIndex) =>
            rowIndex === 2 && colIndex === 2 ? (
              <div key={`free-${rowIndex}-${colIndex}`} className={styles.free}>
                <CiStar /> <div>Free</div>
              </div>
            ) : (
              <div key={`${rowIndex}-${colIndex}`}>
                {cellContentArray[rowIndex * 5 + colIndex]}
              </div>
            )
          )
      );

    setGrid(newGrid);
  }, [cellContent]);

  const checkBingo = (markedGrid) => {
    const isFreeCell = (cell) => {
      return (
        cell === true || (typeof cell === 'string' && cell.includes('free'))
      );
    };

    // Check rows
    for (let row of markedGrid) {
      if (row.every((cell) => cell === true)) {
        return true;
      }
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
      if (markedGrid.every((row) => row[col] === true)) {
        return true;
      }
    }

    // Check diagonal top-left to bottom-right
    if (markedGrid.every((row, index) => row[index] === true)) {
      return true;
    }

    // Check diagonal top-right to bottom-left
    if (markedGrid.every((row, index) => row[4 - index] === true)) {
      return true;
    }

    return false;
  };

  const handleClick = (rowIndex, colIndex) => {
    const updatedMarkedGrid = markedGrid.map((row, rIdx) =>
      row.map((marked, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? !marked : marked
      )
    );

    setMarkedGrid(updatedMarkedGrid);
  };

  useEffect(() => {
    if (checkBingo(markedGrid)) {
      const announce = window.confirm(
        'You got Bingo! Do you want to announce it?'
      );
      if (announce) {
        setBingoStatus('Bingo! 🎉');
      }
    }
  }, [markedGrid]);

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
