// Enemies our player must avoid
var Enemy = function(y = 150, speed = 400) {
    this.x = -200;
    this.y = y;
    this.speed = speed;
    this.road = [50, 150, 220];
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if(this.x < 900)
        this.x += this.speed * dt;
    else {
        this.y = this.road[Math.floor(Math.random() * this.road.length)];
        this.speed = Math.floor(Math.random() * (50 - 600)) + 600;
        this.x = -200;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = 200;
    this.y = 400;
    this.road = [50, 150, 220, 300, 400];
    this.allowMove = true;
    this.score = 0;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dt) {
    this.handleCollision();
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleCollision = function(key) {
    for(enemy of allEnemies){
        if(enemy.y === this.y && (this.x >= enemy.x - 50 && this.x <= enemy.x + 50)){
            this.resetPosition();
        }
    }
    if(collectible.y === this.y && collectible.x === this.x){
        if(collectible.allowCollect){
            collectible.allowCollect = false;
            this.score += collectible.value;
            document.getElementById("score").innerText = this.score;
            if(bestScore < this.score)
                bestScore = this.score;
            createCollectible(1000);
        }
    }
}

Player.prototype.resetPosition = function(key) {
    this.x = 200;
    this.y = 400;
}

Player.prototype.handleInput = function(key) {
    if(this.allowMove){
        if(key === 'left' && this.x > 0){
            this.x -= 100;
        } else if(key === 'right' && this.x < 400){
            this.x += 100;
        } else if(key === 'up' && this.y > this.road[0]){
            let index = 1;
            let found = false;
            while(index < this.road.length && !found){
                if(this.y === this.road[index]){
                    this.y = this.road[index-1];
                    found = true;
                }
                index++;
            }
        } else if(key === 'down' && this.y < 400){
            let index = 0;
            let found = false;
            while(index < this.road.length && !found){
                if(this.y === this.road[index]){
                    this.y = this.road[index+1];
                    found = true;
                }
                index++;
            }
        } else if(key === 'up' && this.y === this.road[0]){
            this.resetPosition();
            this.allowMove = false;
            document.getElementById("victory-modal").style.display = "block";
        }
    }
};

// Enemies our player must avoid
var Collectible = function(x = 300, y = 220) {
    this.x = x;
    this.y = y;
    this.value = 10;
    this.allowCollect = true;
    this.sprite = 'images/Star.png';
};

// Draw the enemy on the screen, required method for game
Collectible.prototype.render = function() {
    if(this.allowCollect)
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

document.getElementById("play-again").addEventListener('click', function(e){
    player.allowMove = true;
    createEnemies();
    document.getElementById("victory-modal").style.display = "none";
});

function createEnemies(){
    allEnemies = [new Enemy(50, Math.floor(Math.random() * (50 - 600)) + 600),
                  new Enemy(150, Math.floor(Math.random() * (50 - 600)) + 600),
                  new Enemy(220, Math.floor(Math.random() * (50 - 600)) + 600),
                  new Enemy(50, Math.floor(Math.random() * (50 - 600)) + 600),
                  new Enemy(150, Math.floor(Math.random() * (50 - 600)) + 600)];
}

function createCollectible(delay = 0){
    setTimeout(function(){
        let roadY = [50, 150, 220];
        let roadX = [0, 100, 200, 300, 400];
        collectible = new Collectible(roadX[Math.floor(Math.random() * roadX.length)], roadY[Math.floor(Math.random() * roadY.length)]);
        collectible.allowCollect = true;
    }, delay);
}

let bestScore = 0;
let allEnemies = [];
let collectible;
let player = new Player();

createCollectible();
createEnemies();