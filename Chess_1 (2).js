document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "http://localhost:3000/chessboard"; // JSON API
  const chessboard = document.getElementById("chessboard");
  const title1 = document.querySelector("h1");
  title1.textContent = "Chess-Code-Challenge!!";

  let selectedPiece = null; // To track the selected piece
  let piecePositions = []; // To store the current board state

  fetch(BASE_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      piecePositions = data; // Store the initial board state
      renderBoard();
    });

  // Helper function to render the board
  function renderBoard() {
    chessboard.innerHTML = ""; // Clear the existing tiles

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");

        // Alternate tile colors
        if ((row + col) % 2 === 0) {
          tile.style.backgroundColor = "white";
        } else {
          tile.style.backgroundColor = "black";
        }

        // Find the piece for the current position
        const position = `${String.fromCharCode(97 + col)}${8 - row}`;
        const pieceData = piecePositions.find(
          (piece) => piece.position === position
        );

        // If a piece exists, add its symbol
        if (pieceData) {
          tile.textContent = getPieceSymbol(pieceData.piece, pieceData.colour);
          tile.classList.add("piece");
          tile.dataset.position = position;
        }

        // Handle tile clicks
        tile.addEventListener("click", () => handleTileClick(tile, position));

        chessboard.appendChild(tile);
      }
    }
  }

  // Handle tile clicks
  function handleTileClick(tile, position) {
    // If a piece is selected, attempt to move it
    if (selectedPiece) {
      if (tile.classList.contains("highlight")) {
        movePiece(selectedPiece, position);
        selectedPiece = null;
      } else {
        selectedPiece = null;
        renderBoard(); // Reset the board
      }
    } else {
      // Select the piece on the clicked tile
      const pieceData = piecePositions.find(
        (piece) => piece.position === position
      );
      if (pieceData) {
        selectedPiece = pieceData;
        highlightMoves(pieceData);
      }
    }
  }

  // Highlight possible moves for a piece
  function highlightMoves(pieceData) {
    const possibleMoves = getPossibleMoves(pieceData); // Implement this logic based on chess rules
    renderBoard(); // Reset the board
    possibleMoves.forEach((move) => {
      const tile = Array.from(chessboard.children).find(
        (t) => t.dataset.position === move
      );
      if (tile) tile.classList.add("highlight");
    });
  }

  // Move the piece to a new position
  function movePiece(pieceData, newPosition) {
    pieceData.position = newPosition;
    renderBoard();
  }

  // Dummy function to get possible moves (replace with chess logic)
  function getPossibleMoves(pieceData) {
    // Example: For now, allow moving one step in any direction
    const [file, rank] = pieceData.position.split("");
    const fileCode = file.charCodeAt(0);
    const rankNum = parseInt(rank, 10);

    return [
      `${String.fromCharCode(fileCode - 1)}${rankNum}`, // Left
      `${String.fromCharCode(fileCode + 1)}${rankNum}`, // Right
      `${file}${rankNum - 1}`, // Down
      `${file}${rankNum + 1}`, // Up
    ].filter((pos) => /^[a-h][1-8]$/.test(pos)); // Ensure positions are valid
  }

  // Helper function to get the Unicode symbol for a chess piece
  const pieceSymbols = require("./db.json");
  function getPieceSymbol(piece, colour) {
    if (pieceSymbols[piece] && pieceSymbols[piece][colour]) {
      return pieceSymbols[piece][colour];
    } else {
      return "";
    }
  }
});
