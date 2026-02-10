const life = require("./index");

const { LIVE, DEAD, getNeighbourInfo, transitionToNextPhase, __state } = life;

function makeBoard(rows, cols, fill = DEAD) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));
}

describe("Game of Life", () => {
  test("getNeighbourInfo counts correctly (center cell)", () => {
    const rows = 3,
      cols = 3;
    const board = makeBoard(rows, cols, DEAD);

    // Make 3 live neighbours around the center (1,1)
    board[0][0] = LIVE;
    board[0][1] = LIVE;
    board[1][0] = LIVE;

    // TOTAL_ROWS / TOTAL_COLUMNS are used for bounds checking
    __state.TOTAL_ROWS = rows;
    __state.TOTAL_COLUMNS = cols;

    const info = getNeighbourInfo(board, 1, 1);
    expect(info.live).toBe(3);
    expect(info.dead).toBe(5);
  });

  test("getNeighbourInfo counts correctly (corner cell)", () => {
    const rows = 3,
      cols = 3;
    const board = makeBoard(rows, cols, DEAD);

    board[0][1] = LIVE;
    board[1][0] = LIVE;

    __state.TOTAL_ROWS = rows;
    __state.TOTAL_COLUMNS = cols;

    const info = getNeighbourInfo(board, 0, 0);
    expect(info.live).toBe(2);
    expect(info.dead).toBe(1);
  });

  test("transitionToNextPhase blinker oscillates (one tick)", () => {
    __state.TOTAL_ROWS = 5;
    __state.TOTAL_COLUMNS = 5;

    const board = makeBoard(5, 5, DEAD);

    // vertical bliker at col=2
    board[1][2] = LIVE;
    board[2][2] = LIVE;
    board[3][2] = LIVE;

    __state.GAME_MATRIX = board;

    const changed = transitionToNextPhase();
    expect(changed).toBe(true);

    const next = __state.GAME_MATRIX;

    // should become horizontal at row=2
    expect(next[2][1]).toBe(LIVE);
    expect(next[2][2]).toBe(LIVE);
    expect(next[2][3]).toBe(LIVE);

    // old vertical ends should die
    expect(next[1][2]).toBe(DEAD);
    expect(next[3][2]).toBe(DEAD);
  });

  test("transitionToNextPhase returns false if nothing changes", () => {
    __state.TOTAL_ROWS = 4;
    __state.TOTAL_COLUMNS = 4;

    // empty board stays empty forever
    const board = makeBoard(4, 4, DEAD);
    __state.GAME_MATRIX = board;

    const changed = transitionToNextPhase();
    expect(changed).toBe(false);
  });
});
