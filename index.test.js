const life = require("./index");

const { LIVE, DEAD, getNeighbourInfo, getRandomNumber, transitionToNextPhase, __state } = life;

function makeBoard(rows, cols, fill = DEAD) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => fill)
  );
}

function setBoard(board) {
  const rows = board.length;
  const cols = board[0].length;
  __state.TOTAL_ROWS = rows;
  __state.TOTAL_COLUMNS = cols;
  __state.GAME_MATRIX = board;
}

// Neighbour Counting

describe("getNeighbourInfo", () => {
  test("counts neighbours for a center cell correctly", () => {
    const board = makeBoard(3, 3, DEAD);
    board[0][0] = LIVE;
    board[0][1] = LIVE;
    board[1][0] = LIVE;

    __state.TOTAL_ROWS = 3;
    __state.TOTAL_COLUMNS = 3;

    const info = getNeighbourInfo(board, 1, 1);
    expect(info.live).toBe(3);
    expect(info.dead).toBe(5);
  });

  test("counts neighbours for a corner cell (only 3 neighbours exist)", () => {
    const board = makeBoard(3, 3, DEAD);
    board[0][1] = LIVE;
    board[1][0] = LIVE;

    __state.TOTAL_ROWS = 3;
    __state.TOTAL_COLUMNS = 3;

    const info = getNeighbourInfo(board, 0, 0);
    expect(info.live).toBe(2);
    expect(info.dead).toBe(1);
  });

  test("counts neighbours for an edge cell (only 5 neighbours exist)", () => {
    const board = makeBoard(3, 3, DEAD);
    board[0][0] = LIVE;
    board[0][2] = LIVE;
    board[1][1] = LIVE;

    __state.TOTAL_ROWS = 3;
    __state.TOTAL_COLUMNS = 3;

    // Top-middle cell (0,1) has 5 neighbours: (0,0), (0,2), (1,0), (1,1), (1,2)
    const info = getNeighbourInfo(board, 0, 1);
    expect(info.live).toBe(3);
    expect(info.dead).toBe(2);
  });

  test("returns zero live neighbours on an empty board", () => {
    const board = makeBoard(3, 3, DEAD);
    __state.TOTAL_ROWS = 3;
    __state.TOTAL_COLUMNS = 3;

    const info = getNeighbourInfo(board, 1, 1);
    expect(info.live).toBe(0);
    expect(info.dead).toBe(8);
  });

  test("returns all live neighbours when fully surrounded", () => {
    const board = makeBoard(3, 3, LIVE);
    __state.TOTAL_ROWS = 3;
    __state.TOTAL_COLUMNS = 3;

    const info = getNeighbourInfo(board, 1, 1);
    expect(info.live).toBe(8);
    expect(info.dead).toBe(0);
  });
});

// Conway's Rules

describe("Conway's rules via transitionToNextPhase", () => {
  test("Rule 1 Underpopulation: live cell with 0 neighbours dies", () => {
    const board = makeBoard(3, 3, DEAD);
    board[1][1] = LIVE; // isolated cell

    setBoard(board);
    transitionToNextPhase();

    expect(__state.GAME_MATRIX[1][1]).toBe(DEAD);
  });

  test("Rule 1 Underpopulation: live cell with 1 neighbour dies", () => {
    const board = makeBoard(3, 3, DEAD);
    board[1][1] = LIVE;
    board[0][0] = LIVE; // single neighbour

    setBoard(board);
    transitionToNextPhase();

    expect(__state.GAME_MATRIX[1][1]).toBe(DEAD);
  });

  test("Rule 2 – Survival: live cell with 2 neighbours survives", () => {
    const board = makeBoard(3, 3, DEAD);
    board[1][1] = LIVE;
    board[0][0] = LIVE;
    board[0][1] = LIVE;

    setBoard(board);
    transitionToNextPhase();

    expect(__state.GAME_MATRIX[1][1]).toBe(LIVE);
  });

  test("Rule 2 – Survival: live cell with 3 neighbours survives", () => {
    const board = makeBoard(3, 3, DEAD);
    board[1][1] = LIVE;
    board[0][0] = LIVE;
    board[0][1] = LIVE;
    board[0][2] = LIVE;

    setBoard(board);
    transitionToNextPhase();

    expect(__state.GAME_MATRIX[1][1]).toBe(LIVE);
  });

  test("Rule 3 – Overpopulation: live cell with 4 neighbours dies", () => {
    const board = makeBoard(3, 3, DEAD);
    board[1][1] = LIVE;
    board[0][0] = LIVE;
    board[0][1] = LIVE;
    board[0][2] = LIVE;
    board[1][0] = LIVE;

    setBoard(board);
    transitionToNextPhase();

    expect(__state.GAME_MATRIX[1][1]).toBe(DEAD);
  });

  test("Rule 4 – Reproduction: dead cell with exactly 3 neighbours becomes alive", () => {
    const board = makeBoard(3, 3, DEAD);
    board[0][0] = LIVE;
    board[0][1] = LIVE;
    board[1][0] = LIVE;
    // (1,1) is dead with 3 live neighbours

    setBoard(board);
    transitionToNextPhase();

    expect(__state.GAME_MATRIX[1][1]).toBe(LIVE);
  });

  test("Dead cell with 2 neighbours stays dead", () => {
    const board = makeBoard(3, 3, DEAD);
    board[0][0] = LIVE;
    board[0][1] = LIVE;
    // (1,1) is dead with only 2 live neighbours

    setBoard(board);
    transitionToNextPhase();

    expect(__state.GAME_MATRIX[1][1]).toBe(DEAD);
  });
});

