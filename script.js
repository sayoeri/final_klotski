let boardEl = document.getElementById("board");
let movesEl = document.getElementById("moves");
let timerEl = document.getElementById("timer");
let sizeSelect = document.getElementById("size");

let board = [], size = 4, emptyIndex = 0;
let moves = 0, timer = 0, timerInterval = null;

function startGame() {
  clearInterval(timerInterval);
  timer = 0;
  moves = 0;
  timerEl.textContent = "00:00";
  movesEl.textContent = "0";

  size = parseInt(sizeSelect.value);
  board = [...Array(size * size).keys()];
  shuffleBoard();
  renderBoard();

  timerInterval = setInterval(() => {
    timer++;
    let min = String(Math.floor(timer / 60)).padStart(2, '0');
    let sec = String(timer % 60).padStart(2, '0');
    timerEl.textContent = `${min}:${sec}`;
  }, 1000);
}

function shuffleBoard() {
  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }
  emptyIndex = board.indexOf(0);
}

function renderBoard() {
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.forEach((num, i) => {
    const tile = document.createElement("div");
    tile.className = "tile" + (num === 0 ? " empty" : "");
    tile.textContent = num !== 0 ? num : "";
    tile.style.fontSize = `${Math.max(12, 32 - size)}px`;
    tile.addEventListener("click", () => moveTile(i));
    boardEl.appendChild(tile);
  });
}

function moveTile(i) {
  const targetRow = Math.floor(i / size);
  const targetCol = i % size;
  const emptyRow = Math.floor(emptyIndex / size);
  const emptyCol = emptyIndex % size;

  const distance = Math.abs(targetRow - emptyRow) + Math.abs(targetCol - emptyCol);
  if (distance === 1) {
    [board[i], board[emptyIndex]] = [board[emptyIndex], board[i]];
    emptyIndex = i;
    moves++;
    movesEl.textContent = moves;
    animateMove(i);
    renderBoard();
    if (checkWin()) endGame();
  }
}

function animateMove(i) {
  const tiles = boardEl.children;
  if (tiles[i]) {
    tiles[i].style.transform = "scale(1.05)";
    setTimeout(() => {
      tiles[i].style.transform = "scale(1)";
    }, 150);
  }
}

function checkWin() {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[board.length - 1] === 0;
}

function endGame() {
  clearInterval(timerInterval);
  setTimeout(() => {
    alert(`🎉 恭喜通关！用时 ${timerEl.textContent}，步数 ${moves}`);
  }, 300);
}

startGame();
