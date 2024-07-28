import {Tile} from '@/utils/Platformer/Tiles.js';
import {playerSprite} from '@/utils/Platformer/Sprites.js';
import Animation from '@/utils/Platformer/Animation.js';
import {entities} from '@/utils/Platformer/Entity.js';
import levels from '@/utils/Platformer/Levels.js';

class Game{
    constructor(settings, levelNumber){
        this.ctx = settings.ctx;
        this.width = settings.width || 300;
        this.height = settings.height || 150;
        
        this.fps = settings.fps || 12;
        this.levelWidth = settings.levelWidth || 20;
        this.levelHeight = settings.levelHeight || 10;
        this.scale = settings.scale || 15;

        this.gameOver = false;

        this.levelNumber = levelNumber;
        this.level = settings.level || '';

        // Specific Stuff
        this.player = {x:7, y: this.levelHeight-6, 
            velocityX: 0, velocityY: 0, onFloor: true, facingRight: true, idle: true,
            rightAnimation: new Animation(
                playerSprite, 
                [{sx: 0, sy:0},{sx: 1, sy:0},{sx: 2, sy:0},{sx: 3, sy:0},{sx: 4, sy:0},{sx: 5, sy:0},{sx: 6, sy:0},{sx: 7, sy:0},{sx: 8, sy:0},{sx: 9, sy:0}]
            ),
            leftAnimation: new Animation(
                playerSprite, 
                [{sx: 0, sy:1},{sx: 1, sy:1},{sx: 2, sy:1},{sx: 3, sy:1},{sx: 4, sy:1},{sx: 5, sy:1},{sx: 6, sy:1},{sx: 7, sy:1},{sx: 8, sy:1},{sx: 9, sy:1}]
            ),
            rightIdle: new Tile(
                playerSprite, 
                0,0
            ),
            leftIdle: new Tile(
                playerSprite,
                0, 1
            )
        }

        entities.flag.interaction = this.levelPassed.bind(this);
        entities.key.interaction = this.gotKey.bind(this);

        this.entityMapping = {
            '$':entities.snow.centerXtopY,
            '#':entities.snow.centerXcenterY,
            'R':entities.snow.rightXtopY,
            'L':entities.snow.leftXtopY,
            'D':entities.snow.rightXcenterY,
            'I':entities.snow.leftXcenterY,
            'Z':entities.snow.leftXbottomY,
            'X':entities.snow.centerXbottomY,
            'C':entities.snow.rightXbottomY,
            'F':entities.flag,
            '.':entities.empty,
            'K':entities.key,
            'B':entities.brick
        }

        this.gravity = -0.3;

        this.onUserCreate();
    }

    levelPassed(){
        this.walkingAudio.volume = 0;
        this.walkingAudio.pause();

        this.slidingAudio.volume = 0;
        this.slidingAudio.pause();

        const audio = new Audio('audio/slippery-slope/success.mp3');
        audio.currentTime = 0.5;
        audio.volume = 0.5;
        audio.play();

        this.gameOver = true;
    }

    gotKey(){
        this.level = this.level.replace(/K/g, '.');
        this.level = this.level.replace(/B/g, '.');

        const audio = new Audio('audio/slippery-slope/key.mp3');
        audio.currentTime = 0.1;
        audio.volume = 0.3;
        audio.play();
    }

    onUserCreate(){
        this.locked = true;

        if (this.walkingAudio){
            this.walkingAudio.src = '';
        }
        this.walkingAudio = new Audio('audio/slippery-slope/walk.mp3');
        this.walkingAudio.loop = true;


        if (this.slidingAudio){
            this.slidingAudio.src  = '';
        }
        this.slidingAudio = new Audio('audio/slippery-slope/slide.mp3');
        this.slidingAudio.volume = 0.1;
        this.slidingAudio.loop = true;

        this.player.x = levels[this.levelNumber].player.x;
        this.player.y = levels[this.levelNumber].player.y;

        this.level = levels[this.levelNumber].level;
    }

    getChar(x, y){
        x = Math.floor(x);
        y = Math.floor(y);
        if (0 <= x < this.levelWidth && 0 <= y < this.levelHeight){
            return this.level.charAt(y*this.levelWidth + x);
        }
        return null;
    }

    getEntity(x, y){
        const char = this.getChar(x, y);
        return this.entityMapping[char];
    }

