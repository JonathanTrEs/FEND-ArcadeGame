// Enemies our player must avoid
var Enemy = function() {
    this.x = -1;
    this.y = 150;
    this.speed = 600;
    this.road = [50, 150, 220];
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    /**if(this.x < 900)
        this.x += this.speed * dt;
    else {
        this.y = this.road[Math.floor(Math.random() * this.road.length)];
        this.speed = Math.floor(Math.random() * (50 - 600)) + 600;
        this.x = -200;
    }*/
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
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dt) {
    console.log("update player");
    this.handleCollision();
};

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleCollision = function(key) {
    for(enemy of allEnemies){
        if(enemy.x === this.x && enemy.y === this.y){
            console.log("collision");
            this.x = 200;
            this.y = 400;
        }
    }
}

Player.prototype.handleInput = function(key) {
    if(key === 'left' && this.x > 0){
        this.x -= 100;
    } else if(key === 'right' && this.x < 400){
        this.x += 100;
    } if(key === 'up' && this.y > 0){
        this.y -= 100;
    } if(key === 'down' && this.y < 400){
        this.y += 100;
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

//let allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];
let allEnemies = [new Enemy()];
let player = new Player();


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
