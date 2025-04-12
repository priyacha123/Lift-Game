// Game State Variables
let currentFloor = 1;
let targetFloor;
let lives = 3;
let score = 0;
let characterLeft = 10;
let timer = null;
let isGameOver = false;
let timerDuration = 3000;

// DOM Elements
const character = document.getElementById("character");
const lift = document.getElementById("lift");
const stats = document.getElementById("stats");
const progress = document.getElementById("progress");

const jumpSound = document.getElementById("jumpSound");
const warnSound = document.getElementById("warnSound");
const loseSound = document.getElementById("loseSound");

// Helper Functions
function updateStats() {
  stats.innerText = `❤️ Lives: ${lives} | ⭐ Score: ${score}`;
}

function playSound(audio) {
  audio.currentTime = 0;
  audio.play();
}

function moveLiftToFloor(floor) {
  if (isGameOver) return;
  playSound(jumpSound);
  const liftHeight = (floor - 1) * 125;
  lift.style.bottom = `${liftHeight}px`;
  currentFloor = floor;
  checkCollision();
  checkTarget();
}

// Movement Functions
function moveUp() {
  if (currentFloor < 4) moveLiftToFloor(currentFloor + 1);
}

function moveDown() {
  if (currentFloor > 1) moveLiftToFloor(currentFloor - 1);
}

function moveLeft() {
  if (characterLeft > 10) {
    characterLeft -= 20;
    character.style.transform = `translateX(${characterLeft}px)`;
    checkSafeFromEnemy();
  }
}

function moveRight() {
  if (characterLeft < 180) {
    characterLeft += 20;
    character.style.transform = `translateX(${characterLeft}px)`;
    checkSafeFromEnemy();
  }
}

// Utility Functions
function getRandomFloor(exclude) {
  let f;
  do {
    f = Math.floor(Math.random() * 4) + 1;
  } while (f === exclude);
  return f;
}

function highlightTargetFloor() {
  for (let i = 1; i <= 4; i++) {
    const floor = document.getElementById(`floor-${i}`);
    floor.style.background = "white";
    floor.innerHTML = `<span class="label">Floor ${i}</span>`;
  }

  targetFloor = getRandomFloor(currentFloor);
  const target = document.getElementById(`floor-${targetFloor}`);
  target.style.background = "#ffff9f";

  for (let i = 1; i <= 4; i++) {
    if (i !== targetFloor) {
      const floor = document.getElementById(`floor-${i}`);
      const enemy = document.createElement("div");
      enemy.className = "enemy";
      enemy.innerText = "👹";
      floor.appendChild(enemy);
    }
  }

  document.getElementById("status").innerText = `🎯 Reach Floor ${targetFloor}`;
}

// Collision Detection
function checkCollision() {
  const floor = document.getElementById(`floor-${currentFloor}`);
  const hasEnemy = floor.querySelector(".enemy");

  if (hasEnemy && characterLeft >= 100 && characterLeft <= 190) {
    playSound(warnSound);
    document.getElementById("status").innerText = "⚠️ Dodge the enemy!";
    document.body.classList.add("shake");

    let countdown = 100;
    progress.style.width = "100%";

    timer = setInterval(() => {
      countdown -= 2;
      progress.style.width = `${countdown}%`;

      if (countdown <= 0) {
        clearInterval(timer);
        loseLife();
      }
    }, timerDuration / 50);

    setTimeout(() => {
      document.body.classList.remove("shake");
    }, 300);
  } else {
    clearInterval(timer);
    progress.style.width = "0%";
  }
}

function checkSafeFromEnemy() {
  const floor = document.getElementById(`floor-${currentFloor}`);
  const hasEnemy = floor.querySelector(".enemy");

  if (hasEnemy && (characterLeft < 100 || characterLeft > 190)) {
    clearInterval(timer);
    progress.style.width = "0%";
    document.getElementById("status").innerText = "✅ Dodged!";
  }
}

function checkTarget() {
  if (currentFloor === targetFloor) {
    score++;
    timerDuration *= 0.9;
    updateStats();
    clearInterval(timer);
    progress.style.width = "0%";

    document.getElementById("status").innerText = "🎉 Reached!";
    setTimeout(() => {
      characterLeft = 10;
      character.style.transform = `translateX(${characterLeft}px)`;
      highlightTargetFloor();
    }, 1000);
  }
}

// Game Over Logic
function loseLife() {
  lives--;
  updateStats();
  playSound(loseSound);
  if (lives <= 0) {
    gameOver();
  } else {
    document.getElementById("status").innerText = "💀 Life lost!";
    setTimeout(() => highlightTargetFloor(), 1000);
  }
}

function gameOver() {
  isGameOver = true;
  document.getElementById("status").innerText = "☠️ Game Over!";
  document.getElementById("restartBtn").style.display = "inline-block";
}

function restartGame() {
  lives = 3;
  score = 0;
  characterLeft = 10;
  isGameOver = false;
  timerDuration = 3000;
  lift.style.bottom = "0px";
  character.style.transform = `translateX(${characterLeft}px)`;
  updateStats();
  document.getElementById("restartBtn").style.display = "none";
  highlightTargetFloor();
}

// Initialize Game
updateStats();
highlightTargetFloor();