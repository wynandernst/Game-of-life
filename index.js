const readline = require("readline");

//Utils

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRow() {
  const row = [];
  for (let i = 0; i < TOTAL_COLUMNS; i++) {
    row.push(getRandomNumber(0, 1) === 0 ? DEAD : LIVE);
  }
  return row;
}

// Default board size if no args provided
let TOTAL_ROWS = 20;
let TOTAL_COLUMNS = 16;

let int = null;
let currentIteration = 0;

// Tried using emojis but they make the spacing inconsistent, using block characters instead. You can change these to whatever you like, as long as they are the same length for consistent spacing.
const DEAD = "░░";
const LIVE = "██";

const args = process.argv.slice(2);
if (args.length > 1) {
  TOTAL_ROWS = parseInt(args[0], 10);
  TOTAL_COLUMNS = parseInt(args[1], 10);
}

let GAME_MATRIX = [];
let RENDER_TOP = 0;
let FRAME_HEIGHT = 0;
let cursorHidden = false;

//game logic

function transitionToNextPhase() {
  let hasChanged = false;

  // Copy snapshot for neighbour calculations, so the original isn't modified while iterating
  const matrix = GAME_MATRIX.map((row) => row.slice());

  for (let row = 0; row < TOTAL_ROWS; row++) {
    for (let column = 0; column < TOTAL_COLUMNS; column++) {
      const info = getNeighbourInfo(matrix, row, column);

      if (matrix[row][column] === LIVE) {
        if (info.live < 2 || info.live > 3) {
          GAME_MATRIX[row][column] = DEAD;
          hasChanged = true;
        }
      } else {
        if (info.live === 3) {
          GAME_MATRIX[row][column] = LIVE;
          hasChanged = true;
        }
      }
    }
  }

  return hasChanged;
}

function getNeighbourInfo(matrix, row, column) {
  const info = {
    live: 0,
    dead: 0,
  };

  // Check all surrounding cells
  for (let neighbourRow = row - 1; neighbourRow <= row + 1; neighbourRow++) {
    for (let neighbourCol = column - 1; neighbourCol <= column + 1; neighbourCol++) {
      // Skip the cell itself
      if (neighbourRow === row && neighbourCol === column) {
        continue;
      }

      // Skip neighbours that fall outside the grid
      if (neighbourRow < 0 || neighbourRow >= TOTAL_ROWS) {
        continue;
      }

      if (neighbourCol < 0 || neighbourCol >= TOTAL_COLUMNS) {
        continue;
      }

      // Count live vs dead neighbours
      if (matrix[neighbourRow][neighbourCol] === LIVE) {
        info.live++;
      } else {
        info.dead++;
      }
    }
  }

  return info;
}

// rendering

function setupFrame() {
  hideCursor();

  RENDER_TOP = 0;

  // Prints blank lines once, then rewrites in-place.
  process.stdout.write("\n".repeat(FRAME_HEIGHT));

  readline.cursorTo(process.stdout, 0, RENDER_TOP);
}

function printGameMatrix() {
  // Draw each row on its own terminal line
  for (let i = 0; i < TOTAL_ROWS; i++) {
    writeLineAt(0, RENDER_TOP + i, GAME_MATRIX[i].join(""));
  }

  // Spacer line
  writeLineAt(0, RENDER_TOP + TOTAL_ROWS, "");

  // Shows how many iterations have passed, below the game board
  writeLineAt(0, RENDER_TOP + TOTAL_ROWS + 1, "Iteration # " + currentIteration);
}

function writeLineAt(x, y, text) {
  readline.cursorTo(process.stdout, x, y);
  readline.clearLine(process.stdout, 0);
  process.stdout.write(text);
}

function stop(message) {
  if (int) clearInterval(int);
  int = null;

  if (message) {
    writeLineAt(0, RENDER_TOP + FRAME_HEIGHT, message);
  }

  showCursor();

  readline.cursorTo(process.stdout, 0, RENDER_TOP + FRAME_HEIGHT + 1);
  process.stdout.write("\n");

  process.exit(0);
}

function hideCursor() {
  if (cursorHidden) return;
  cursorHidden = true;
  process.stdout.write("\x1B[?25l");
}

function showCursor() {
  if (!cursorHidden) return;
  cursorHidden = false;
  process.stdout.write("\x1B[?25h");
}

// start 
function start() {
  // init board
  GAME_MATRIX = [];
  for (let i = 0; i < TOTAL_ROWS; i++) {
    GAME_MATRIX.push(getRow());
  }

  FRAME_HEIGHT = TOTAL_ROWS + 2;

  // First render
  setupFrame();
  printGameMatrix();

  int = setInterval(() => {
    currentIteration++;
    const changed = transitionToNextPhase();
    printGameMatrix();

    if (!changed) {
      stop("THE END!");
    }
  }, 200);

  // Clean exit on Ctrl+C
  process.once("SIGINT", () => stop());
}

if (require.main === module) {
  start();
}


module.exports = {
  DEAD,
  LIVE,

  getRandomNumber,
  getRow,

  transitionToNextPhase,
  getNeighbourInfo,

  setupFrame,
  printGameMatrix,
  writeLineAt,

  start,

  __state: {
    get TOTAL_ROWS() {
      return TOTAL_ROWS;
    },
    get TOTAL_COLUMNS() {
      return TOTAL_COLUMNS;
    },
    get GAME_MATRIX() {
      return GAME_MATRIX;
    },
    set GAME_MATRIX(v) {
      GAME_MATRIX = v;
    },
    set TOTAL_ROWS(v) {
      TOTAL_ROWS = v;
    },
    set TOTAL_COLUMNS(v) {
      TOTAL_COLUMNS = v;
    },
  },
};
