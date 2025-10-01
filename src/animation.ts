import chalk from 'chalk';

// Walking stick figure animation frames
const WALKING_FRAMES = [
  ' o   \n/|\\ \n/ \\  ',
  '  o  \n /|\\\n / \\ ',
  '   o \n  /|\\\n  / \\',
  '  o  \n /|\\\n / \\ '
];

// Generate positions across the bottom of the screen
function generateBottomPositions(): number[] {
  const positions: number[] = [];
  const terminalWidth = process.stdout.columns || 80;

  // Create positions from left to right
  for (let col = 2; col <= terminalWidth - 12; col += 4) {
    positions.push(col);
  }

  return positions;
}

let currentFrame = 0;
let currentPositionIndex = 0;
let frameAtPosition = 0;
let animationInterval: Timer | null = null;
let direction = 1; // 1 for left-to-right, -1 for right-to-left
let positions: number[] = [];
let lastClearedCol = -1;

export function startAnimation() {
  if (animationInterval) return;

  positions = generateBottomPositions();
  const totalRows = process.stdout.rows || 24;
  const bottomRow = totalRows - 3; // Place at the very bottom (3 rows for the character)

  animationInterval = setInterval(() => {
    const character = WALKING_FRAMES[currentFrame];
    const col = positions[currentPositionIndex];

    // Save cursor position before drawing
    process.stdout.write('\x1b[s');

    // Draw character at current position (multi-line)
    const lines = character.split('\n');
    lines.forEach((line, i) => {
      process.stdout.write(`\x1b[${bottomRow + i};${col}H${chalk.cyan(line)}`);
    });

    // Restore cursor position
    process.stdout.write('\x1b[u');

    lastClearedCol = col;

    // Animate frames
    currentFrame = (currentFrame + 1) % WALKING_FRAMES.length;
    frameAtPosition++;

    // Stay at each position for 3 frames (about 0.6 seconds)
    if (frameAtPosition >= 3) {
      frameAtPosition = 0;

      // Clear old position before moving
      lines.forEach((line, i) => {
        process.stdout.write(`\x1b[${bottomRow + i};${col}H${' '.repeat(6)}`);
      });

      // Move to next position
      currentPositionIndex += direction;

      // Change direction at edges and pause
      if (currentPositionIndex >= positions.length) {
        currentPositionIndex = positions.length - 1;
        direction = -1;
        frameAtPosition = -3; // Pause for extra frames
      } else if (currentPositionIndex < 0) {
        currentPositionIndex = 0;
        direction = 1;
        frameAtPosition = -3; // Pause for extra frames
      }
    }
  }, 200); // Update every 200ms
}

export function stopAnimation() {
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;

    // Clear character from screen (all 3 rows)
    const totalRows = process.stdout.rows || 24;
    const bottomRow = totalRows - 3;
    const terminalWidth = process.stdout.columns || 80;

    // Save cursor position
    process.stdout.write('\x1b[s');

    // Clear the 3 rows used by the walking man
    for (let i = 0; i < 3; i++) {
      process.stdout.write(`\x1b[${bottomRow + i};1H${' '.repeat(terminalWidth)}`);
    }

    // Restore cursor position
    process.stdout.write('\x1b[u');

    // Reset state
    currentPositionIndex = 0;
    direction = 1;
    frameAtPosition = 0;
    lastClearedCol = -1;
  }
}
