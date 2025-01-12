document.addEventListener("DOMContentLoaded", () => {
  const player = document.getElementById("cat-player");
  const gameContainer = document.getElementById("game-container");
  const startButton = document.getElementById("start-button");
  const stopButton = document.getElementById("stop-button");

  let isJumping = false;
  let obstacles = [];
  let gameInterval;
  let isGameRunning = false;

  function createObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = "100%"; 
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);

   
    let obstaclePosition = gameContainer.clientWidth;
    const moveInterval = setInterval(() => {
      if (!isGameRunning) {
        clearInterval(moveInterval);
        obstacle.remove();
        return;
      }

      obstaclePosition -= 5; 
      obstacle.style.left = `${obstaclePosition}px`;

      const playerRect = player.getBoundingClientRect();
      const obstacleRect = obstacle.getBoundingClientRect();

      if (
        playerRect.right > obstacleRect.left &&
        playerRect.left < obstacleRect.right &&
        playerRect.bottom > obstacleRect.top &&
        playerRect.top < obstacleRect.bottom
      ) {
        endGame();
        clearInterval(moveInterval);
      }

     
      if (obstaclePosition < -40) {
        obstacle.remove();
        obstacles.shift(); 
        clearInterval(moveInterval);
      }
    }, 20);
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
    obstacles = []; 
    gameInterval = setInterval(() => {
      createObstacle();
    }, 2000);

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && isGameRunning) jump();
    });
  }

  function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    alert("Game Over! You hit an obstacle.");
    resetGame();
  }

  function resetGame() {
    obstacles.forEach((obs) => obs.remove());
    obstacles = [];
    player.style.bottom = "20px"; 
  }

  function stopGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    resetGame(); 
  }

  startButton.addEventListener("click", () => {
    startGame();
  });

  stopButton.addEventListener("click", () => {
    stopGame();
  });
});
