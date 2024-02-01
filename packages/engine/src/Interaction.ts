import { Grid } from './Grid'

export class Interaction {
    isDown: boolean = false

    grid: Grid = null
    interactionEl: HTMLElement = null
    scaleX: number = 1
    scaleY: number = 1
    mouseX: number = null
    mouseY: number = null

    constructor ({ grid, interactionEl, scaleX = 1, scaleY = 1 }) {
        this.grid = grid
        this.interactionEl = interactionEl
        this.scaleX = scaleX
        this.scaleY = scaleY
    }

    addHandlers () {
        if (!this.interactionEl) return

        const handleMove = (evt: MouseEvent) => {
            this.mouseX = evt.offsetX
            this.mouseY = evt.offsetY
        }
        const handleDown = (evt: MouseEvent) => {
            this.isDown = true

            this.mouseX = evt.offsetX
            this.mouseY = evt.offsetY
        }
        const handleUp = (evt: MouseEvent) => {
            this.isDown = false
        }

        this.handleMove = handleMove.bind(this)
        this.handleDown = handleDown.bind(this)
        this.handleUp = handleUp.bind(this)

        this.interactionEl.addEventListener('mousemove', this.handleMove)
        this.interactionEl.addEventListener('mousedown', this.handleDown)
        this.interactionEl.addEventListener('mouseup', this.handleUp)
    }

    get mouseCol () {
        return Math.floor(this.mouseX / this.scaleX)
    }

    get mouseRow () {
        return Math.floor(this.mouseY / this.scaleY)
    }

    private handleMove: (evt: MouseEvent) => void = null
    private handleDown: (evt: MouseEvent) => void = null
    private handleUp: (evt: MouseEvent) => void = null
}
