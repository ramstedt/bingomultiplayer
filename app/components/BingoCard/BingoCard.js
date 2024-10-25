"use client";
import { useState, useEffect } from "react";
import styles from "./BingoCard.module.css";
import { CiStar } from "react-icons/ci";

const BingoCard = ({ cellContent }) => {
  const initialMarkedGrid = Array(5)
    .fill(null)
    .map(() => Array(5).fill(false));

  const [grid, setGrid] = useState([]);
  const [markedGrid, setMarkedGrid] = useState(initialMarkedGrid);
  const [bingoStatus, setBingoStatus] = useState("");

  useEffect(() => {
    if (Array.isArray(cellContent) && cellContent.length >= 24) {
      const cellContentArray = [...cellContent];
      cellContentArray.splice(12, 0, { text: "Free", isMarked: true });

      const newGrid = Array(5)
        .fill(null)
        .map((_, rowIndex) =>
          Array(5)
            .fill(null)
            .map((_, colIndex) => {
              const cell = cellContentArray[rowIndex * 5 + colIndex];
              if (rowIndex === 2 && colIndex === 2) {
                return (
                  <div
                    key={`free-${rowIndex}-${colIndex}`}
                    className={`${styles.free} ${styles.cell}`}
                  >
                    <CiStar /> <div>Free</div>
                  </div>
                );
              }
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${styles.cell} ${
                    cell.isMarked ? styles.marked : ""
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell.text || " "}
                </div>
              );
            })
        );
      setGrid(newGrid);
    } else {
      console.warn("Invalid cellContent:", cellContent);
      setGrid(Array(5).fill(Array(5).fill({ text: "", isMarked: false })));
    }
  }, [cellContent]);

  const handleCellClick = (rowIndex, colIndex) => {
    if (rowIndex === 2 && colIndex === 2) return;

    const updatedGrid = [...cellContent];
    const cellIndex = rowIndex * 5 + colIndex;
    updatedGrid[cellIndex].isMarked = !updatedGrid[cellIndex].isMarked;

    setMarkedGrid(
      markedGrid.map((row, rIdx) =>
        row.map((marked, cIdx) =>
          rIdx === rowIndex && cIdx === colIndex ? !marked : marked
        )
      )
    );
  };

  const checkBingo = (markedGrid) => {
    for (let row of markedGrid) {
      if (row.every((cell) => cell === true)) return true;
    }

    for (let col = 0; col < 5; col++) {
      if (markedGrid.every((row) => row[col] === true)) return true;
    }

    if (markedGrid.every((row, index) => row[index] === true)) return true;
    if (markedGrid.every((row, index) => row[4 - index] === true)) return true;

    return false;
  };

  useEffect(() => {
    if (checkBingo(markedGrid)) {
      const announce = window.confirm(
        "You got Bingo! Do you want to announce it?"
      );
      if (announce) {
        setBingoStatus("Bingo! 🎉");
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
                markedGrid[rowIndex][colIndex] ? styles.marked : ""
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
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
