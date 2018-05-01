
// GameCharacter class
class GameCharacter {

    constructor(sprite, posX, posY) {
        this.sprite = sprite; // game character image
        this.posX = posX;
        this.posY = posY;
    }
    
    // renders the game character on the canvas
    render(posX, posY) {
        if(typeof posX === 'number' && typeof posY === 'number'){
            try {
                ctx.drawImage(Resources.get(this.sprite), posX, posY);
            } catch(e) {
                console.log(`Unable to render image beacuse of error:  ${e}`);
            }
        }
    }
    
    // resets the game character position to its initial location
    resetLocation(posX, posY){
        this.posX = posX;
        this.posY = posY;
    }

}

// GameCharacter subclass - represents the enemy in the game
class Enemy extends GameCharacter{
    
    constructor(posX, posY, speed){
        super('images/enemy-bug.png', posX, posY);
        this.initialX = posX;
        this.speed = speed;
        this.initialSpeed = this.speed;
    }
    
    // update the enemy speed
    update(dt) {
        if(dt > 0){
            this.speed = dt + this.speed;
        }

        let updatePosX = this.posX + this.speed;

        if((typeof updatePosX === 'number') && updatePosX < 500) {
            this.posX = updatePosX;
        } else {
            if(typeof this.posY === 'number' && typeof this.initialX === 'number') {
                this.posX = (typeof this.initialX === 'number')? this.initialX:1;
                this.speed = this.initialSpeed;
            }
        }
    }
    
    // renders the enemy on the canvas
    render() {
        super.render(this.posX, this.posY);
    }
    
}

// GameCharacter subclass - represents the player in the game
class Player extends GameCharacter{
    
    constructor(posX = 200, posY = 405){
        super('images/char-boy.png', posX, posY);
        this.reachedWater = false;
        this.score = 0;
        this.winningStarTime = -1 // flag to hold the winning star rendering
    }
    
    // updates the score of the player
    update() {
        // check if the player collided with an enemy
        if(this.didPlayerCollideWithEnemy()) {
            // reset the player's position
            super.resetLocation(200, 405);
            // a penalty for the player's score
            this.score -= 1;
        }

        // check if the player reaches the water
        if(this.didPlayerReachWater()){
            // congratulate the player
            ctx.drawImage(Resources.get('images/Star.png'), 2, -1);
            this.winningStarTime = new Date();
            // reset the player's position
            super.resetLocation(200, 405);
            this.reachedWater = false;
        }

        // draw a star to congratulate the player
        if(this.winningStarTime != -1) {
            if((new Date() - this.winningStarTime) <= 500){
                ctx.drawImage(Resources.get('images/Star.png'), 2, -1);
            } else {
                this.winningStarTime = -1;
            }
        }
        
        // update the player's score
        this.updateGameScore();
    }
    
    // renders the player and its score on the canvas
    render() {
        // draw the player
        super.render(this.posX, this.posY);
        // update the score
        this.update();
    }
    
    // handles the player's movement
    handleInput(move) {
        const moveX = 101;
        const moveY = 83;

        // update & re-render the player's position
        switch(move) {
            case 'left':
                if(this.allowMove((this.posX-moveX), this.posY)){
                    this.posX=(this.posX-moveX);
                    this.render(this.posX, this.posY);
                }
                break;
            case 'up':
                if(this.allowMove(this.posX, (this.posY-moveY))){
                    this.posY=(this.posY-moveY);
                    this.render(this.posX, this.posY);
                }
                break;
            case 'right':
                if(this.allowMove((this.posX+moveX), this.posY)){
                    this.posX=(this.posX+moveX);
                    this.render(this.posX, this.posY);
                }
                break;
            case 'down':
                if(this.allowMove(this.posX, (this.posY+moveY))){
                    this.posY=(this.posY+moveY);
                    this.render(this.posX, this.posY);
                }
                break;
        }
    }
    
    // the canvas boundaries
    allowMove(posX, posY){
        if(posX >= 500 || posX <= -3) {
            return false;
        }
        if(posY >= 488 || posY <= -11) {
            return false;
        }
        return true;
    }
    
    // checks if the player reached water
    didPlayerReachWater() {
        if(this.posY <= 1) {
            if(!this.reachedWater){
                this.reachedWater = true;
                this.score++;
            }
            return true;
        }
        return false;
    }
    
    // checks if the player collides with an enemy, reference: 
    // developer.mozilla.org/kab/docs/Games/Techniques/2D_collision_detection
    didPlayerCollideWithEnemy() {
        let enemyDimension = {};
        let playerDimension = {
            x: this.posX,
            y: this.posY,
            width: 50,
            height: 71
        };

        for(const enemy of allEnemies) {
            enemyDimension = {
                x: enemy.posX,
                y: enemy.posY,
                width: 80,
                height: 71
            };

            // check if the player dimension intersects with enemies dimension
            if (enemyDimension.x < playerDimension.x + playerDimension.width &&
                enemyDimension.x + enemyDimension.width > playerDimension.x &&
                enemyDimension.y < playerDimension.y + playerDimension.height &&
                enemyDimension.height + enemyDimension.y > playerDimension.y) {
                return true;
            }
        }
        return false;
    }
    
    // updates the game score
    updateGameScore() {
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#cdcdcd';
        ctx.fillText(`score: ${this.score}`, 8, 565);
    }

}

// place all enemy objects in an array called allEnemies
let allEnemies = [
        new Enemy(-80,145,5),
        new Enemy(-80,230,4),
        new Enemy(-80,65,8)
    ];
    
// place the player object in a variable called player
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
