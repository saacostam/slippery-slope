import {tiles} from '@/utils/Platformer/Tiles.js'

class Entity{
    constructor(sprite, hasCollision, interaction = null, isVisible=true){
        this.sprite = sprite;
        this.hasCollision = hasCollision;
        this.interaction = interaction;
        this.isVisible = isVisible;
    }

    render(ctx, x, y, scale){
        if (this.sprite && this.isVisible){
            this.sprite.render(ctx, x, y, scale);
        }
    }
}

// Entities
const entities = {
    snow: {
        leftXtopY: new Entity(tiles.snow.leftXtopY, true, null, true),
        centerXtopY: new Entity(tiles.snow.centerXtopY, true, null, true),
        rightXtopY: new Entity(tiles.snow.rightXtopY, true, null, true),
        leftXcenterY: new Entity(tiles.snow.leftXcenterY, true, null, true),
        centerXcenterY: new Entity(tiles.snow.centerXcenterY, true, null, true),
        rightXcenterY: new Entity(tiles.snow.rightXcenterY, true, null, true),
        leftXbottomY: new Entity(tiles.snow.leftXbottomY, true, null, true),
        centerXbottomY: new Entity(tiles.snow.centerXbottomY, true, null, true),
        rightXbottomY: new Entity(tiles.snow.rightXbottomY, true, null, true),
    },
    flag: new Entity(tiles.flag, false, null, true),
    empty: new Entity(null, false, null, false),
    key: new Entity(tiles.key, false, null, true),
    brick: new Entity(tiles.brick, true, null, true)
}

export {entities}