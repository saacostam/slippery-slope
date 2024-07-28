class Animation{
    constructor(img, sequence){
        this.img = img,
        this.sequence = sequence,
        this.currentFrame = 0
    }

    render(ctx, x, y, scale){
        // Render the tile on the specified context, on the specified (x, y) position
        // under the specified scale.

        const {sx, sy} = this.sequence[this.currentFrame]

        ctx.drawImage(
            this.img,  // img - HtmlImageElement
            sx*scale,      // sx - Subrectangle X
            sy*scale,          // sy - Subrectangle Y
            scale,      // sWidth - Subrectangle Width
            scale,      // sHeight - Subrectangle Height
            Math.round(scale * x),  // dx - Canvas Position
            Math.round(scale * y),  // dy - Canvas Position
            scale,      // dWidth - Canvas Rendering Width
            scale       // dHeight - Canvas Rendering Height
        )

        this.currentFrame = (this.currentFrame + 1)%this.sequence.length;
    }

    restart(){
        this.currentFrame = 0;
    }
}

export default Animation