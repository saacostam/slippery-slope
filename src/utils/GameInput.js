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

function removeGameKeyboardListener(){
    document.removeEventListener('keydown', (e)=>{
        handleKeydown.bind(this)(e);
    });

    document.removeEventListener('keyup', (e)=>{
        handleKeyup.bind(this)(e);
    });
}

function removeGame(){
    if (this.timeOut){clearTimeout(this.timeOut)};
    removeGameKeyboardListener.bind(this)();
}

export {setEventListeners, removeGame}