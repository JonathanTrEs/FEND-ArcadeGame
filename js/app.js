// Global variables
let collectible;
let timer;
let allRocks = [];
let allEnemies = [];
let player;
bestScore = 0;

// Enemies our player must avoid
var Enemy = function(y = 150, speed = 400, spriteArray) {
    this.x = -200;
    this.y = y;
    this.speed = speed;
    this.road = [50, 150, 300, 400];
    this.sprite = spriteArray[0];
    this.spriteArray = spriteArray;
    this.spriteIndex = 0;
    this.updateSprite = true;
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
// Handle the enemy animation
Enemy.prototype.update = function(dt) {
    if (this.x < 900) {
        this.x += this.speed * dt;
        if (this.updateSprite) {
            this.spriteIndex++;
            if (this.spriteIndex >= this.spriteArray.length)
                this.spriteIndex = 0;
            this.sprite = this.spriteArray[this.spriteIndex];
            this.updateSprite = false;
        } else
            this.updateSprite = true;
    } else {
        this.y = this.road[Math.floor(Math.random() * this.road.length)];
        this.speed = Math.floor(Math.random() * (50 - 600)) + 600;
        this.sprite = 'images/ice-golem/ice-golem-00.png';
        this.spriteIndex = 0;
        this.x = -200;
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 150, 150);
};

// The player class
var Player = function(spriteArray) {
    this.x = 200;
    this.y = 500;
    this.score = 0;
    this.allowMove = true;
    this.road = [50, 150, 220, 300, 400, 500];
    this.sprite = spriteArray[0];
    this.spriteArray = spriteArray;
    this.updateSprite = true;
    this.spriteIndex = 0;
    this.heartSprite = "images/heart.svg";
    this.lifes = 3;
};

// Parameter: dt, a time delta between ticks
// Handle the player animation "idle"
Player.prototype.update = function() {
    if (this.updateSprite) {
        this.spriteIndex++;
        if (this.spriteIndex >= this.spriteArray.length)
            this.spriteIndex = 0;
        this.sprite = this.spriteArray[this.spriteIndex];
        this.updateSprite = false;
    } else
        this.updateSprite = true;
    this.handleCollision();
};

// Draw the player on the screen
// Also draw her life, the score and the time
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x - 20, this.y, 150, 150);
    for (let i = 0; i < this.lifes; i++) {
        ctx.drawImage(Resources.get(this.heartSprite), this.x - 5, this.y + (i * 10), 30, 30);
    }
    ctx.font = "20px Pixeled";
    ctx.fillText(this.score, 10, 90);
    ctx.font = "10px Pixeled";
    ctx.fillText("Best " + bestScore, 10, 110);
    ctx.fillText(timer, 430, 80);
};

// Handle the collision between the player and the enemies
// Or between the player and the collectible
Player.prototype.handleCollision = function(key) {
    for (enemy of allEnemies) {
        if (enemy.y === this.y && (this.x >= enemy.x - 50 && this.x <= enemy.x + 50)) {
            this.score = 0;
            this.lifes--;
            this.resetPosition();
        }
    }
    if (collectible != null && collectible.y === this.y && collectible.x === this.x) {
        if (collectible.allowCollect) {
            collectible.allowCollect = false;
            this.score += collectible.value;
            if (bestScore < this.score)
                bestScore = this.score;
            createCollectible(1500);
        }
    }
};


// Reset the player position to the initial
// and check if the player died
Player.prototype.resetPosition = function(key) {
    this.x = 200;
    this.y = 500;
    if (this.lifes <= 0) {
        showFinishModal("You died!");
    }
};

// Check if the position where the player wants to move
// is blocked or not
Player.prototype.positionAvailable = function(nextX, nextY) {
    let available = true;
    for (rock of allRocks) {
        if (rock.x === nextX && rock.y === nextY)
            available = false;
    }
    return available;
};

