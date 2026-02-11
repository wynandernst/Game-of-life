# Game-of-life
Example of Conways Game of Life written in Node.js rendered using readline which is a native module


## Setup
1. Clone repo
2. Install dependencies: `npm install`
3. Run `node index.js` This will run the program with default 20 rows, 16 columns and unlimited generations

### With Custom grid size and generations
You can run the program with custom rows, columns and a max number of generations:

`node index.js <rows> <columns> <generations>`

e.g `node index.js 50 50 100` will run it with 50 rows, 50 columns and stop after 100 generations

If generations is omitted the game runs until a steady state is reached.

The game uses fixed-width characters to ensure consistent alignment across terminals but it can be swapped out for any other characters. though I found Emojis mess up the spacing


### How the game runs

A random board is generated

Every tick:

The current board is copied

Neighbours are counted

Conway's rules are applied

The board is redrawn in the same terminal area

The game stops when either:
- Nothing changes anymore
- The configured max number of generations is reached

You'll see the iteration count update at the bottom.


### Testing

The game logic is testable with `npm test`

Tests are organised into the following groups:

- **Neighbour counting** – center, corner, edge cells, empty and fully-alive boards
- **Conway's rules** – each rule tested individually
- **Known patterns** – blinker oscillation, block still-life
- **End-game detection** – empty board, stable state, evolving board
- **Edge cases** – single-cell board, 1×N board, fully-alive 3×3 board
- **Utility** – random number generation bounds
