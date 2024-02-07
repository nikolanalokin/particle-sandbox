import { Grid } from './Grid'
import { hslStringToObject, hslToRgb } from './color-utils'

const colorCache = new Map()

export class Renderer {
    width: number = 800
    height: number = 800

    rootEl: HTMLElement = null
    grid: Grid = null

    canvasEl: HTMLCanvasElement = null
    context: CanvasRenderingContext2D = null
    imageData = null

    offscreenCanvas: HTMLCanvasElement = null
    offscreenContext: CanvasRenderingContext2D = null

    constructor ({ rootEl, grid }) {
        this.rootEl = rootEl

        const rootIsCanvas = this.rootEl.tagName === 'CANVAS'

        this.grid = grid

        this.canvasEl = rootIsCanvas ? this.rootEl as HTMLCanvasElement : document.createElement('canvas')
        this.canvasEl.width = this.width
        this.canvasEl.height = this.height

        if (!rootIsCanvas) this.rootEl.appendChild(this.canvasEl)

        this.offscreenCanvas = document.createElement('canvas')
        this.offscreenCanvas.width = this.grid.width
        this.offscreenCanvas.height = this.grid.height

        this.context = this.canvasEl.getContext('2d')
        this.context.imageSmoothingEnabled = false
        this.offscreenContext = this.offscreenCanvas.getContext('2d')
        this.offscreenContext.imageSmoothingEnabled = false
        this.imageData = this.offscreenContext.createImageData(this.offscreenCanvas.width, this.offscreenCanvas.height)
    }

    render () {
        for (let i = 0, j = 0; i < this.imageData.data.length; i += 4, j++) {
            const particle = this.grid.getCellByIndex(j)
            let rbgColor = colorCache.get(particle.color)

            if (!rbgColor) {
                rbgColor = hslToRgb(...hslStringToObject(particle.color))
                colorCache.set(particle.color, rbgColor)
            }

            this.imageData.data[i + 0] = rbgColor[0] // R value
            this.imageData.data[i + 1] = rbgColor[1] // G value
            this.imageData.data[i + 2] = rbgColor[2] // B value
            this.imageData.data[i + 3] = 255 // A value
        }

        this.offscreenContext.putImageData(this.imageData, 0, 0)
        this.context.drawImage(this.offscreenCanvas, 0, 0, this.width, this.height)

        // this.context.lineWidth = .5
        // this.context.strokeStyle = 'green'

        // for (let i = 0; i < this.grid.length; i++) {
        //     const pos = this.grid.getPosition(i)
        //     this.context.strokeRect(this.scaleX * pos[0], this.scaleY * pos[1], this.scaleX, this.scaleY)
        // }
    }

    get scaleX () {
        return this.width / this.grid.width
    }

    get scaleY () {
        return this.height / this.grid.height
    }
}
