'use client';
import { useState, useEffect } from 'react';
import BingoCard from '../components/BingoCard/BingoCard';
import styles from './create.module.css';

export default function Home() {
  const [name, setName] = useState('');
  const [bingoSquares, setBingoSquares] = useState(Array(24).fill(''));

  useEffect(() => {
    const initialSquares = Array.from({ length: 24 }, (_, i) => ``);
    setBingoSquares(initialSquares);
  }, []);

  const handleSquareChange = (index, value) => {
    const updatedSquares = [...bingoSquares];
    updatedSquares[index] = value;
    setBingoSquares(updatedSquares);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      name: name,
      bingoSquares: bingoSquares,
    };
    console.log('Form submitted:', JSON.stringify(formData, null, 2));
  };

  return (
    <>
      <h1>Create game</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='name'>Name:</label>
        <br />
        <input
          type='text'
          id='name'
          name='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <h2>Bingo Squares:</h2>
        <div className='bingo-squares'>
          {bingoSquares.map((square, index) => (
            <input
              key={index}
              type='text'
              name={`square${index + 1}`}
              placeholder={`Square ${index + 1}`}
              value={square}
              onChange={(e) => handleSquareChange(index, e.target.value)}
              required
            />
          ))}
        </div>
        <button type='submit'>Create game</button>
      </form>
      <h2>Preview</h2>
      <p className={styles.text}>
        (Note: when players join the game, their bingo card will be randomised)
      </p>
      <BingoCard cellContent={bingoSquares} />
    </>
  );
}
