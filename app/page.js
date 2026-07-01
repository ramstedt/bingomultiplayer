'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import LinkButton from './components/_atoms/LinkButton/LinkButton';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedGame, setSavedGame] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedGameId = localStorage.getItem('bingo_gameId');
    const savedPlayerId = localStorage.getItem('bingo_playerId');
    if (savedGameId && savedPlayerId) {
      setSavedGame({ gameId: savedGameId, playerId: savedPlayerId });
    }
  }, []);

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
        localStorage.setItem('bingo_gameId', data.gameId);
        localStorage.setItem('bingo_playerId', data.playerId);
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
      <div className={styles.hero}>
        <Image
          src='/chatbingo.png'
          alt='Chat Bingo'
          width={360}
          height={360}
          priority
          className={styles.logo}
        />
        <p className={styles.tagline}>
          Set up in minutes. Play live with your chat.
        </p>
      </div>

      <section className={styles.about}>
        <h1>Live bingo for Twitch streamers and their chat</h1>
        <p>
          Chat Bingo lets Twitch streamers create a shared bingo card for their
          community. Fill it with inside jokes, stream moments, or anything that
          fits your content — then share a code and let your chat play along
          live.
        </p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <div>
              <strong>Streamer creates a game</strong>
              <p>
                Add your bingo squares and share the 4-letter code with your
                chat.
              </p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <div>
              <strong>Chat joins with the code</strong>
              <p>Everyone gets their own randomised bingo card.</p>
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <div>
              <strong>Play together in real time</strong>
              <p>
                Mark off squares as things happen on stream. First to bingo
                wins!
              </p>
            </div>
          </div>
        </div>
      </section>

      {savedGame && (
        <div className={styles.rejoinBanner}>
          <span>
            You were in game <strong>{savedGame.gameId}</strong>
          </span>
          <button
            className={styles.rejoinButton}
            onClick={() =>
              router.push(
                `/game?gameId=${savedGame.gameId}&playerId=${savedGame.playerId}`,
              )
            }
          >
            Rejoin
          </button>
          <button
            className={styles.dismissButton}
            onClick={() => {
              localStorage.removeItem('bingo_gameId');
              localStorage.removeItem('bingo_playerId');
              setSavedGame(null);
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      <form className={styles.joinForm} onSubmit={handleSubmit}>
        <input
          type='text'
          id='name'
          name='name'
          placeholder='Your username'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength='10'
          minLength='3'
        />
        <input
          type='text'
          id='code'
          name='code'
          placeholder='Game code'
          value={gameId}
          onChange={(e) => setGameId(e.target.value.toUpperCase())}
          required
        />
        <LinkButton
          isButton={true}
          buttonType='submit'
          text={isLoading ? 'Joining...' : 'Join Game'}
          onClick={handleSubmit}
          disabled={isLoading}
        />
        {error && <p className={styles.error}>{error}</p>}
      </form>

      <p className={styles.or}>or</p>
      <LinkButton text='Create a game' href='/create' />
    </>
  );
}
