<template>
  <div id="platformer">
      <h3 class="text-white text-center mb-4 h3">🏔️ Slippery Slope 🐧</h3>
      <div id="canvas-wrapper">
          <button class="btn btn-danger nav-button" @click="gameOver" v-show="!this.game.gameOver"><i class="bi bi-house-fill"></i></button>
          <div id="canvas-instruction" v-if="this.instruction" v-show="!this.game.gameOver">
              {{this.instruction}}
          </div>
          <canvas ref="canvas" id="canvas" width="256" height="128" v-show="!this.game.gameOver"></canvas>
      </div>
      
      <div id="ui-wrapper" v-show="this.game.gameOver">
          <div id="ui" v-if="!this.inMenu">
              <button class="btn btn-danger abs-button" id="play-button" @click="toggleMenu">PLAY</button>
          </div>
          <div id="ui" v-else>
              <button class="btn btn-danger nav-button" @click="toggleMenu"><i class="bi bi-caret-left-fill"></i></button>

              <div id="ui-levels">
                  <button class="btn btn-primary level-button" v-for="i in 8" @click="startLevel(i-1)"
                  :class="{'disabled btn-danger':(i-1)>this.currentLevel[0], 'btn-success':(i-1) < this.currentLevel[0]}">{{i}}</button>
              </div>

              <div class="menu-instruction text-white" v-if="this.currentLevel[0] < 8">Choose a <span class="text-primary">level</span>!</div>
              <div class="menu-instruction text-white" v-else><span class="text-success">Congratulations!</span></div>
          </div>
      </div>

      <div class="instructions mt-3 text-white">
          <h3 class="text-center h5">How to Play</h3>
          <ul id="ul-instructions">
              <li><span class="text-primary">Move</span> and <span class="text-primary">Jump</span> with the <span class="text-primary">keyboards arrows</span>.</li>
              <li>Use <span class="text-primary">R</span> key to <span class="text-primary">restart</span> the level.</li>
              <li>Go to the <span class="text-primary">Flag</span>.</li>
              <li>The <span class="text-primary">red keys eliminate</span> the <span class="text-primary">bricks</span></li>
          </ul>
      </div>
  </div>
</template>

<script>
import Game from '@/utils/Platformer/Game.js'
import { setEventListeners, removeGame } from '@/utils/GameInput.js';
import levels from '@/utils/Platformer/Levels.js'
export default{
  name: 'Platformer',
  data(){
      return {
          ctx: null,
          game: {
              gameOver: true
          },
          timeOut: null,
          isKeyboardPressed: {
              'ArrowUp':false, 
              'ArrowDown':false,
              'ArrowLeft':false,
              'ArrowRight':false,
              'r': false
          },
          levelNumber: 0,
          currentLevel: [0, false],
          inMenu: false,
          instruction: ''
      }
  },
  created(){
      const currentLevel = parseInt( localStorage.getItem("currentLevel") );
      if (currentLevel){
          this.currentLevel[0] = currentLevel;
      }
  },
  unmounted(){
      this.removeGame();
  },
  methods:{
      toggleMenu(){
          this.inMenu = !(this.inMenu);
      },
      gameOver(){
          this.game = {
              gameOver: true
          }
          this.currentLevel[1] = false
      },
      update(){
          if (!this.game.gameOver){
              this.currentLevel[1] = true;
              this.game.onUserUpdate(this.isKeyboardPressed);
              this.timeOut = setTimeout( this.update, 1000/this.game.fps )
          }else{
              if (this.levelNumber === this.currentLevel[0] && this.currentLevel[1]){
                  this.currentLevel[0] += 1;
                  localStorage.setItem("currentLevel", this.currentLevel[0]);
              }
              this.game = {
                  gameOver: true
              }
          }
      },
      startLevel(levelNumber){
          if (levelNumber > this.currentLevel[0]){return}

          this.levelNumber = levelNumber;

          this.instruction = levels[this.levelNumber].instruction || '';

          const canvas = this.$refs.canvas;
          this.ctx = canvas.getContext('2d');
          this.game = new Game({
              ctx: this.ctx,
              width: canvas.width,
              height: canvas.height,
              levelWidth: 32, 
              levelHeight: 16,
              scale: 8,
              fps: 30
          },
          this.levelNumber)

          this.setEventListeners();
          this.update();
      },
      setEventListeners,
      removeGame
  }
}
</script>

