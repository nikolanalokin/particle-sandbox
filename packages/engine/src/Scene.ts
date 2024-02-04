import { Grid } from './Grid'
import { Interaction } from './Interaction'
import { ParticleType, SandParticle } from './Particle'
import { Renderer } from './Renderer'

export class Scene {
    grid: Grid = null
    renderer: Renderer = null
    interaction: Interaction = null

    timer: number = null

    constructor ({ rootEl }) {
        this.grid = new Grid()
        this.grid.reset()

        this.renderer = new Renderer({ rootEl, grid: this.grid })

        this.interaction = new Interaction({
            grid: this.grid,
            interactionEl: this.renderer.canvasEl,
            scaleX: this.renderer.scaleX,
            scaleY: this.renderer.scaleY,
        })
        this.interaction.addHandlers()
    }

    update () {
        if (this.interaction.isDown) {
            this.grid.paint(this.interaction.mouseX, this.interaction.mouseY, 3, ParticleType.Sand)
        }
        this.grid.update()
        this.renderer.render()
    }

    play () {
        this.timer = requestAnimationFrame(() => {
            this.update()
            this.play()
        })
        // this.timer = setTimeout(() => {
        //     this.update()
        //     this.play()
        // }, 200) as any
    }

    stop () {
        cancelAnimationFrame(this.timer)
        this.timer = null
    }

    destroy () {
        this.stop()
    }
}
