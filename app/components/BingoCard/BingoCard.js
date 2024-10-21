'use client';
import { useState, useEffect } from 'react';
import styles from './BingoCard.module.css';

const BingoCard = () => {
  const cellContent = [
    'The quick brown',
    'A journey',
    'To be or',
    'All that glitters',
    'I think, therefore I am.',
    'The only thing we have ',
    'In the end,.',
    'Life is what',
    'It does not matter',
    'You miss 100% of the',
    'That which does not',
    'The greatest glory',
    'The future belongs.',
    'Happiness is not',
    'The purpose of our',
    'Get busy living',
    'You only live once.',
    'The best way to',
    'Do not wait to.',
    'What we think,',
    'Get busy living',
    'You only live once.',
    'The best way to',
    'Do not wait to.',
    'What we think,',
  ];

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const initialGrid = Array(5)
    .fill(null)
    .map(() => Array(5).fill(false));
  const [grid, setGrid] = useState(initialGrid);
  const [cellContentShuffled, setCellContentShuffled] = useState([]);
  const [bingoStatus, setBingoStatus] = useState('');

  useEffect(() => {
    const shuffledcellContent = shuffleArray([...cellContent]);
    setCellContentShuffled(shuffledcellContent);

    // Create the Bingo grid
    const newGrid = Array(5)
      .fill(null)
      .map((_, rowIndex) =>
        Array(5)
          .fill(false)
          .map((_, colIndex) =>
            rowIndex === 2 && colIndex === 2
              ? 'Free'
              : shuffledcellContent[rowIndex * 5 + colIndex]
          )
      );

    setGrid(newGrid);
  }, []);

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