// Handle the data entry from the user
Player.prototype.handleInput = function(key) {
    if (this.allowMove) {
        let moved = false;
        if (key === 'left' && this.x > 0) {
            let nextX = this.x - 100;
            if (this.positionAvailable(nextX, this.y)) {
                this.x -= 100;
                moved = true;
            }
        } else if (key === 'right' && this.x < 400) {
            let nextX = this.x + 100;
            if (this.positionAvailable(nextX, this.y)) {
                this.x += 100;
                moved = true;
            }
        } else if (key === 'up' && this.y > this.road[0]) {
            let index = 1;
            let found = false;
            while (index < this.road.length && !found) {
                if (this.y === this.road[index]) {
                    let nextY = this.road[index - 1];
                    if (this.positionAvailable(this.x, nextY)) {
                        this.y = this.road[index - 1];
                        moved = true;
                        found = true;
                    }
                }
                index++;
            }
        } else if (key === 'down' && this.y < this.road[this.road.length - 1]) {
            let index = 0;
            let found = false;
            while (index < this.road.length && !found) {
                if (this.y === this.road[index]) {
                    let nextY = this.road[index + 1];
                    if (this.positionAvailable(this.x, nextY)) {
                        this.y = this.road[index + 1];
                        moved = true;
                        found = true;
                    }
                }
                index++;
            }
        } else if (key === 'up' && this.y === this.road[0]) {
            player.resetPosition();
            showFinishModal("Victory!");
        }
        if (moved && this.y <= 400 && this.y != 220) {
            this.score += 1;
            if (bestScore < this.score)
                bestScore = this.score;
        } else if (moved && this.score > 0 && this.y > 400) {
            if (this.score > 1)
                this.score -= 2;
            else
                this.score = 0;
        }
    }
};

// Collectible that our player must get to increase her score
var Collectible = function(x, y) {
    this.x = x;
    this.y = y;
    this.value = 3;
    this.allowCollect = true;
    this.sprite = 'images/collectible.svg';
};

// Draw the collectible on the screen
Collectible.prototype.render = function() {
    if (this.allowCollect)
        ctx.drawImage(Resources.get(this.sprite), this.x + 10, this.y + 50, 80, 80);
};

// Rocks that block the road
var Rock = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/rock.png';
};

// Draw the rocks on the screen
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Create the rocks on the road
// Three rocks along the middle road
function createRocks() {
    let roadX = [0, 100, 200, 300, 400];
    let index = Math.floor(Math.random() * roadX.length);
    let firstX = roadX[index];
    roadX.splice(index, 1);
    index = Math.floor(Math.random() * roadX.length);
    let secondX = roadX[index];
    roadX.splice(index, 1);
    index = Math.floor(Math.random() * roadX.length);
    let thirdX = roadX[index];
    allRocks = [new Rock(firstX, 220),
        new Rock(secondX, 220),
        new Rock(thirdX, 220)
    ];
}

// Create all the enemies
function createEnemies() {
    let iceGolemSprites = ['images/ice-golem/ice-golem-00.png',
        'images/ice-golem/ice-golem-01.png',
        'images/ice-golem/ice-golem-02.png',
        'images/ice-golem/ice-golem-03.png',
        'images/ice-golem/ice-golem-04.png',
        'images/ice-golem/ice-golem-05.png',
        'images/ice-golem/ice-golem-06.png',
        'images/ice-golem/ice-golem-07.png',
        'images/ice-golem/ice-golem-08.png',
        'images/ice-golem/ice-golem-09.png',
        'images/ice-golem/ice-golem-10.png',
        'images/ice-golem/ice-golem-11.png'
    ];
    let fireGolemSprites = ['images/fire-golem/fire-golem-00.png',
        'images/fire-golem/fire-golem-01.png',
        'images/fire-golem/fire-golem-02.png',
        'images/fire-golem/fire-golem-03.png',
        'images/fire-golem/fire-golem-04.png',
        'images/fire-golem/fire-golem-05.png',
        'images/fire-golem/fire-golem-06.png',
        'images/fire-golem/fire-golem-07.png',
        'images/fire-golem/fire-golem-08.png',
        'images/fire-golem/fire-golem-09.png',
        'images/fire-golem/fire-golem-10.png',
        'images/fire-golem/fire-golem-11.png'
    ];
    allEnemies = [new Enemy(50, Math.floor(Math.random() * (50 - 600)) + 600, iceGolemSprites),
        new Enemy(150, Math.floor(Math.random() * (50 - 600)) + 600, iceGolemSprites),
        new Enemy(300, Math.floor(Math.random() * (50 - 600)) + 600, iceGolemSprites),
        new Enemy(400, Math.floor(Math.random() * (50 - 600)) + 600, iceGolemSprites),
        new Enemy(50, Math.floor(Math.random() * (50 - 600)) + 600, iceGolemSprites),
        new Enemy(150, Math.floor(Math.random() * (50 - 600)) + 600, fireGolemSprites),
        new Enemy(300, Math.floor(Math.random() * (50 - 600)) + 600, fireGolemSprites)
    ];
}