<style scoped>
@font-face {
font-family: pixelFont;
src: url('@/../fonts/slippery-slope/FreePixel.ttf');
}
#canvas-wrapper{
  position: relative;
}
#canvas-instruction{
  position: absolute;
  width: 24rem;
  left: calc(50% - (24rem)/2);
  height: 10%;
  top: 5%;
  background-color: rgba(0,0,0,0.7);
  color: white;
  font-size: 1.3rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
#platformer{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--black);
  font-family: pixelFont;

  height: calc(100vh - 4rem);
  overflow: auto;

  user-select: none;
}
#canvas{
  image-rendering: pixelated;
  /* background: #678bb7;
  background: linear-gradient(180deg, rgba(103,139,183,1) 0%, rgba(167,181,198,1) 100%); */

  background-color: #678BB7;
  opacity: 1;
  background-image:  radial-gradient(#E7E7E7 1.8px, transparent 1.8px), radial-gradient(#E7E7E7 1.8px, #678BB7 1.8px);
  background-size: 72px 72px;
  background-position: 0 0,36px 36px;
}
#ui-wrapper, #canvas, .instructions{
  width: 50rem;
}
.disabled{
  opacity: 1;
}
#ui{
  width: 100%;
  padding-bottom: 50%;
  background-color: white;
  position: relative;
  image-rendering: pixelated;

  background-color: #678BB7;
  opacity: 1;
  background-image:  radial-gradient(#E7E7E7 1.8px, transparent 1.8px), radial-gradient(#E7E7E7 1.8px, #678BB7 1.8px);
  background-size: 72px 72px;
  background-position: 0 0,36px 36px;
}
.abs-button{
  position: absolute;
  width: 10rem;
  height: 2.5rem;
  border: 2px solid black;
  border-radius: 0;
  padding: 0.1rem;
  font-size: 1.5rem;
}
#play-button{
  top: calc(50% - (2.5rem)/2);
  left: calc(50% - (10rem)/2);
}
.nav-button, .level-button{
  padding: 0;
  border-radius: 0;
  border: calc(1rem/8) solid black;
}
.nav-button{
  position: absolute;
  left:1rem;
  top:1rem;
  width: 2rem;
  height: 2rem;
}
#ui-levels{
  position: absolute;
  left: 20%;
  width: 60%;
  top: 20%;
  height: 60%;
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
}
.level-button{
  width: 100%;
  height: 3rem;
  font-size: 2rem;
  margin: 1rem auto;
}
.menu-instruction{
  position: absolute;
  bottom: 2rem;
  left: calc(50% - (11rem)/2);
  font-size: 1.2rem;
  width: 11rem;
  text-align: center;

  background-color: rgba(0,0,0,0.7);
  border-radius: 1rem;
}
.instructions{
  text-align: justify;
}
#ul-instructions{
  display: grid;
  grid-template-columns: 50% 50%;
}
#ul-instructions li{
  word-wrap: break-word;
  padding-right: 2rem;
}
@media (max-width: 950px) {
  #ui-wrapper, #canvas, .instructions{
      width: 30rem;
  }
  .menu-instruction{
      bottom: 0.6rem;
  }
  #ul-instructions{
      display: block
  }
  #canvas-instruction{
      font-size: 1rem;
      width: 18rem;
      left: calc(50% - (18rem)/2);
  }
}
@media (max-width: 600px) {
  #ui-wrapper, #canvas, .instructions{
      width: 20rem;
  }
  .level-button{
      height: 2rem;
      font-size: 1rem;
      margin: 0.5rem auto;
  }
  .menu-instruction{
      bottom: 0.5rem;
  }
  #canvas-instruction{
      font-size: 0.7rem;
      width: 15rem;
      left: calc(50% - (15rem)/2);
  }
}
</style>