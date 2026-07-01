'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BingoCard from '../components/BingoCard/BingoCard';
import styles from './create.module.css';
import LinkButton from '../components/_atoms/LinkButton/LinkButton';

const MIN = 24;
const MAX = 60;

export default function Create() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [squares, setSquares] = useState(Array.from({ length: MIN }, () => ''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const filled = squares.filter((s) => s.trim() !== '').length;
  const canSubmit = filled >= MIN && username.trim().length >= 3;

  const handleSquareChange = (index, value) => {
    const updated = [...squares];
    updated[index] = value;
    setSquares(updated);
  };

  const addSquare = () => {
    if (squares.length < MAX) setSquares([...squares, '']);
  };

  const removeSquare = (index) => {
    if (squares.length <= MIN) return;
    setSquares(squares.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const bingoCard = squares
      .filter((s) => s.trim() !== '')
      .map((text) => ({ text, isMarked: false }));

    try {
      const response = await fetch('/api/createGame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, bingoCard }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('bingo_gameId', result.gameId);
        localStorage.setItem('bingo_playerId', result.playerId);
        router.push(
          `/game?gameId=${result.gameId}&playerId=${result.playerId}`,
        );
      } else {
        setError(result.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const previewSquares = () => {
    const filled = squares
      .filter((s) => s.trim())
      .map((text) => ({ text, isMarked: false }));
    const padded = [...filled];
    while (padded.length < 25) padded.push({ text: '', isMarked: false });
    padded.splice(12, 1, { text: 'Free', isMarked: false });
    return padded;
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Create a Chat Bingo</h1>
      <p className={styles.subtitle}>
        Fill in your squares, then share the code with your chat.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.section}>
          <label className={styles.label} htmlFor='username'>
            Your username
          </label>
          <input
            type='text'
            id='username'
            placeholder='Enter username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            maxLength='10'
            minLength='3'
            className={styles.usernameInput}
          />
        </section>

        <section className={styles.section}>
          <div className={styles.squaresHeader}>
            <label className={styles.label}>Bingo squares</label>
            <span
              className={`${styles.counter} ${filled >= MIN ? styles.counterDone : ''}`}
            >
              {filled} / {MIN} minimum
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.min((filled / MIN) * 100, 100)}%` }}
            />
          </div>

          <ol className={styles.squareList}>
            {squares.map((square, index) => (
              <li key={index} className={styles.squareRow}>
                <span className={styles.squareNumber}>{index + 1}</span>
                <input
                  type='text'
                  placeholder={`Square ${index + 1}`}
                  value={square}
                  onChange={(e) => handleSquareChange(index, e.target.value)}
                  className={styles.squareInput}
                  maxLength={40}
                />
                {squares.length > MIN && (
                  <button
                    type='button'
                    className={styles.removeButton}
                    onClick={() => removeSquare(index)}
                    aria-label='Remove square'
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ol>

          {squares.length < MAX && (
            <button
              type='button'
              className={styles.addButton}
              onClick={addSquare}
            >
              + Add square{' '}
              <span className={styles.addCount}>
                ({squares.length}/{MAX})
              </span>
            </button>
          )}
        </section>

        {error && <p className={styles.error}>{error}</p>}

        <LinkButton
          isButton={true}
          buttonType='submit'
          text={isLoading ? 'Creating...' : 'Create Game'}
          disabled={isLoading || !canSubmit}
        />

        {!canSubmit && (
          <p className={styles.hint}>
            {username.trim().length < 3
              ? 'Enter a username to continue'
              : `Add ${Math.max(0, MIN - filled)} more square${MIN - filled === 1 ? '' : 's'} to continue`}
          </p>
        )}
      </form>

      <section className={styles.preview}>
        <h2 className={styles.previewTitle}>Preview</h2>
        <p className={styles.previewNote}>
          Chat will get a randomised version of this card
        </p>
        <BingoCard cellContent={previewSquares()} clickable={false} />
      </section>
    </div>
  );
}
