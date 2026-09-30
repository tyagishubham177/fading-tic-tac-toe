# 🎲 **Fading Tic-Tac-Toe** 🎲

Welcome to **Fading Tic-Tac-Toe**! 🌀 A fun twist on the classic Tic-Tac-Toe where the game gets more intense with fading moves. It’s multiplayer, it’s competitive, and it’s all about strategy! 😎💡

## 🚀 **Features**

- 🎮 **Multiplayer Fun** – Play with friends online! Host a room or join one.
- 💡 **Fading Moves** – A strategic twist! Each player can have a maximum of 3 marks on the board. When a player makes their 4th mark, their oldest mark fades away. 🔄
- 👥 **Custom Usernames** – No more X and O! Play with your own username.
- 🏆 **Game History** – Track your epic wins and intense battles in the game history! 📜
- 📱 **Responsive UI** – Play on mobile, tablet, or desktop. It’s smooth and sleek everywhere! 💻📱
- 🌈 **Beautiful UI** – Colorful gradients and animations to make the game more engaging! 🎨

## 🛠️ **Getting Started**

Follow these steps to get up and running with Fading Tic-Tac-Toe! 🚀

### 1️⃣ **Clone the Repo**

```bash
git clone https://github.com/yourusername/fading-tic-tac-toe.git
cd fading-tic-tac-toe
```

### 2️⃣ **Install Dependencies**

```bash
npm install
```

### 3️⃣ **Start the Game**

```bash
npm start
```

Now, open your browser and head to:

```
http://localhost:3000
```

Let the battle of Tic-Tac-Toe begin! ⚔️

## 🎨 **How to Play**

1. 👥 **Create/Join a Room:** Enter your username, create a new game room, or join an existing one.
2. 📝 **Make Your Move:** Click on a square to make your move. Be strategic! Each player can only have three marks on the board at any time. When you place your fourth mark, your oldest one disappears! 😱
3. 🏁 **Win or Draw:** First to align 3 marks wins the game! If all squares are filled and no winner, it’s a draw! 🤝
4. 🔄 **Game History:** Review who won, how many moves it took, and more!

## 🎉 **Winning Strategy**

- 🚀 **Plan Ahead:** You lose your oldest mark when placing your fourth, so make sure your three marks are always working for you!
- 🧠 **Think Fast:** Every move matters in this strategic twist!
- 🏆 **Outplay Your Opponent:** Keep an eye on the board, and don’t let those moves fade away into oblivion! 🌀

---

## 🔧 **Project Structure**

```bash
src/
│
├── components/
│   ├── Game.js              # Main game component logic 🎮
│   ├── GameBoard.js         # The board where the magic happens ✨
│   ├── Square.js            # Individual clickable squares 🟦
│   ├── Lobby.js             # Where players create or join rooms 🏠
│   ├── Status.js            # Shows game info and who's winning 🏁
│   ├── GameHistory.js       # Displays the epic game history 🏆
│   ├── ResetButton.js       # For when you need a fresh start 🔄
│   ├── ScoreBoard.js        # Displays current scores 📊
│   ├── Rules.js             # Displays game rules 📜
│   └── constants.js         # Stores constant values used throughout the game 📚
│
├── hooks/
│   └── useGame.js           # Custom hook orchestrating game state, player interactions, and Firebase communication. Manages the game flow. 🎯
│
├── utils/
│   ├── firebaseUtils.js     # Firebase utility functions for database interactions 🔥
│   └── gameLogic.js         # Pure functions for core game rules: win detection, fading mark logic, turn progression, and game over conditions. 🧠
│
├── firebase.js              # Firebase configuration and initialization 🔥
├── App.js                   # Root component, handles routing and layout 🌐
├── index.js                 # App entry point 📍
├── App.css                  # Global app styles 🎨
└── index.css                # Base CSS styles 📐
```

--- 

## 💡 Code Structure Highlights & Refinements

To enhance modularity and maintainability, the codebase incorporates several key design patterns and separations of concerns:

