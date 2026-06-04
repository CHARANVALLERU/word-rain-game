const words = ['code', 'javascript', 'rain', 'keyboard', 'html', 'css', 'fun', 'game', 'logic', 'score'];
const gameArea = document.getElementById('game-area');
const input = document.getElementById('word-input');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const highScoreEl = document.getElementById('high-score');
const finalScoreEl = document.getElementById('final-score');
const finalHighScoreEl = document.getElementById('final-high-score');

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-container');
const gameOverScreen = document.getElementById('game-over-screen');
const difficultySelect = document.getElementById('difficulty');

let score = 0;
let lives = 3;
let interval;
let activeWords = [];
let fallInterval = 1500;

function updateStats() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;

  const high = localStorage.getItem('wordRainHighScore') || 0;
  if (score > high) {
    localStorage.setItem('wordRainHighScore', score);
    highScoreEl.textContent = score;
  }
}

function createWord() {
  const word = words[Math.floor(Math.random() * words.length)];
  const span = document.createElement('span');
  span.classList.add('word');
  span.textContent = word;
  span.style.left = Math.random() * 80 + '%';
  gameArea.appendChild(span);

  const timeout = setTimeout(() => {
    if (gameArea.contains(span)) {
      gameArea.removeChild(span);
      lives--;
      updateStats();
      checkGameOver();
    }
  }, 5000);

  activeWords.push({ word, element: span, timeout });
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const typed = input.value.trim();
    const matchIndex = activeWords.findIndex(w => w.word === typed);

    if (matchIndex !== -1) {
      const matched = activeWords[matchIndex];
      clearTimeout(matched.timeout);
      gameArea.removeChild(matched.element);
      activeWords.splice(matchIndex, 1);
      score++;
      updateStats();
    }

    input.value = '';
  }
});

function checkGameOver() {
  if (lives <= 0) {
    clearInterval(interval);
    activeWords.forEach(w => {
      clearTimeout(w.timeout);
      if (gameArea.contains(w.element)) {
        gameArea.removeChild(w.element);
      }
    });
    activeWords = [];
    showGameOverScreen();
  }
}

function startGame() {
  score = 0;
  lives = 3;
  fallInterval = parseInt(difficultySelect.value);

  startScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  gameOverScreen.classList.add('hidden');

  highScoreEl.textContent = localStorage.getItem('wordRainHighScore') || 0;
  updateStats();
  input.value = '';
  input.focus();

  interval = setInterval(createWord, fallInterval);
}

function showGameOverScreen() {
  finalScoreEl.textContent = score;
  finalHighScoreEl.textContent = localStorage.getItem('wordRainHighScore') || score;
  gameScreen.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
}

function restartGame() {
  startScreen.classList.remove('hidden');
  gameOverScreen.classList.add('hidden');
  gameArea.innerHTML = '';
}
