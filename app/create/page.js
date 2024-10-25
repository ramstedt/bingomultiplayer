'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BingoCard from '../components/BingoCard/BingoCard';
import styles from './create.module.css';

export default function Create() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [bingoSquares, setBingoSquares] = useState(
    Array.from({ length: 24 }, () => ({ text: '', isMarked: false }))
  );
  const [createdGame, setCreatedGame] = useState(null);

  useEffect(() => {
    const initialSquares = Array.from({ length: 24 }, () => ({
      text: '',
      isMarked: false,
    }));
    setBingoSquares(initialSquares);
  }, []);

  const handleSquareChange = (index, value) => {
    const updatedSquares = [...bingoSquares];
    updatedSquares[index] = { ...updatedSquares[index], text: value };
    setBingoSquares(updatedSquares);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      username,
      bingoCard: bingoSquares,
    };

    try {
      const response = await fetch('/api/createGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setCreatedGame(result);
        router.push(
          `/game?gameId=${result.gameId}&playerId=${result.playerId}`
        );
      } else {
        console.error('Error creating game:', result.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const preparePreview = () => {
    const previewSquares = [...bingoSquares];
    previewSquares.splice(12, 0, { text: 'Free', isMarked: false });
    return previewSquares;
  };

  return (
    <>
      <h1>Create Game</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Username:</label>
        <br />
        <input
          type='text'
          id='username'
          name='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
              value={square.text}
              onChange={(e) => handleSquareChange(index, e.target.value)}
              required
            />
          ))}
        </div>
        <button type='submit'>Create Game</button>
      </form>

      <h2>Preview</h2>
      <p className={styles.text}>
        (Note: when players join the game, their bingo card will be randomised)
      </p>
      <BingoCard cellContent={preparePreview()} clickable={false} />
    </>
  );
}
