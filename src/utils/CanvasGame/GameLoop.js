import {Player, Goal} from '@/utils/CanvasGame/Player.js'

// Game Initialization

function initGame(){
    // Get context when canvas is mounted
    this.ctx = this.$refs.canvas.getContext('2d');

    this.entities = [];
    this.blocks = [];

    setEventListeners.bind(this)();

    while (!checkMaze.bind(this)()){
        createMaze.bind(this)();
    }

    renderMaze.bind(this)();

    this.entities.push( new Player({x:1, y:1}) );
    this.entities.push( new Goal({x:this.width-2, y:this.height-2}) );

    this.mainGameLoop();
}

function setEventListeners(){
    document.addEventListener('keydown', (e)=>{
        handleKeydown.bind(this)(e);
    });

    document.addEventListener('keyup', (e)=>{
        handleKeyup.bind(this)(e);
    });
}

function handleKeyup(e){
    const key = e.key;
    if (key in this.isKeyboardPressed){
        this.isKeyboardPressed[key] = false;
    }
}

function handleKeydown(e){
    const key = e.key;
    if (key in this.isKeyboardPressed){
        this.isKeyboardPressed[key] = true;
    }
}

function createMaze(){
    this.blocks = [];
    for (let i=0; i<this.width; i++){
        let temp = [];
        for (let j=0; j<this.height; j++){
            if (j===0 || j===this.height-1 || i===0 || i===this.width-1){
                temp.push(1);
            }else if ((j===1 && i===1) || (j===this.height-2 && i===this.width-2)){
                temp.push(0);
            }else{
                if (Math.random() < 0.65){
                    temp.push(0);
                }else{
                    temp.push(1);
                }
            }
        }
        this.blocks.push(temp);
    }
}

class MyStack{
    constructor(){this.struc = [];}
    get(){return this.struc;}
    add(newElement){this.struc.push(newElement);}
    pop(){const temp = this.struc.shift();return temp;}
    isEmpty(){return this.struc.length === 0;}
}

function getNeighbors(curr_cord){
    const neighbors_delta = [{x:0, y:1}, {x:1, y:0}, {x:0, y:-1}, {x:-1, y:0}]

    let neighbors = [];

    for (let i=0; i<neighbors_delta.length; i++){
        if (this.blocks[curr_cord.x + neighbors_delta[i].x][curr_cord.y + neighbors_delta[i].y] === 0){
            neighbors.push({
                x: curr_cord.x + neighbors_delta[i].x,
                y: curr_cord.y + neighbors_delta[i].y
            })
        }
    }

    return neighbors;
}

function checkMaze(){
    if (this.blocks.length === 0){return false;}
    const front = new MyStack();
    const visited = new Set();

    front.add({x:1, y:1});
    visited.add(`{x:1, y:1}`);

    while (!front.isEmpty()){
        const temp = front.pop();

        const neighbors = getNeighbors.bind(this)(temp);

        for (let i=0; i<neighbors.length; i++){
            if (neighbors[i].y===this.height-2 && neighbors[i].x===this.width-2){
                return true
            }

            if (!visited.has( `x:${neighbors[i].x}, y:${neighbors[i].y}` )){
                front.add(neighbors[i]);
                visited.add(`x:${neighbors[i].x}, y:${neighbors[i].y}`);
            }
        }
    }
    return false;
}

function renderMaze(){
    for (let i =0; i<this.width; i++){
        for (let j=0; j<this.height; j++){
            if (this.blocks[i][j] === 1){
                // this.ctx.drawImage(tileImage, i*this.scale, j*this.scale);
                this.ctx.fillStyle ="#112B3C";
                this.ctx.fillRect(i*this.scale, j*this.scale, this.scale, this.scale);
            }
        }
    }
}

// Game Main Loop

function mainGameLoop(){
    updateState.bind(this)();

    // Handle Input
    for (let i = 0; i<this.entities.length; i++){
        this.entities[i].handleInput(this.isKeyboardPressed, {width: this.width, height: this.height, blocks: this.blocks});
    }
    
    // Render
    for (let i = 0; i<this.entities.length; i++){
        this.entities[i].render(this.ctx, this.scale);
    }

    if (this.entities[0].isAtGoal({width: this.width, height: this.height})){
        return initGame.bind(this)();
    }

    // Set Timeout
    this.timeOut = setTimeout(this.mainGameLoop, 1000/this.fps);
}

function updateState(){
    this.tick+=1;
    this.ctx.clearRect(0, 0, this.width*this.scale, this.height*this.scale);
    renderMaze.bind(this)();
}

// Game Removal

function removeGame(){
    if (this.timeOut){clearTimeout(this.timeOut)};
    removeGameKeyboardListener.bind(this)();
}

function removeGameKeyboardListener(){
    document.removeEventListener('keydown', (e)=>{
        handleKeydown.bind(this)(e);
    });

    document.removeEventListener('keyup', (e)=>{
        handleKeyup.bind(this)(e);
    });
}

export {mainGameLoop, initGame, removeGame}