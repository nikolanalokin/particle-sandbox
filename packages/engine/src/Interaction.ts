import { Grid } from './Grid'

export class Interaction {
    isDown: boolean = false

    grid: Grid = null
    interactionEl: HTMLElement = null
    scaleX: number = 1
    scaleY: number = 1

    constructor ({ grid, interactionEl, scaleX = 1, scaleY = 1 }) {
        this.grid = grid
        this.interactionEl = interactionEl
        this.scaleX = scaleX
        this.scaleY = scaleY
    }

    addHandlers () {
        if (!this.interactionEl) return

        const handleMove = (evt: MouseEvent) => {
            if (this.isDown) {
                this.onDrag?.({ col: Math.floor(evt.offsetX / this.scaleX), row: Math.floor(evt.offsetY / this.scaleY) })
            }
        }
        const handleDown = (evt: MouseEvent) => {
            this.isDown = true
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

    private handleMove: (evt: MouseEvent) => void = null
    private handleDown: (evt: MouseEvent) => void = null
    private handleUp: (evt: MouseEvent) => void = null

    onDrag: (params: { col: number, row: number }) => void = null
}
