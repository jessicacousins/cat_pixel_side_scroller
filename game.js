document.addEventListener("DOMContentLoaded", () => {
  const player = document.getElementById("cat-player");
  const gameContainer = document.getElementById("game-container");
  const startButton = document.getElementById("start-button");
  const stopButton = document.getElementById("stop-button");
  const livesIndicator = document.getElementById("lives-indicator");

  let isJumping = false;
  let isGameRunning = false;
  let lives = 9;
  let gameObjects = [];


  const gameState = {
    lives: 9,
    maxLives: 9,
    updateLives(change) {
      this.lives += change;
      if (this.lives > this.maxLives) this.lives = this.maxLives;
      if (this.lives <= 0) {
        this.lives = 0;
        endGame();
      }
      livesIndicator.textContent = `Lives: ${this.lives}`;
    },
  };

  // object types
  const objectTypes = {
    OBSTACLE: "obstacle",
    POWER_UP: "power-up",
  };

  function createGameObject(type) {
    const gameObject = document.createElement("div");
    gameObject.classList.add(type);
    gameObject.style.left = "100%";
    gameObject.dataset.type = type;
    gameContainer.appendChild(gameObject);
    gameObjects.push(gameObject);

    let position = gameContainer.clientWidth;
    const moveInterval = setInterval(() => {
      if (!isGameRunning) {
        clearInterval(moveInterval);
        gameObject.remove();
        return;
      }

      position -= 5;
      gameObject.style.left = `${position}px`;

      const playerRect = player.getBoundingClientRect();
      const objectRect = gameObject.getBoundingClientRect();

      // kittie collision detection
      if (
        playerRect.right > objectRect.left &&
        playerRect.left < objectRect.right &&
        playerRect.bottom > objectRect.top &&
        playerRect.top < objectRect.bottom
      ) {
        handleCollision(gameObject);
        clearInterval(moveInterval);
        gameObject.remove();
      }

      if (position < -40) {
        gameObject.remove();
        gameObjects = gameObjects.filter((obj) => obj !== gameObject);
        clearInterval(moveInterval);
      }
    }, 20);
  }

  function handleCollision(gameObject) {
    const type = gameObject.dataset.type;
    if (type === objectTypes.OBSTACLE) {
      gameState.updateLives(-1); // - kittie life
    } else if (type === objectTypes.POWER_UP) {
      gameState.updateLives(1); // + kittie life
    }
  }

  function jump() {
    if (isJumping || !isGameRunning) return;

    isJumping = true;
    let jumpHeight = 0;

    const jumpInterval = setInterval(() => {
      if (jumpHeight >= 100) {
        clearInterval(jumpInterval);
        fall();
      } else {
        jumpHeight += 10;
        player.style.bottom = `${20 + jumpHeight}px`;
      }
    }, 30);
  }

  function fall() {
    const fallInterval = setInterval(() => {
      const currentHeight = parseInt(player.style.bottom);
      if (currentHeight <= 20) {
        clearInterval(fallInterval);
        player.style.bottom = "20px";
        isJumping = false;
      } else {
        player.style.bottom = `${currentHeight - 10}px`;
      }
    }, 30);
  }

  function startGame() {
    if (isGameRunning) return;

    isGameRunning = true;
    gameState.lives = 9; 
    gameObjects = []; 
    livesIndicator.textContent = `Lives: ${gameState.lives}`;

    const gameLoop = setInterval(() => {
      if (!isGameRunning) {
        clearInterval(gameLoop);
        return;
      }
      createGameObject(
        Math.random() < 0.7 ? objectTypes.OBSTACLE : objectTypes.POWER_UP
      );
    }, 1500);

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && isGameRunning) jump();
    });
  }

  function endGame() {
    isGameRunning = false;
    alert("Game Over! You ran out of lives.");
    resetGame();
  }

  function resetGame() {
    gameObjects.forEach((obj) => obj.remove());
    gameObjects = [];
    player.style.bottom = "20px";
  }

  function stopGame() {
    isGameRunning = false;
    resetGame();
  }

  startButton.addEventListener("click", () => {
    startGame();
  });

  stopButton.addEventListener("click", () => {
    stopGame();
  });
});
