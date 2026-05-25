import { useState, useEffect, Dispatch, SetStateAction } from "react";
import Window from "components/Window";
import { windows } from "data/windows";

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const ROWS = 9;
const COLS = 9;
const MINES = 10;
const CELL_PX = 20;
/** Grid + sunken frame (2px bevel × 2 + 4px padding) */
const GRID_FRAME_PX = 12;
const HEADER_PX = 34;
const WINDOW_WIDTH = COLS * CELL_PX + GRID_FRAME_PX + 8;
const WINDOW_MIN_HEIGHT = HEADER_PX + ROWS * CELL_PX + GRID_FRAME_PX + 8;

export default function Minesweeper({
  show,
  setActiveWindows,
  windowOrder,
  bringToFront,
}: {
  show: boolean;
  setActiveWindows: Dispatch<SetStateAction<Record<string, boolean>>>;
  windowOrder: string[];
  bringToFront: () => void;
}) {
  const windowConfig = windows.find((w) => w.title === "Minesweeper");
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [time, setTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    setMounted(true);
    initializeGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  const createEmptyGrid = () => {
    return Array(ROWS)
      .fill(null)
      .map(() =>
        Array(COLS)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
          }))
      );
  };

  const initializeGrid = () => {
    setGrid(createEmptyGrid());
    setIsFirstClick(true);
    setGameOver(false);
    setGameWon(false);
    resetTimer();
  };

  useEffect(() => {
    stopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameWon, gameOver]);

  const placeMinesAfterFirstClick = (firstRow: number, firstCol: number) => {
    const newGrid = createEmptyGrid();
    let minesPlaced = 0;

    const safeZone = [];
    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        const ni = firstRow + di;
        const nj = firstCol + dj;
        if (ni >= 0 && ni < ROWS && nj >= 0 && nj < COLS) {
          safeZone.push(`${ni}-${nj}`);
        }
      }
    }

    while (minesPlaced < MINES) {
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);
      if (!newGrid[row][col].isMine && !safeZone.includes(`${row}-${col}`)) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (!newGrid[i][j].isMine) {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di;
              const nj = j + dj;
              if (
                ni >= 0 &&
                ni < ROWS &&
                nj >= 0 &&
                nj < COLS &&
                newGrid[ni][nj].isMine
              ) {
                count++;
              }
            }
          }
          newGrid[i][j].neighborMines = count;
        }
      }
    }

    return newGrid;
  };

  const revealCell = (row: number, col: number) => {
    if (gameOver || gameWon || grid[row][col].isFlagged) return;

    if (isFirstClick) {
      startTimer();
      const newGrid = placeMinesAfterFirstClick(row, col);
      setGrid(newGrid);
      setIsFirstClick(false);
      const updatedGrid = [...newGrid];
      floodFill(updatedGrid, row, col);
      setGrid(updatedGrid);
      checkWinCondition(updatedGrid);
      return;
    }

    const newGrid = [...grid];

    if (grid[row][col].isMine) {
      revealAllMines();
      setGameOver(true);
      return;
    }

    floodFill(newGrid, row, col);
    setGrid(newGrid);
    checkWinCondition(newGrid);
  };

  const floodFill = (grid: Cell[][], row: number, col: number) => {
    if (
      row < 0 ||
      row >= ROWS ||
      col < 0 ||
      col >= COLS ||
      grid[row][col].isRevealed ||
      grid[row][col].isFlagged
    ) {
      return;
    }

    grid[row][col].isRevealed = true;

    if (grid[row][col].neighborMines === 0) {
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          floodFill(grid, row + di, col + dj);
        }
      }
    }
  };

  const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameOver || gameWon || grid[row][col].isRevealed) return;

    const newGrid = [...grid];
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
    setGrid(newGrid);
  };

  const revealAllMines = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        isRevealed: cell.isMine ? true : cell.isRevealed,
      }))
    );
    setGrid(newGrid);
  };

  const checkWinCondition = (gridToCheck: Cell[][]) => {
    const won = gridToCheck.every((row) =>
      row.every(
        (cell) =>
          (cell.isMine && !cell.isRevealed) || (!cell.isMine && cell.isRevealed)
      )
    );
    if (won) setGameWon(true);
  };

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged)
      return (
        <img
          src="/flag.png"
          alt="Flag"
          className="w-3.5 h-3.5 object-contain pointer-events-none"
          draggable={false}
        />
      );
    if (!cell.isRevealed) return null;
    if (cell.isMine)
      return (
        <img
          src="/mine.png"
          alt="Mine"
          className="w-3.5 h-3.5 object-contain pointer-events-none"
          draggable={false}
        />
      );
    if (cell.neighborMines === 0) return null;
    return (
      <span className="text-[11px] font-bold leading-none">{cell.neighborMines}</span>
    );
  };

  const startTimer = () => {
    if (timerInterval) return;
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const resetTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setTime(0);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const minesBodyClass =
    "window-body minesweeper-app m-0 p-0 overflow-hidden flex flex-col shrink-0 bg-[#c0c0c0] font-sans";

  const gameContent = (
    <div
      className="flex flex-col bg-[#c0c0c0] text-black font-sans shrink-0"
      style={{ width: WINDOW_WIDTH, minHeight: WINDOW_MIN_HEIGHT }}
    >
      <div className="flex items-center justify-between gap-2 px-1.5 py-1 border-b border-[#808080] shrink-0 h-[34px] box-border">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => initializeGrid()}
            className="xp-btn-reset window-button px-2 py-0.5 text-[11px] bg-[#e6e6e6] hover:bg-[#f3f3f3] border border-t-white border-l-white border-r-[#808080] border-b-[#808080] cursor-pointer shrink-0"
          >
            🙂
          </button>
          <span className="text-[11px] font-bold truncate">
            {gameOver && "Game Over!"}
            {gameWon && "You Won!"}
            {!gameOver && !gameWon && "Minesweeper"}
          </span>
        </div>
        <div
          className="bg-black text-red-500 px-1.5 py-0.5 font-mono text-base leading-none border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white shrink-0 tabular-nums"
          style={{ minWidth: 42 }}
        >
          {String(Math.min(time, 999)).padStart(3, "0")}
        </div>
      </div>

      <div className="p-1 flex justify-center shrink-0">
        <div
          className="inline-block border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-0.5 bg-[#c0c0c0]"
          style={{
            width: COLS * CELL_PX + 4,
            height: ROWS * CELL_PX + 4,
          }}
        >
          {grid.map((row, i) => (
            <div key={i} className="flex" style={{ height: CELL_PX }}>
              {row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  type="button"
                  onClick={() => revealCell(i, j)}
                  onContextMenu={(e) => toggleFlag(e, i, j)}
                  className={`minesweeper-cell flex items-center justify-center font-bold p-0
                    ${
                      !cell.isRevealed
                        ? "border border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] hover:bg-[#d0d0d0]"
                        : "border border-[#bdbdbd] bg-[#e6e6e6]"
                    }
                    ${cell.neighborMines === 1 && cell.isRevealed ? "text-blue-700" : ""}
                    ${cell.neighborMines === 2 && cell.isRevealed ? "text-green-700" : ""}
                    ${cell.neighborMines === 3 && cell.isRevealed ? "text-red-700" : ""}
                    ${cell.neighborMines === 4 && cell.isRevealed ? "text-purple-800" : ""}
                    ${cell.neighborMines === 5 && cell.isRevealed ? "text-red-800" : ""}
                    ${cell.neighborMines >= 6 && cell.isRevealed ? "text-teal-800" : ""}`}
                >
                  {getCellContent(cell)}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!mounted) {
    return (
      <Window
        className={`${show ? "flex" : "hidden"}`}
        title="Minesweeper"
        icon="/minesweeper.png"
        width={WINDOW_WIDTH}
        setActiveWindows={setActiveWindows}
        pos={windowConfig?.defaultPosition || { x: 300, y: 300 }}
        windowOrder={windowOrder}
        bringToFront={bringToFront}
        bodyClassName={minesBodyClass}
      >
        <div className="flex items-center justify-center text-[11px] p-2">Loading...</div>
      </Window>
    );
  }

  return (
    <Window
      className={`${show ? "flex" : "hidden"} !w-auto`}
      title="Minesweeper"
      icon="/minesweeper.png"
      width={WINDOW_WIDTH}
      setActiveWindows={setActiveWindows}
      pos={windowConfig?.defaultPosition || { x: 300, y: 300 }}
      windowOrder={windowOrder}
      bringToFront={bringToFront}
      bodyClassName={minesBodyClass}
    >
      {gameContent}
    </Window>
  );
}
