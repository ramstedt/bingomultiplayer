import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { ref, get, child, set } from "firebase/database";

const generateGameID = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length: 4 }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length))
  ).join("");
};

const generatePlayerID = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};

const checkPlayerIDExists = async (playerId) => {
  const snapshot = await get(child(ref(db), `Players/${playerId}`));
  return snapshot.exists();
};

const generateUniquePlayerID = async () => {
  let playerId = generatePlayerID();
  while (await checkPlayerIDExists(playerId)) {
    playerId = generatePlayerID();
  }
  return playerId;
};

const checkGameIDExists = async (gameId) => {
  const snapshot = await get(child(ref(db), `Games/${gameId}`));
  return snapshot.exists();
};

const generateUniqueGameID = async () => {
  let gameId = generateGameID();
  while (await checkGameIDExists(gameId)) {
    gameId = generateGameID();
  }
  return gameId;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, bingoCard } = body;

    if (
      !username ||
      !Array.isArray(bingoCard) ||
      bingoCard.length < 24 ||
      bingoCard.length > 60
    ) {
      return NextResponse.json(
        { error: "Username and between 24 to 60 bingo squares are required." },
        { status: 400 }
      );
    }

    const shuffledArray = shuffleArray([...bingoCard]);

    let gameCard = bingoCard.map((content) => ({
      text: content.text,
      isMarked: false,
    }));
    let playerCard = shuffledArray.map((content) => ({
      text: content.text,
      isMarked: false,
    }));
    if (bingoCard.length >= 24) {
      playerCard.splice(12, 0, { text: "Free", isMarked: false });
    }

    const playerId = await generateUniquePlayerID();
    const gameId = await generateUniqueGameID();
    const creationDate = new Date().toISOString();

    await set(ref(db, `Games/${gameId}`), {
      bingoSquares: gameCard,
      creationDate,
      creatorPlayerId: playerId,
    });

    await set(ref(db, `Players/${playerId}`), {
      username,
      gameId,
      bingoCard: playerCard,
      isWinner: false,
    });

    return NextResponse.json(
      {
        gameId,
        playerId,
        username,
        gameCard,
        isWinner: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user and bingo card:", error.message);
    return NextResponse.json(
      {
        error: "An error occurred while creating the user and bingo card.",
      },
      { status: 500 }
    );
  }
}
