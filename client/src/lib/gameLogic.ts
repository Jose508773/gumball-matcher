/**
 * Match-Three Game Logic
 * Design Philosophy: Candy Pop Maximalism
 * - Vibrant, playful colors
 * - Bouncy, elastic animations
 * - Celebratory feedback for matches
 */

export type PieceType = 'red' | 'yellow' | 'blue' | 'pink' | 'purple' | 'orange';

export interface GamePiece {
  id: string;
  type: PieceType;
  row: number;
  col: number;
  isMatched?: boolean;
}

export interface GameState {
  board: GamePiece[][];
  score: number;
  lives: number;
  timeRemaining: number;
  level: number;
  moves: number;
  selectedPiece: { row: number; col: number } | null;
  isAnimating: boolean;
  gameOver: boolean;
  levelComplete: boolean;
  matchedPieces: Set<string>;
}

export interface LevelConfig {
  level: number;
  gridSize: number;
  timeLimit: number;
  targetScore: number;
  initialLives: number;
  moveLimit?: number;
}

const PIECE_TYPES: PieceType[] = ['red', 'yellow', 'blue', 'pink', 'purple', 'orange'];

// Generate random piece
export function generateRandomPiece(row: number, col: number, excludeTypes: PieceType[] = []): GamePiece {
  const availableTypes = PIECE_TYPES.filter(t => !excludeTypes.includes(t));
  const type = availableTypes.length > 0 
    ? availableTypes[Math.floor(Math.random() * availableTypes.length)]
    : PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  return {
    id: `${row}-${col}-${Date.now()}-${Math.random()}`,
    type,
    row,
    col,
  };
}

// Initialize game board without any pre-existing matches
export function initializeBoard(gridSize: number): GamePiece[][] {
  const board: GamePiece[][] = [];
  
  for (let row = 0; row < gridSize; row++) {
    board[row] = [];
    for (let col = 0; col < gridSize; col++) {
      // Find types that would create a match
      const forbiddenTypes: PieceType[] = [];
      
      // Check horizontal - if the two pieces to the left are the same type, exclude that type
      if (col >= 2) {
        const left1 = board[row][col - 1];
        const left2 = board[row][col - 2];
        if (left1.type === left2.type) {
          forbiddenTypes.push(left1.type);
        }
      }
      
      // Check vertical - if the two pieces above are the same type, exclude that type
      if (row >= 2) {
        const above1 = board[row - 1][col];
        const above2 = board[row - 2][col];
        if (above1.type === above2.type) {
          forbiddenTypes.push(above1.type);
        }
      }
      
      board[row][col] = generateRandomPiece(row, col, forbiddenTypes);
    }
  }
  
  return board;
}

// Check if two pieces are adjacent
export function areAdjacent(
  pos1: { row: number; col: number },
  pos2: { row: number; col: number }
): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

// Swap two pieces
export function swapPieces(
  board: GamePiece[][],
  pos1: { row: number; col: number },
  pos2: { row: number; col: number }
): GamePiece[][] {
  const newBoard = board.map(row => [...row]);
  const temp = newBoard[pos1.row][pos1.col];
  newBoard[pos1.row][pos1.col] = newBoard[pos2.row][pos2.col];
  newBoard[pos2.row][pos2.col] = temp;

  // Update positions
  newBoard[pos1.row][pos1.col].row = pos1.row;
  newBoard[pos1.row][pos1.col].col = pos1.col;
  newBoard[pos2.row][pos2.col].row = pos2.row;
  newBoard[pos2.row][pos2.col].col = pos2.col;

  return newBoard;
}

// Find matches in a line (horizontal or vertical)
export function findMatches(board: GamePiece[][]): Set<string> {
  const matched = new Set<string>();
  const gridSize = board.length;

  // Check horizontal matches
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize - 2; col++) {
      const current = board[row][col];
      const next1 = board[row][col + 1];
      const next2 = board[row][col + 2];

      if (current.type === next1.type && next1.type === next2.type) {
        matched.add(current.id);
        matched.add(next1.id);
        matched.add(next2.id);
      }
    }
  }

  // Check vertical matches
  for (let col = 0; col < gridSize; col++) {
    for (let row = 0; row < gridSize - 2; row++) {
      const current = board[row][col];
      const next1 = board[row + 1][col];
      const next2 = board[row + 2][col];

      if (current.type === next1.type && next1.type === next2.type) {
        matched.add(current.id);
        matched.add(next1.id);
        matched.add(next2.id);
      }
    }
  }

  return matched;
}

// Find match positions with row/col coordinates
export interface MatchGroup {
  positions: Array<{ row: number; col: number }>;
  centerRow: number;
  centerCol: number;
  pieceCount: number;
}

