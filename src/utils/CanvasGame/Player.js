class Player{
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;

        this.width = config.width || 1;
        this.height = config.height || 1;
    }

    handleInput(isKeyboardPressed, scene){
        if (isKeyboardPressed['ArrowRight'] && ( (this.x+this.width+1) <= scene.width  && scene.blocks[this.x+1][this.y] != 1) ){
            this.x += 1;
        }else if (isKeyboardPressed['ArrowLeft'] && ((this.x-1) >= 0) && scene.blocks[this.x-1][this.y] != 1) {
            this.x -= 1;
        }
    
        if (isKeyboardPressed['ArrowDown'] && ((this.y+this.height+1) <= scene.height && scene.blocks[this.x][this.y+1] != 1)){
            this.y += 1;
        }else if (isKeyboardPressed['ArrowUp'] && ((this.y-1) >= 0 && scene.blocks[this.x][this.y-1] != 1) ){
            this.y -= 1;
        }
    }

    isAtGoal(scene){
        return (this.x === scene.width-2 && this.y === scene.height-2);
    }

    render(ctx, scale){
        ctx.fillStyle ="#F66B0E"
        ctx.fillRect(this.x*scale, this.y*scale, this.width*scale, this.height*scale);
    }
}

class Goal{
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;

        this.width = config.width || 1;
        this.height = config.height || 1;
    }

    handleInput(isKeyboardPressed, scene){}

    render(ctx, scale){
        ctx.fillStyle ="green"
        ctx.fillRect(this.x*scale, this.y*scale, this.width*scale, this.height*scale);
    }
}

export {Player, Goal}