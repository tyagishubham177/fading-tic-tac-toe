import { getMoveAges } from "./GameBoard";

test("ranks each player's three moves independently from newest to oldest", () => {
  const board = [
    { player: "X", turn: 1 },
    { player: "O", turn: 2 },
    { player: "X", turn: 3 },
    { player: "O", turn: 4 },
    { player: "X", turn: 5 },
    { player: "O", turn: 6 },
    null,
    null,
    null,
  ];

  expect(getMoveAges(board)).toEqual({
    0: 3,
    1: 3,
    2: 2,
    3: 2,
    4: 1,
    5: 1,
  });
});
