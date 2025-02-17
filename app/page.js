'use client';
import { useState } from 'react';
import LinkButton from './components/_atoms/LinkButton/LinkButton';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import Kofi from './components/Kofi/Kofi';

export default function Home() {
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/joinGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, gameId }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/game?gameId=${data.gameId}&playerId=${data.playerId}`);
      } else {
        setError(data.error || 'Failed to join the game. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1>MultiPlayer Bingo</h1>
      <h3>Created by Catface</h3>
      <form className={styles.joinForm} onSubmit={handleSubmit}>
        <div>
          <label htmlFor='name'>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Enter your username'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength='10'
              minLength='3'
            />
          </label>
        </div>
        <div>
          <label htmlFor='code'>
            <input
              type='text'
              id='code'
              name='code'
              placeholder='Enter game code'
              value={gameId}
              onChange={(e) => setGameId(e.target.value.toUpperCase())}
              required
            />
          </label>
        </div>
        <LinkButton
          isButton={true}
          buttonType='submit'
          text={isLoading ? 'Joining...' : 'Join Game'}
          onClick={handleSubmit}
          disabled={isLoading}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <br />
      or
      <br />
      <br />
      <LinkButton text='Create a game' href='/create' />
      <div className='margin'>
        <br />
        <h2>How to play</h2>
        <p>
          Join a game by entering the code that was shared with you. You will
          receive a bingo card with boxes in a randomised order. Fill in your
          bingo card as you play. Once you have a bingo, you can announce it to
          everyone!
        </p>
      </div>
      <Kofi />
    </>
  );
}