// Create the collectible
// A delay can be recieved in order to wait to create it
function createCollectible(delay = 0) {
    setTimeout(function() {
        let roadY = [50, 150, 220, 300, 400];
        let roadX = [0, 100, 200, 300, 400];
        let yPosition = roadY[Math.floor(Math.random() * roadY.length)];
        let xPosition;
        if (yPosition === 220) {
            let repeat = true;
            while (repeat) {
                xPosition = roadX[Math.floor(Math.random() * roadX.length)];
                let available = true;
                for (rock of allRocks) {
                    if (rock.x === xPosition)
                        available = false;
                }
                if (available)
                    repeat = false;
            }
        } else {
            xPosition = roadX[Math.floor(Math.random() * roadX.length)];
        }
        collectible = new Collectible(xPosition, yPosition);
        collectible.allowCollect = true;
    }, delay);
}

// Show the finish modal
function showFinishModal(message) {
    stopTimer();
    player.allowMove = false;
    document.getElementById("victory-modal").firstElementChild.firstElementChild.innerText = message;
    document.getElementById("gameCanvas").style.filter = "blur(4px)";
    document.getElementById("victory-modal").style.display = "block";
}

// Slider that allow the user to chose the player
function setupSlider() {
    let arrowElements = document.getElementsByClassName("arrow");
    for (arrow of arrowElements) {
        arrow.addEventListener('click', function(e) {
            let playersArray = [...document.getElementsByClassName("player")];
            let index = -1;
            let i = 0;
            let exit = false;
            if (this.getAttribute("id") == "right-arrow") {
                while (!exit && i < playersArray.length) {
                    if (playersArray[i].offsetWidth > 0 && playersArray[i].offsetHeight > 0) {
                        playersArray[i].style.display = "none";
                        exit = true;
                        index = i + 1;
                        if (index == playersArray.length)
                            index = 0;
                    }
                    i++;
                }
                if (index != -1) {
                    playersArray[index].style.display = "block";
                }
            } else if (this.getAttribute("id") == "left-arrow") {
                while (!exit && i < playersArray.length) {
                    if (playersArray[i].offsetWidth > 0 && playersArray[i].offsetHeight > 0) {
                        playersArray[i].style.display = "none";
                        exit = true;
                        index = i - 1;
                        if (index == -1)
                            index = playersArray.length - 1;
                    }
                    i++;
                }
                if (index != -1) {
                    playersArray[index].style.display = "block";
                }
            }
        });
    }
}

// Listen for the players buttons and create the player object base on
// the choose of the user
function setupPlayer() {
    let playersElements = document.getElementsByClassName("player");
    for (item of playersElements) {
        item.addEventListener('click', function(e) {
            let playerNumber = this.getAttribute("data-index");
            let playerSprites = ['images/player-' + playerNumber + '/player-00.png',
                'images/player-' + playerNumber + '/player-01.png',
                'images/player-' + playerNumber + '/player-02.png',
                'images/player-' + playerNumber + '/player-03.png',
                'images/player-' + playerNumber + '/player-04.png',
                'images/player-' + playerNumber + '/player-05.png',
                'images/player-' + playerNumber + '/player-06.png',
                'images/player-' + playerNumber + '/player-07.png',
                'images/player-' + playerNumber + '/player-08.png',
                'images/player-' + playerNumber + '/player-09.png',
                'images/player-' + playerNumber + '/player-10.png',
                'images/player-' + playerNumber + '/player-11.png',
                'images/player-' + playerNumber + '/player-12.png',
                'images/player-' + playerNumber + '/player-13.png',
                'images/player-' + playerNumber + '/player-14.png',
                'images/player-' + playerNumber + '/player-15.png',
                'images/player-' + playerNumber + '/player-16.png',
                'images/player-' + playerNumber + '/player-17.png'
            ];
            player = new Player(playerSprites);
            createEnemies();
            createRocks();
            createCollectible();
            document.getElementById("player-selection").style.display = "none";
            document.getElementById("gameCanvas").style.filter = "blur(0)";
            startTimer();
        });
    }
}

// Listen for the user input
function manageKeyboardEvents() {
    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };
        if (player != null)
            player.handleInput(allowedKeys[e.keyCode]);
    });
}

// Events for the different buttons on the modals
// Change-player button that show the character selection modal
// Play-again that restart the game
function manageButtonsEvents() {
    document.getElementById("change-player").addEventListener('click', function(e) {
        document.getElementById("victory-modal").style.display = "none";
        document.getElementById("player-selection").style.display = "block";
    });

    document.getElementById("play-again").addEventListener('click', function(e) {
        player.score = 0;
        player.lifes = 3;
        player.allowMove = true;
        createEnemies();
        createRocks();
        createCollectible();
        document.getElementById("victory-modal").style.display = "none";
        document.getElementById("gameCanvas").style.filter = "blur(0)";
        startTimer();
    });
}

// Setup the environment
function setup() {
    setupSlider();
    setupPlayer();
    manageKeyboardEvents();
    manageButtonsEvents();
}

setup();