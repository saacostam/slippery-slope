import {topSprite, flagSprite, keySprite, brickSprite} from '@/utils/Platformer/Sprites.js'

class Tile{
    constructor(img, sx, sy){
        this.img = img;
        this.sx = sx;
        this.sy = sy;
    }

    render(ctx, x, y, scale){
        // Render the tile on the specified context, on the specified (x, y) position
        // under the specified scale.

        ctx.drawImage(
            this.img,  // img - HtmlImageElement
            this.sx*scale,      // sx - Subrectangle X
            this.sy*scale,          // sy - Subrectangle Y
            scale,      // sWidth - Subrectangle Width
            scale,      // sHeight - Subrectangle Height
            Math.round(scale * x),  // dx - Canvas Position
            Math.round(scale * y),  // dy - Canvas Position
            scale,      // dWidth - Canvas Rendering Width
            scale       // dHeight - Canvas Rendering Height
        )
    }
}

const tiles = {
    snow: {
        leftXtopY: new Tile(topSprite, 0, 0),
        centerXtopY: new Tile(topSprite, 1, 0),
        rightXtopY: new Tile(topSprite, 2, 0),
        leftXcenterY: new Tile(topSprite, 0, 1),
        centerXcenterY: new Tile(topSprite, 1, 1),
        rightXcenterY: new Tile(topSprite, 2, 1),
        leftXbottomY: new Tile(topSprite, 0, 2),
        centerXbottomY: new Tile(topSprite, 1, 2),
        rightXbottomY: new Tile(topSprite, 2, 2)
    },
    flag: new Tile(flagSprite, 0, 0),
    key: new Tile(keySprite, 0, 0),
    brick: new Tile(brickSprite, 0, 0)
}

export {tiles, Tile};