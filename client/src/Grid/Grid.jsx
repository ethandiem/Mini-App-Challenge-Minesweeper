import "./Grid.css";
import { useState, useEffect } from "react";

function Grid() {
    const rows = 10;
    const columns = 10;
    const minesCount = 10;
    const [clickedCells, setClickedCells] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [youWin, setYouWin] = useState(false);
    const [mines, setMines] = useState([]);

    const createGameBoard = () => {
        const gameBoard = [];
        for (let row = 0; row < rows; row++) {
            const currentRow = [];
            for (let col = 0; col < columns; col++) {
                currentRow.push({ row, col, isMine: false, isRevealed: false });
            }
            gameBoard.push(currentRow);
        }
        return gameBoard;
    };


    const [gameBoard, setGameBoard] = useState(createGameBoard());

    const handleCellClick = (row, col) => {
      if (gameBoard[row][col].isMine) {
        setGameOver(true);
      }
      setClickedCells((prevClickedCells) => {
        const updatedClickedCells = [...prevClickedCells, { row, col }]

      if (updatedClickedCells.length === rows * columns - minesCount) {
        setYouWin(true);
    }

    return updatedClickedCells;
});
    }

    useEffect(() => {
      if (gameOver || youWin) {
        handleGameOver();
      }
    }, [gameOver || youWin]);

    const handleGameOver = () => {
      const updatedGameBoard = gameBoard.map((row) =>
        row.map((cell) => {
            if (cell.isMine) {
                return { ...cell, isRevealed: true };
            }
            return cell;
        })
    );
    setGameBoard(updatedGameBoard);
    setTimeout(() => {
        const newGameBoard = createGameBoard();
        setGameBoard(newGameBoard);
        setClickedCells([]); // Clear clicked cells
        setGameOver(false); // Reset game over state
        setYouWin(false); // Reset win state
        setMines([]); // Clear mines

        setGameBoard((prevBoard) => {
          const minePositions = new Set();
          while (minePositions.size < minesCount) {
              const randomRow = Math.floor(Math.random() * rows);
              const randomCol = Math.floor(Math.random() * columns);
              minePositions.add(`${randomRow},${randomCol}`);
          }
          return prevBoard.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                  if (minePositions.has(`${rowIndex},${colIndex}`)) {
                      return { ...cell, isMine: true };
                  }
                  return cell;
              })
          );
      });

    }, 1500);
}

    const randomizeMines = () => {
      const minePositions = new Set();
      while (minePositions.size < minesCount) {
        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * columns);
        minePositions.add(`${randomRow},${randomCol}`);
      }
      const updatedGameBoard = gameBoard.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (minePositions.has(`${rowIndex},${colIndex}`)) {
            // If the cell is in the mine positions, set it as a mine
            return { ...cell, isMine: true };
          }
          return cell; // Otherwise, return the cell as is
        })
      );
      setGameBoard(updatedGameBoard);
    }

    useEffect(() => {
      randomizeMines();
    }, []);

    const countNeighboringMines = (row, col) => {
      let mineCount = 0;

      for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;

              if (
                  newRow >= 0 &&
                  newRow < rows &&
                  newCol >= 0 &&
                  newCol < columns &&
                  gameBoard[newRow][newCol].isMine
              ) {
                  mineCount++;
              }
          }
      }

      return mineCount;
  };

    return (
<>
  <div className="grid-container">
      <div className="grid">
          {gameBoard.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                  {row.map((cell, colIndex) => (
                    <div key = {colIndex} className = "cell" onClick = {() => handleCellClick(rowIndex, colIndex)}>
                      {clickedCells.some(
                        (clicked) =>
                          clicked.row === rowIndex && clicked.col === colIndex
                      ) && (cell.isMine ? "💣": countNeighboringMines(rowIndex, colIndex || ""))}

                      </div>
                      ))}
                    </div>
                  ))}
          </div>
                  {gameOver && <h1 className = "boom">💣💣💣💣BOOM💣💣💣💣</h1>}
                  {youWin && <h1 className = "win">💥💥💥YOU WIN💥💥💥</h1>}
      </div>
</>
    );
}

export default Grid;