import { Grid } from './Grid'

const colorCache = new Map()

export class Renderer {
    width: number = 200
    height: number = 200

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
        this.offscreenContext = this.offscreenCanvas.getContext('2d')
        this.imageData = this.offscreenContext.createImageData(this.offscreenCanvas.width, this.offscreenCanvas.height)
    }

    render () {
        // this.context.reset()

        for (let i = 0, j = 0; i < this.imageData.data.length; i += 4, j++) {
            const particle = this.grid.getCellByIndex(j)
            let rbgColor = colorCache.get(particle.color)

            if (!rbgColor) {
                rbgColor = hslToRgb(...particle.color)
                colorCache.set(particle.color, rbgColor)
            }

            this.imageData.data[i + 0] = rbgColor[0] // R value
            this.imageData.data[i + 1] = rbgColor[1] // G value
            this.imageData.data[i + 2] = rbgColor[2] // B value
            this.imageData.data[i + 3] = 255 // A value
        }

        this.offscreenContext.putImageData(this.imageData, 0, 0)

        // this.context.scale(this.scaleX, this.scaleY)
        this.context.drawImage(this.offscreenCanvas, 0, 0)
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
    return [(bigint >> 16) & 255,(bigint >> 8) & 255,bigint & 255]
}

function hslToRgb (h: number, s: number, l: number) {
    s /= 100
    l /= 100
    const k = n => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return [255 * f(0), 255 * f(8), 255 * f(4)]
}
