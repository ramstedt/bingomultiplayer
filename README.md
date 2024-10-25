## How to install locally

First, fill in the necessary environment keys (see .env.example). Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## QA testing instructions

The application is mobile-first and should work on any device and any size screen.

- Front page:
  - You should see two options: Join Game and Create a game.
  - Create game should take you to /create
  - Join game should take you to the game you wish to join (see Join an existing game further down)
- Create game:
  - Fill in the squares. The preview below should reflect your input. The preview is not clickable.
  - You should not be able to create a game without a username or any empty squares.
  - A game should be sucessfully created once the form is correctly filled in. You should be redirected to a game session with your username and a randomised bingo card.
- Join an existing game:
  - On the front page you should be able to fill in a username and an existing game code. This should redirect you to a game session with your username and a randomised bingo card consisting of the tiles that belong to that particular game.
  - You should not be able to join a game that does not exist.
  - You should not be able to join a game with any missing information (game code and username).
- Playing the game:
  - You should be able to select and unselect any tile. A selected tile should turn blue.
  - When you have your first Bingo, confetti should show up and a "Bingo!" message should appear below the card.
- Interacting with other players:

  - If there are other players in the same session, you should see their usernames below your card.
  - You should be able to click on their names to display their unique bingo cards.
  - You should be able to click on their names again to hide their bingo cards.
  - You should be able to see their marked squares, highlighted in blue.
  - If another player has a Bingo, their name should turn green and a "(Bingo!)" text should appear next to their name.

  ## Known bugs
