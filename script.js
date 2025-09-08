const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Image loading
const charactersImg = new Image();
charactersImg.src = 'images/characters.png';

// Player
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 70,
    width: 45,
    height: 45,
    speed: 10
};

// Catcher
const catcher = {
    x: canvas.width / 2 - 25,
    y: 10,
    width: 45,
    height: 45,
    speed: 3,
    direction: 1 // 1 for right, -1 for left
};

// Thrown objects
const thrownObjects = [];
const objectSpeed = 7;

// Score
let score = 0;

// Sprite sheet coordinates (estimated)
const idleSprite = { x: 200, y: 100, width: 45, height: 45 };


function drawPlayer() {
    ctx.drawImage(charactersImg, idleSprite.x, idleSprite.y, idleSprite.width, idleSprite.height, player.x, player.y, player.width, player.height);
}

function drawCatcher() {
    // Apply a filter to make the catcher look different
    ctx.filter = 'hue-rotate(180deg)';
    ctx.drawImage(charactersImg, idleSprite.x, idleSprite.y, idleSprite.width, idleSprite.height, catcher.x, catcher.y, catcher.width, catcher.height);
    ctx.filter = 'none';
}

function drawThrownObjects() {
    for (const obj of thrownObjects) {
        // A simple shuriken shape
        ctx.fillStyle = 'black';
        ctx.save();
        ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
        ctx.rotate(obj.angle * Math.PI / 180);
        ctx.fillRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
        ctx.fillRect(-obj.height / 2, -obj.width / 2, obj.height, obj.width);
        ctx.restore();
        obj.angle += 10;
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    clearCanvas();
    drawScore();
    drawPlayer();
    drawCatcher();
    drawThrownObjects();

    // Move catcher
    catcher.x += catcher.speed * catcher.direction;
    if (catcher.x + catcher.width > canvas.width || catcher.x < 0) {
        catcher.direction *= -1;
    }

    // Move thrown objects and check for collision
    for (let i = 0; i < thrownObjects.length; i++) {
        const obj = thrownObjects[i];
        obj.y -= objectSpeed;

        // Collision detection
        if (
            obj.x < catcher.x + catcher.width &&
            obj.x + obj.width > catcher.x &&
            obj.y < catcher.y + catcher.height &&
            obj.y + obj.height > catcher.y
        ) {
            score++;
            thrownObjects.splice(i, 1);
            i--;
        }

        // Remove objects that are off-screen
        if (obj.y + obj.height < 0) {
            thrownObjects.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(update);
}

// Handle player input
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        player.x -= player.speed;
    } else if (e.key === 'ArrowRight') {
        player.x += player.speed;
    } else if (e.key === ' ') { // Spacebar to throw
        thrownObjects.push({
            x: player.x + player.width / 2 - 10,
            y: player.y,
            width: 20,
            height: 20,
            angle: 0
        });
    }

    // Keep player within canvas bounds
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
});

charactersImg.onload = update;
