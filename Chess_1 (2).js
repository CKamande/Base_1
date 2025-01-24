document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "http://localhost:3000/chessboard" //JSON API
    const chessboard = document.getElementById("chessboard");
    const title1 = document.querySelector('h1');
    title1.textContent = "Chess-Code-Challenge!!"


fetch('http://localhost:3000/chessboard') // Replace with your JSON file or API endpoint
.then((response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})
.then((data) => {
  // Clear the existing tiles
  chessboard.innerHTML = '';

  // Create an 8x8 grid and place pieces
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');

      // Alternate tile colors
      if ((row + col) % 2 === 0) {
        tile.style.backgroundColor = 'white';
      } else {
        tile.style.backgroundColor = 'black';
      }

      // Find the piece for the current position
      const position = `${String.fromCharCode(97 + col)}${8 - row}`;
      const pieceData = data.find((piece) => piece.position === position);

      // If a piece exists, add its symbol
      if (pieceData) {
        tile.textContent = getPieceSymbol(pieceData.piece, pieceData.colour);
      }

      chessboard.appendChild(tile);
    }
  }
})
.catch((error) => {
  console.error('Error fetching the chess data:', error);
});

// Helper function to get the Unicode symbol for a chess piece
function getPieceSymbol(piece, colour) {
const symbols = {
  king: { white: '♔', black: '♚' },
  queen: { white: '♕', black: '♛' },
  rook: { white: '♖', black: '♜' },
  bishop: { white: '♗', black: '♝' },
  knight: { white: '♘', black: '♞' },
  pawn: { white: '♙', black: '♟' },
};
return symbols[piece]?.[colour] || '';
}
});

