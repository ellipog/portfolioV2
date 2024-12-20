import { useState, useEffect, Dispatch, SetStateAction } from "react";
import Window from "components/Window";

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

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
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [time, setTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const rows = 9;
  const cols = 9;
  const mines = 10;

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
    return Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
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

    // Create a safe zone around the first click
    const safeZone = [];
    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        const ni = firstRow + di;
        const nj = firstCol + dj;
        if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
          safeZone.push(`${ni}-${nj}`);
        }
      }
    }

    // Place mines avoiding safe zone
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (!newGrid[row][col].isMine && !safeZone.includes(`${row}-${col}`)) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!newGrid[i][j].isMine) {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di;
              const nj = j + dj;
              if (
                ni >= 0 &&
                ni < rows &&
                nj >= 0 &&
                nj < cols &&
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
      // Reveal the clicked cell immediately
      const updatedGrid = [...newGrid];
      floodFill(updatedGrid, row, col);
      setGrid(updatedGrid);
      checkWinCondition();
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
    checkWinCondition();
  };

  const floodFill = (grid: Cell[][], row: number, col: number) => {
    if (
      row < 0 ||
      row >= rows ||
      col < 0 ||
      col >= cols ||
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

  const checkWinCondition = () => {
    const won = grid.every((row) =>
      row.every(
        (cell) =>
          (cell.isMine && !cell.isRevealed) || (!cell.isMine && cell.isRevealed)
      )
    );
    if (won) setGameWon(true);
  };

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) return "🚩";
    if (!cell.isRevealed) return "";
    if (cell.isMine) return "💣";
    return cell.neighborMines || "";
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

  if (!mounted) {
    return (
      <Window
        className={`${show ? "flex" : "hidden"}`}
        title="Minesweeper"
        icon="/minesweeper.png"
        width={340}
        setActiveWindows={setActiveWindows}
        pos={{ x: 1200, y: 200 }}
        windowOrder={windowOrder}
        bringToFront={bringToFront}
      >
        <div className="w-full h-full flex items-center justify-center bg-[#c0c0c0] text-black">
          Loading...
        </div>
      </Window>
    );
  }

  return (
    <Window
      className={`${show ? "flex" : "hidden"}`}
      title="Minesweeper"
      icon="/minesweeper.png"
      width={340}
      setActiveWindows={setActiveWindows}
      pos={{ x: 1200, y: 200 }}
      windowOrder={windowOrder}
      bringToFront={bringToFront}
    >
      <div className="w-full h-full flex flex-col bg-[#c0c0c0] text-black">
        <div className="p-2 w-full flex justify-between items-center border-b-2 border-[#808080]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                initializeGrid();
              }}
              className="px-3 py-1 bg-[#e6e6e6] hover:bg-[#f3f3f3] border border-[#808080] active:border-[#404040] text-sm cursor-pointer shadow-[1px_1px_0px_0px_rgba(255,255,255,0.5)_inset,-1px_-1px_0px_0px_rgba(0,0,0,0.25)_inset]"
            >
              New Game
            </button>
            <div className="text-sm font-bold">
              {gameOver && "Game Over!"}
              {gameWon && "You Won!"}
            </div>
          </div>
          <div className="bg-black text-red-500 px-2 py-1 font-digital text-xl border-2 border-[#808080]">
            {String(time).padStart(3, "0")}
          </div>
        </div>
        <div className="flex-1 p-4 flex items-center justify-center bg-[#c0c0c0]">
          <div className="inline-block border-t-2 border-l-2 border-[#ffffff] border-r-2 border-r-[#808080] border-b-2 border-b-[#808080] p-1 bg-[#c0c0c0]">
            {grid.map((row, i) => (
              <div key={i} className="flex">
                {row.map((cell, j) => (
                  <button
                    key={`${i}-${j}`}
                    onClick={() => revealCell(i, j)}
                    onContextMenu={(e) => toggleFlag(e, i, j)}
                    className={`w-7 h-7 flex items-center justify-center text-sm font-bold
                      ${
                        !cell.isRevealed
                          ? "border-t-2 border-l-2 border-[#ffffff] border-r-2 border-r-[#808080] border-b-2 border-b-[#808080] bg-[#c0c0c0] hover:bg-[#d0d0d0]"
                          : "border border-[#808080] bg-[#e6e6e6]"
                      } 
                      ${cell.neighborMines === 1 ? "text-blue-700" : ""}
                      ${cell.neighborMines === 2 ? "text-green-700" : ""}
                      ${cell.neighborMines === 3 ? "text-red-700" : ""}
                      ${cell.neighborMines === 4 ? "text-purple-800" : ""}
                      ${cell.neighborMines === 5 ? "text-red-800" : ""}
                      ${cell.neighborMines >= 6 ? "text-teal-800" : ""}`}
                  >
                    {getCellContent(cell)}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
}
