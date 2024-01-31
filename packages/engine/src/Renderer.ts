import { Grid } from './Grid'

const colorCache = new Map()

export class Renderer {
    width: number = 400
    height: number = 400

    rootEl: HTMLElement = null
    grid: Grid = null

    canvasEl: HTMLCanvasElement = null
    context: CanvasRenderingContext2D = null
    imageData = null

    imageCanvas: HTMLCanvasElement = null
    imageContext: CanvasRenderingContext2D = null

    constructor ({ rootEl, grid }) {
        this.rootEl = rootEl
        this.grid = grid

        this.canvasEl = document.createElement('canvas')
        this.canvasEl.width = this.width
        this.canvasEl.height = this.height

        this.imageCanvas = document.createElement('canvas')
        this.imageCanvas.width = this.grid.width
        this.imageCanvas.height = this.grid.height

        this.rootEl.appendChild(this.canvasEl)

        this.context = this.canvasEl.getContext('2d')
        this.imageContext = this.imageCanvas.getContext('2d')
        this.imageData = this.imageContext.createImageData(this.imageCanvas.width, this.imageCanvas.height)
    }

    render () {
        this.context.reset()

        for (let i = 0, j = 0; i < this.imageData.data.length; i += 4, j++) {
            const particle = this.grid.getCellByIndex(j)
            let rbgColor = colorCache.get(particle.color)

            if (!rbgColor) {
                rbgColor = hexToRgb(particle.color)
                colorCache.set(particle.color, rbgColor)
            }

            this.imageData.data[i + 0] = rbgColor.r // R value
            this.imageData.data[i + 1] = rbgColor.g // G value
            this.imageData.data[i + 2] = rbgColor.b // B value
            this.imageData.data[i + 3] = 255 // A value
        }

        this.imageContext.putImageData(this.imageData, 0, 0)

        this.context.scale(this.scaleX, this.scaleY)
        this.context.drawImage(this.imageCanvas, 0, 0)
    }

    get scaleX () {
        return this.width / this.grid.width
    }

    get scaleY () {
        return this.height / this.grid.height
    }
}

function hexToRgb (hex: string) {
    const bigint = parseInt(hex.slice(1), 16)
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    }
}
