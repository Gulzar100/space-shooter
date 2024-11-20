const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    speed: 7,
    dx: 0
};

let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

// Event listener for player movement
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") {
        player.dx = -player.speed;
    } else if (e.key === "ArrowRight" || e.key === "d") {
        player.dx = player.speed;
    }
    if (e.key === " " || e.key === "Enter") {
        shootBullet();
    }
});

document.addEventListener("keyup", () => {
    player.dx = 0;
});

// Create bullet
function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20,
        speed: 6
    });
}

// Create enemies
function createEnemies() {
    if (Math.random() < 0.02) {
        enemies.push({
            x: Math.random() * (canvas.width - 50),
            y: -50,
            width: 50,
            height: 50,
            speed: 3
        });
    }
}

// Update player position
function updatePlayer() {
    player.x += player.dx;

    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Update bullets
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        ctx.fillStyle = "yellow";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Remove bullet if off-screen
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

// Update enemies
function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        ctx.fillStyle = "red";
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Check collision with bullets
        bullets.forEach((bullet, bIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                score += 10;
                enemies.splice(index, 1);
                bullets.splice(bIndex, 1);
            }
        });

        // Game over if enemy reaches the player
        if (enemy.y + enemy.height > player.y) {
            gameOver = true;
            alert("Game Over! Final Score: " + score);
        }
    });
}

// Draw score
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 20, 30);
}

// Main game loop
function gameLoop() {
    if (gameOver) return; // Stop the game when it's over

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create enemies
    createEnemies();

    // Update game elements
    updatePlayer();
    updateBullets();
    updateEnemies();
    drawScore();

    // Repeat the game loop
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
