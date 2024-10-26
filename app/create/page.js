"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BingoCard from "../components/BingoCard/BingoCard";
import styles from "./create.module.css";
import LinkButton from "../components/_atoms/LinkButton/LinkButton";

export default function Create() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [bingoSquares, setBingoSquares] = useState(
    Array.from({ length: 60 }, () => ({ text: "", isMarked: false }))
  );
  const [createdGame, setCreatedGame] = useState(null);
  const [visibleSquares, setVisibleSquares] = useState(1);

  const handleSquareChange = (index, value) => {
    const updatedSquares = [...bingoSquares];
    updatedSquares[index] = { ...updatedSquares[index], text: value };
    setBingoSquares(updatedSquares);
  };

  const revealNextSquare = () => {
    if (visibleSquares < 60) {
      setVisibleSquares((prev) => prev + 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      username,
      bingoCard: bingoSquares.slice(0, visibleSquares),
    };

    try {
      const response = await fetch("/api/createGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        console.error("Error creating game:", result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const preparePreview = () => {
    let previewSquares = [...bingoSquares.slice(0, visibleSquares)];

    while (previewSquares.length < 25) {
      previewSquares.push({ text: "", isMarked: false });
    }
    previewSquares.splice(12, 1, { text: "Free", isMarked: false });

    return previewSquares;
  };

  return (
    <>
      <h1>Create Game</h1>
      <form className={styles.createGameForm} onSubmit={handleSubmit}>
        <br />
        <label>
          Bingo Squares:
          <br />
          <small>Enter at least 24 and a maximum of 60 squares</small>
        </label>
        <div className={styles.squareInputs}>
          {bingoSquares.slice(0, visibleSquares).map((square, index) => (
            <input
              key={index}
              type="text"
              name={`square${index + 1}`}
              placeholder={`Square ${index + 1}`}
              value={square.text}
              onChange={(e) => handleSquareChange(index, e.target.value)}
              required
            />
          ))}
        </div>
        {visibleSquares < 60 && (
          <LinkButton
            isButton={true}
            buttonType="button"
            onClick={revealNextSquare}
            text="Add Square"
          />
        )}

        <br />
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          maxLength="10"
          minLength="3"
        />
        <br />
        <LinkButton isButton={true} text="Create Game" buttonType="submit" />
        <br />
      </form>

      <h2>Preview</h2>
      <p className={styles.text}>
        (Note: when players join the game, their bingo card will be randomised)
      </p>
      <BingoCard cellContent={preparePreview()} clickable={false} />
    </>
  );
}
