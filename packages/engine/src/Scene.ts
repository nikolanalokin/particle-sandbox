import { Brush } from './Brush'
import { Grid } from './Grid'
import { Interaction } from './Interaction'
import { Species, SandParticle, SpeciesValue } from './Particle'
import { Renderer } from './Renderer'

export const GRAVITY = .1

export class Scene {
    grid: Grid = null
    renderer: Renderer = null
    interaction: Interaction = null
    brush: Brush = null

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

        this.brush = new Brush()
    }

    setBrushSpecies (species: SpeciesValue) {
        this.brush.setSpecies(species)
    }

    update () {
        // if (this.interaction.mouseX && this.interaction.mouseY) {
        //     this.grid.reset()
        //     this.grid.paintLine(this.interaction.x, this.interaction.y)
        // }
        if (this.interaction.isDown) {
            this.grid.paint(this.interaction.x, this.interaction.y, 3, this.brush.species)
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