//Known Patterns

describe("Known patterns", () => {
  test("Blinker oscillates from vertical to horizontal", () => {
    const board = makeBoard(5, 5, DEAD);
    board[1][2] = LIVE;
    board[2][2] = LIVE;
    board[3][2] = LIVE;

    setBoard(board);
    const changed = transitionToNextPhase();

    expect(changed).toBe(true);

    const next = __state.GAME_MATRIX;
    // Should become horizontal at row 2
    expect(next[2][1]).toBe(LIVE);
    expect(next[2][2]).toBe(LIVE);
    expect(next[2][3]).toBe(LIVE);
    // Old vertical ends should die
    expect(next[1][2]).toBe(DEAD);
    expect(next[3][2]).toBe(DEAD);
  });

  test("Blinker oscillates back after two ticks", () => {
    const board = makeBoard(5, 5, DEAD);
    board[1][2] = LIVE;
    board[2][2] = LIVE;
    board[3][2] = LIVE;

    setBoard(board);
    transitionToNextPhase(); // tick 1: vertical → horizontal
    transitionToNextPhase(); // tick 2: horizontal → vertical

    const result = __state.GAME_MATRIX;
    expect(result[1][2]).toBe(LIVE);
    expect(result[2][2]).toBe(LIVE);
    expect(result[3][2]).toBe(LIVE);
    expect(result[2][1]).toBe(DEAD);
    expect(result[2][3]).toBe(DEAD);
  });

  test("Block (still life) does not change", () => {
    const board = makeBoard(4, 4, DEAD);
    board[1][1] = LIVE;
    board[1][2] = LIVE;
    board[2][1] = LIVE;
    board[2][2] = LIVE;

    setBoard(board);
    const changed = transitionToNextPhase();

    expect(changed).toBe(false);
    expect(__state.GAME_MATRIX[1][1]).toBe(LIVE);
    expect(__state.GAME_MATRIX[1][2]).toBe(LIVE);
    expect(__state.GAME_MATRIX[2][1]).toBe(LIVE);
    expect(__state.GAME_MATRIX[2][2]).toBe(LIVE);
  });
});

//End-game Detection

describe("End-game detection", () => {
  test("returns false (no change) on an empty board", () => {
    const board = makeBoard(4, 4, DEAD);
    setBoard(board);

    const changed = transitionToNextPhase();
    expect(changed).toBe(false);
  });

  test("returns false when board is a stable still-life", () => {
    // 2x2 block
    const board = makeBoard(4, 4, DEAD);
    board[1][1] = LIVE;
    board[1][2] = LIVE;
    board[2][1] = LIVE;
    board[2][2] = LIVE;

    setBoard(board);
    const changed = transitionToNextPhase();
    expect(changed).toBe(false);
  });

  test("returns true when the board is still evolving", () => {
    const board = makeBoard(5, 5, DEAD);
    board[2][1] = LIVE;
    board[2][2] = LIVE;
    board[2][3] = LIVE;

    setBoard(board);
    const changed = transitionToNextPhase();
    expect(changed).toBe(true);
  });
});

// Edge Cases 

describe("Edge cases", () => {
  test("single-cell board: lone live cell dies", () => {
    const board = [[LIVE]];
    setBoard(board);

    transitionToNextPhase();
    expect(__state.GAME_MATRIX[0][0]).toBe(DEAD);
  });

  test("1xN board: row of three produces middle survivor", () => {
    // On a 1-row board, vertical neighbours don't exist,
    // so cells can only have left/right neighbours (max 2).
    // A row of 3 live cells: middle has 2 neighbours → survives.
    // Ends have 1 neighbour → die (underpopulation).
    const board = [[LIVE, LIVE, LIVE]];
    setBoard(board);

    transitionToNextPhase();
    expect(__state.GAME_MATRIX[0][0]).toBe(DEAD);
    expect(__state.GAME_MATRIX[0][1]).toBe(LIVE);
    expect(__state.GAME_MATRIX[0][2]).toBe(DEAD);
  });

  test("fully alive board: only corners survive overpopulation", () => {
    // 3x3 all live: corners have 3 neighbours (survive), edges have 5 (die), center has 8 (die).

    const board = makeBoard(3, 3, LIVE);
    setBoard(board);

    transitionToNextPhase();
    const m = __state.GAME_MATRIX;

    // Corners survive (3 neighbours)
    expect(m[0][0]).toBe(LIVE);
    expect(m[0][2]).toBe(LIVE);
    expect(m[2][0]).toBe(LIVE);
    expect(m[2][2]).toBe(LIVE);

    // Edges die (5 neighbours)
    expect(m[0][1]).toBe(DEAD);
    expect(m[1][0]).toBe(DEAD);
    expect(m[1][2]).toBe(DEAD);
    expect(m[2][1]).toBe(DEAD);

    // Center dies (8 neighbours)
    expect(m[1][1]).toBe(DEAD);
  });
});

//Utility 

describe("getRandomNumber", () => {
  test("returns values within the specified range", () => {
    for (let i = 0; i < 100; i++) {
      const val = getRandomNumber(0, 1);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(1);
    }
  });

  test("respects a larger range", () => {
    for (let i = 0; i < 100; i++) {
      const val = getRandomNumber(5, 10);
      expect(val).toBeGreaterThanOrEqual(5);
      expect(val).toBeLessThanOrEqual(10);
    }
  });
});
