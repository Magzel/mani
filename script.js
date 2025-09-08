const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player
const player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 50,
    height: 50,
    color: 'blue'
};

// Avoider
const avoider = {
    x: Math.random() * (canvas.width - 30),
    y: 0,
    width: 30,
    height: 30,
    color: 'red',
    speed: 2
};

// Thrown objects
const thrownObjects = [];
const objectSpeed = 5;

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    clearCanvas();

    // Draw player
    drawRect(player.x, player.y, player.width, player.height, player.color);

    // Draw and move avoider
    avoider.y += avoider.speed;
    if (avoider.y > canvas.height) {
        avoider.y = 0;
        avoider.x = Math.random() * (canvas.width - 30);
    }
    drawRect(avoider.x, avoider.y, avoider.width, avoider.height, avoider.color);

    // Draw and move thrown objects
    for (let i = 0; i < thrownObjects.length; i++) {
        const obj = thrownObjects[i];
        obj.y -= objectSpeed;
        drawRect(obj.x, obj.y, obj.width, obj.height, obj.color);

        // Collision detection
        if (
            obj.x < avoider.x + avoider.width &&
            obj.x + obj.width > avoider.x &&
            obj.y < avoider.y + avoider.height &&
            obj.y + obj.height > avoider.y
        ) {
            alert('You hit the avoider!');
            // Reset avoider
            avoider.y = 0;
            avoider.x = Math.random() * (canvas.width - 30);
        }

        // Remove objects that are off-screen
        if (obj.y < 0) {
            thrownObjects.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(update);
}

// Handle player input
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') { // Spacebar to throw
        thrownObjects.push({
            x: player.x + player.width / 2 - 5,
            y: player.y,
            width: 10,
            height: 10,
            color: 'green'
        });
    } else if (e.key === 'ArrowLeft') {
        player.x -= 10;
    } else if (e.key === 'ArrowRight') {
        player.x += 10;
    }
});

update();
