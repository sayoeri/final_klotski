const board = document.getElementById("board");
const sizeSelector = document.getElementById("size");
const startButton = document.getElementById("start");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");

let tiles = [];
let emptyTile = null;
let size = 8;
let moveCount = 0;
let timer = null;
let secondsElapsed = 0;

function updateStats() {
  movesDisplay.textContent = moveCount;
  const mins = Math.floor(secondsElapsed / 60);
  const secs = secondsElapsed % 60;
  timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
}

function startTimer() {
  clearInterval(timer);
  secondsElapsed = 0;
  timer = setInterval(() => {
    secondsElapsed++;
    updateStats();
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function createTiles() {
  board.innerHTML = "";
  tiles = [];
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  let nums = [...Array(size * size).keys()];
  nums = shuffle(nums);

  for (let i = 0; i < size * size; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    if (nums[i] === 0) {
      tile.classList.add("empty");
      emptyTile = { index: i };
    } else {
      tile.textContent = nums[i];
    }

    tile.style.height = tile.style.width = `${Math.max(30, 480 / size)}px`;
    tile.addEventListener("click", () => moveTile(i));
    board.appendChild(tile);
    tiles.push(tile);
  }
}

function shuffle(array) {
  // Fisher-Yates Shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function moveTile(index) {
  const dx = Math.abs((index % size) - (emptyTile.index % size));
  const dy = Math.abs(Math.floor(index / size) - Math.floor(emptyTile.index / size));
  if (dx + dy === 1) {
    [tiles[index].textContent, tiles[emptyTile.index].textContent] = [tiles[emptyTile.index].textContent, tiles[index].textContent];
    tiles[index].classList.add("empty");
    tiles[emptyTile.index].classList.remove("empty");

    [tiles[index], tiles[emptyTile.index]] = [tiles[emptyTile.index], tiles[index]];
    emptyTile.index = index;

    moveCount++;
    updateStats();
    checkWin();
  }
}

function checkWin() {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i].textContent != i + 1) return;
  }
  if (!tiles[tiles.length - 1].classList.contains("empty")) return;

  stopTimer();
  setTimeout(() => {
    alert(`🎉 恭喜通关！共 ${moveCount} 步，用时 ${Math.floor(secondsElapsed / 60)} 分 ${secondsElapsed % 60} 秒`);
  }, 100);
}

startButton.addEventListener("click", () => {
  size = parseInt(sizeSelector.value, 10);
  moveCount = 0;
  updateStats();
  createTiles();
  startTimer();
});