export function findMatchPositions(board: GamePiece[][]): MatchGroup[] {
  const matchGroups: MatchGroup[] = [];
  const processedIds = new Set<string>();
  const gridSize = board.length;

  // Helper to get the center of a group of positions
  const getCenter = (positions: Array<{ row: number; col: number }>) => {
    const sumRow = positions.reduce((sum, p) => sum + p.row, 0);
    const sumCol = positions.reduce((sum, p) => sum + p.col, 0);
    return {
      centerRow: sumRow / positions.length,
      centerCol: sumCol / positions.length,
    };
  };

  // Check horizontal matches
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize - 2; col++) {
      const current = board[row][col];
      const next1 = board[row][col + 1];
      const next2 = board[row][col + 2];

      if (current.type === next1.type && next1.type === next2.type) {
        // Check if this match group was already processed
        const groupKey = `h-${row}-${col}`;
        if (!processedIds.has(groupKey)) {
          processedIds.add(groupKey);
          
          // Find the full extent of the match (could be more than 3)
          const positions: Array<{ row: number; col: number }> = [];
          let c = col;
          while (c < gridSize && board[row][c].type === current.type) {
            positions.push({ row, col: c });
            c++;
          }
          
          const { centerRow, centerCol } = getCenter(positions);
          matchGroups.push({
            positions,
            centerRow,
            centerCol,
            pieceCount: positions.length,
          });
        }
      }
    }
  }

  // Check vertical matches
  for (let col = 0; col < gridSize; col++) {
    for (let row = 0; row < gridSize - 2; row++) {
      const current = board[row][col];
      const next1 = board[row + 1][col];
      const next2 = board[row + 2][col];

      if (current.type === next1.type && next1.type === next2.type) {
        // Check if this match group was already processed
        const groupKey = `v-${row}-${col}`;
        if (!processedIds.has(groupKey)) {
          processedIds.add(groupKey);
          
          // Find the full extent of the match (could be more than 3)
          const positions: Array<{ row: number; col: number }> = [];
          let r = row;
          while (r < gridSize && board[r][col].type === current.type) {
            positions.push({ row: r, col });
            r++;
          }
          
          const { centerRow, centerCol } = getCenter(positions);
          matchGroups.push({
            positions,
            centerRow,
            centerCol,
            pieceCount: positions.length,
          });
        }
      }
    }
  }

  return matchGroups;
}

// Helper to get forbidden types for a position (to avoid creating matches)
function getForbiddenTypes(board: GamePiece[][], row: number, col: number): PieceType[] {
  const gridSize = board.length;
  const forbidden: PieceType[] = [];
  
  // Check horizontal left (two pieces to the left)
  if (col >= 2 && board[row][col - 1] && board[row][col - 2]) {
    if (board[row][col - 1].type === board[row][col - 2].type) {
      forbidden.push(board[row][col - 1].type);
    }
  }
  
  // Check horizontal right (two pieces to the right)
  if (col <= gridSize - 3 && board[row][col + 1] && board[row][col + 2]) {
    if (board[row][col + 1].type === board[row][col + 2].type) {
      forbidden.push(board[row][col + 1].type);
    }
  }
  
  // Check horizontal middle (one left, one right)
  if (col >= 1 && col <= gridSize - 2 && board[row][col - 1] && board[row][col + 1]) {
    if (board[row][col - 1].type === board[row][col + 1].type) {
      forbidden.push(board[row][col - 1].type);
    }
  }
  
  // Check vertical above (two pieces above)
  if (row >= 2 && board[row - 1] && board[row - 2]) {
    if (board[row - 1][col].type === board[row - 2][col].type) {
      forbidden.push(board[row - 1][col].type);
    }
  }
  
  // Check vertical below (two pieces below)
  if (row <= gridSize - 3 && board[row + 1] && board[row + 2]) {
    if (board[row + 1][col].type === board[row + 2][col].type) {
      forbidden.push(board[row + 1][col].type);
    }
  }
  
  // Check vertical middle (one above, one below)
  if (row >= 1 && row <= gridSize - 2 && board[row - 1] && board[row + 1]) {
    if (board[row - 1][col].type === board[row + 1][col].type) {
      forbidden.push(board[row - 1][col].type);
    }
  }
  
  return [...new Set(forbidden)]; // Remove duplicates
}

// Remove matched pieces and apply gravity
export function removeMatchedAndApplyGravity(
  board: GamePiece[][],
  matchedIds: Set<string>
): GamePiece[][] {
  const gridSize = board.length;
  let newBoard = board.map(row => [...row]);

  // Remove matched pieces and apply gravity column by column
  for (let col = 0; col < gridSize; col++) {
    let writePos = gridSize - 1;
    for (let row = gridSize - 1; row >= 0; row--) {
      const piece = newBoard[row][col];
      if (!matchedIds.has(piece.id)) {
        newBoard[writePos][col] = piece;
        newBoard[writePos][col].row = writePos;
        writePos--;
      }
    }
    // Fill empty spaces with new pieces (avoiding matches)
    for (let row = writePos; row >= 0; row--) {
      const forbiddenTypes = getForbiddenTypes(newBoard, row, col);
      newBoard[row][col] = generateRandomPiece(row, col, forbiddenTypes);
    }
  }

  return newBoard;
}

// Get level configuration
export function getLevelConfig(level: number): LevelConfig {
  const baseGridSize = 7;
  const baseTimeLimit = 120;
  const baseTargetScore = 1000;

  // Progressive difficulty:
  // - Target score increases by 500 per level
  // - Grid size increases every 3 levels (max 10)
  // - Time limit decreases by 3 seconds per level (minimum 45 seconds)
  // - Lives stay at 3
  return {
    level,
    gridSize: Math.min(baseGridSize + Math.floor(level / 3), 10),
    timeLimit: Math.max(baseTimeLimit - (level - 1) * 3, 45),
    targetScore: baseTargetScore + (level - 1) * 500,
    initialLives: 3,
  };
}

// Calculate score for matches
export function calculateScore(matchCount: number): number {
  // Base score of 60 + 30 per matched piece, with bonus for larger matches
  const baseScore = 60 + matchCount * 30;
  // Bonus multiplier: 1.5x for 4 matches, 2x for 5, 2.5x for 6, etc.
  const multiplier = matchCount > 3 ? 1 + (matchCount - 3) * 0.5 : 1;
  return Math.floor(baseScore * multiplier);
}

// Check if level is complete
export function isLevelComplete(
  score: number,
  targetScore: number,
  lives: number
): boolean {
  return score >= targetScore && lives > 0;
}

// Check if game is over
export function isGameOver(lives: number, timeRemaining: number): boolean {
  return lives <= 0 || timeRemaining <= 0;
}