    onUserUpdate(isKeyboardPressed){
        this.player.idle = true;

        // Handle Input

        if (isKeyboardPressed['r']){
            this.onUserCreate();
        }

        if (isKeyboardPressed['ArrowUp']){
            if (this.player.onFloor === true){
                this.player.velocityY -= 5;
                this.player.onFloor = false;

                const audio = new Audio('audio/slippery-slope/jump.mp3');
                audio.currentTime = 0.2;
                audio.play();
            }
        }

        let walking = false;
        if (isKeyboardPressed['ArrowLeft']){
            this.player.velocityX -= 0.3;
            this.player.facingRight = false;
            this.player.idle = false;
            walking = true;
        }else if (isKeyboardPressed['ArrowRight']){
            this.player.velocityX += 0.3;
            this.player.facingRight = true;
            this.player.idle = false;
            walking = true;
        }

        // Physics

        this.player.velocityX = 0.9*this.player.velocityX;
        this.player.velocityY -= this.gravity;

        if (this.player.velocityX < -0.4)
            this.player.velocityX = -0.4;
        if (0.4 < this.player.velocityX)
            this.player.velocityX = 0.4;
        
        if (this.player.velocityY < -1)
            this.player.velocityY = -1;
        if (1 < this.player.velocityY)
            this.player.velocityY = 1;

        if (Math.abs(this.player.velocityX) < 0.1){
            this.player.velocityX = 0;
        }

        // Test Collisions
        this.player.onFloor = false;

        let newPlayerX = this.player.x + this.player.velocityX;
        let newPlayerY = this.player.y + this.player.velocityY;

        if (0 < this.player.velocityX){ // Derecha
            if (this.getEntity(newPlayerX+1, this.player.y).hasCollision || this.getEntity(newPlayerX+1, this.player.y+0.99).hasCollision){
                this.player.x = newPlayerX = Math.floor(newPlayerX);
                this.player.velocityX = 0;
            }
        }

        if (this.player.velocityX < 0){ // Izquierda
            if (this.getEntity(newPlayerX, this.player.y).hasCollision || this.getEntity(newPlayerX, this.player.y+0.99).hasCollision){
                this.player.x = newPlayerX = Math.floor(newPlayerX + 1);
                this.player.velocityX = 0;
            }
        }

        if (0 < this.player.velocityY){ // Abajo
            if (this.getEntity(newPlayerX, newPlayerY+1).hasCollision || this.getEntity(newPlayerX+0.99, newPlayerY+1).hasCollision){
                this.player.y = Math.floor(newPlayerY);
                this.player.velocityY = 0;
                this.player.onFloor = true;
            }
        }

        if (this.player.velocityY < 0){ // Arriba
            if (this.getEntity(newPlayerX, newPlayerY).hasCollision || this.getEntity(newPlayerX+0.99, newPlayerY).hasCollision){
                this.player.y = Math.floor(newPlayerY + 1);
                this.player.velocityY = 0;
            }
        }

        // Continous Sound Effects
        if (walking && this.player.onFloor){
            if (this.walkingAudio.paused){
                this.walkingAudio.play()
            }
        }else{
            this.walkingAudio.pause();
        }

        if (this.player.velocityX !== 0 && this.player.onFloor){
            if (this.slidingAudio.paused){
                this.slidingAudio.play()
            }
        }else{
            this.slidingAudio.pause();
        }

        // Update State
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;

        // Trigger Interactions
        const neighbors = [
            this.getEntity(this.player.x, this.player.y),
            this.getEntity(this.player.x+0.99, this.player.y),
            this.getEntity(this.player.x, this.player.y+0.99),
            this.getEntity(this.player.x+0.99, this.player.y+0.99)
        ]

        neighbors.forEach((entity) => {
            if (entity.interaction){
                entity.interaction();
            }
        })

        // Render
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Render Map
        for (let x=0; x<this.levelWidth; x++){
            for (let y=0; y<this.levelHeight; y++){
                const entity = this.getEntity(x, y);
                
                if (entity){
                    entity.render(this.ctx, x, y, this.scale);
                }
            }
        }

        // Render Player

        if (this.player.idle){
            if (this.player.facingRight){
                this.player.rightIdle.render(this.ctx, this.player.x, this.player.y, this.scale);
            }else{
                this.player.leftIdle.render(this.ctx, this.player.x, this.player.y, this.scale);
            }
        }else{
            if (this.player.facingRight){
                this.player.rightAnimation.render(this.ctx, this.player.x, this.player.y, this.scale);
            }else{
                this.player.leftAnimation.render(this.ctx, this.player.x, this.player.y, this.scale);
            }
        }
    }
}

export default Game