-   **`src/hooks/useGame.js`**: This is the central nervous system for the game's client-side logic.
    -   It manages the complete game state, including the board, current player, turn count, scores, and history.
    -   It handles player moves (`handleMove`), validates them, and updates the state accordingly.
    -   It integrates with Firebase (via `firebaseUtils.js`) to send and receive real-time game updates.
    -   It encapsulates complex actions like resetting the game (`resetGame`).
    -   Helper functions within this hook, such as `updateScoresAndHistory`, further break down specific tasks.

-   **`src/utils/gameLogic.js`**: This module houses the pure, reusable logic that defines the rules of Fading Tic-Tac-Toe.
    -   `checkWinner`: Determines if a winning combination exists.
    -   `applyFadingRule`: Implements the unique "fading mark" mechanic, removing a player's oldest mark when they place their fourth mark.
    -   `calculateHighlightCell`: Identifies which cell will fade next for the current player.
    -   `getNextPlayer`: Manages turn progression.
    -   `isGameOver`: Checks for game completion conditions.
    -   Keeping this logic separate ensures that the game rules are testable and independent of the UI or state management framework.

-   **`src/utils/firebaseUtils.js`**: All direct interactions with the Firebase Firestore database are consolidated here. This includes creating game rooms, allowing players to join, and updating the game state in real-time.

-   **`src/components/constants.js`**: Defines shared constants like winning combinations, initial game state, and player markers (`PLAYER_X`, `PLAYER_O`) to ensure consistency and avoid magic values.

This separation helps in making the code easier to understand, test, and extend.

---

## ⚡ **Tech Stack**

- **React** 🌐 – Building the magic of the game!
- **Firebase** 🔥 – Real-time multiplayer syncing.
- **Tailwind CSS** 💅 – Styling with ease and beauty.

## 📱 **Mobile-Ready**

No need to stop the game when you leave your desktop! Tic-Tac-Toe works seamlessly on your mobile device. Swipe, tap, and play! 📲💨


## 🛠️ **Future Features**

- 👑 **Leaderboard** – Show the world who’s the best Tic-Tac-Toe master! 🏅
- ✨ **Custom Themes** – Choose your colors, marks, avatars, and personalize the game! 🎨
- 🔄 **Rematch Button** – Quick rematch after every game, because one round is never enough! 🔥
- 🔊 **Sounds** – Add fun sound effects for moves, wins, and more! 🎶
- 🏆 **Animations** – Celebrate with cool animations on winning, moves, and game transitions! 🎉🕺
- 🌈 **Fun Moving Background** – Add dynamic backgrounds to keep the game visually exciting! 🎆
- 🖼️ **Improved UI/UX** – A smoother and more intuitive interface to enhance the player experience! ✨📱
- 🤖 **Play Against Bot** – Challenge a computer opponent with multiple difficulty levels! 🧠

The proposed Easy, Medium, and self-play-trained Hard modes—including architecture,
training, evaluation, and a hosted preview workflow for contributors who do not run
a local setup—are detailed in the [bot modes implementation plan](docs/BOT_MODES_PLAN.md).

### 🤖 Bot difficulties

- **Easy** uses lightweight tactics with deliberate mistakes.
- **Medium** uses iterative-deepening alpha-beta search.
- **Hard** combines deeper search with a value model trained through 60,000 games
  of deterministic self-play. The checked-in model is used directly by the hosted
  app, so players never need Python, a GPU, or a local setup.

Maintainers can reproduce the Hard model with `npm run train:hard-bot`.

The `feature/bot-modes-plan` branch includes a CI deployment workflow that tests,
builds, and publishes an isolated 30-day Firebase Hosting preview. Repository
maintainers only need to configure the existing Firebase web values and a
`FIREBASE_TOKEN` as GitHub Actions secrets; players receive a browser URL and do
not need a local environment.


## 🤝 **Contributing**

Want to contribute to this fun project? 🎉 Open a pull request or report issues. Let’s make **Fading Tic-Tac-Toe** even better! 🙌

## 🏆 **Credits**

Big thanks to all contributors, testers, and players for making this game awesome! 💖 

---

💡 **Pro Tip:** Keep an eye on your moves! In **Fading Tic-Tac-Toe**, strategy is everything. 🧠⚔️

Let the games begin! 🚀

---
