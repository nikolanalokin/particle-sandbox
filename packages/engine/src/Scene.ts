import { Grid } from './Grid'
import { Interaction } from './Interaction'
import { EmptyParticle, SandParticle } from './Particle'
import { Renderer } from './Renderer'

export class Scene {
    grid: Grid = null
    renderer: Renderer = null
    interaction: Interaction = null

    timer: number = null

    constructor ({ rootEl }) {
        this.grid = new Grid()
        this.grid.fill(new EmptyParticle())

        this.renderer = new Renderer({ rootEl, grid: this.grid })

        this.interaction = new Interaction({
            grid: this.grid,
            interactionEl: this.renderer.canvasEl,
            scaleX: this.renderer.scaleX,
            scaleY: this.renderer.scaleY,
        })
        this.interaction.addHandlers()
        this.interaction.onDrag = ({ col, row }) => {
            this.grid.set(col, row, new SandParticle())
        }
    }

    update () {
        this.grid.update()
        this.renderer.render()
    }

    play () {
        this.timer = requestAnimationFrame(() => {
            this.update()

            this.play()
        })
    }

    stop () {
        cancelAnimationFrame(this.timer)
        this.timer = null
    }
}
