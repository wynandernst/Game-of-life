# Game-of-life
Example of Conways Game of Life written in Node.js rendered using readline which is a native module


## Setup
1. Clone repo
2. Install dependencies: `npm install`
3. Run `node index.js` This will run the program with default 20 rows and 16 columns

### With Custom grid size
You can run the program with any amount of rows and colummns `node index.js <rows> <columns>`
e.g `node index.js 50 50` will run it with 50 rows and 50 columns

The app will automatically stop once it has reached.

The game uses fixed-width characters to ensure consistent alignment across terminals but it can be swapped out for any other characters. though I found Emojis mess up the spacing


### How the game runs

A random board is generated

Every tick:

The current board is copied

Neighbours are counted

Conway’s rules are applied

The board is redrawn in the same terminal area

If nothing changes anymore, the game stops

You’ll see the iteration count update at the bottom.


### Testing

The game logic is testable with `npm test`
and tests: 
    Neighbour counting
    Rule application
    cell life/death logic
    End game detection