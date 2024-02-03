import { Api, ApiCreator, createApi } from './Api'
import { EmptyParticle, Particle, ParticleType, SandParticle, WallParticle, emptyParticle, getParticleClass } from './Particle'

export interface GridOptions {
    width?: number
    height?: number
}



export class Grid {
    width: number = 200
    height: number = 200

    apiFabric: ApiCreator = null

    cells: Particle[] = []

    generation: number = 0

    constructor (opts: GridOptions = {}) {
        if (opts.width) this.width = opts.width
        if (opts.height) this.height = opts.height

        this.apiFabric = createApi({ grid: this })
    }

    getIndex (x: number, y: number): number {
        return x + y * this.width
    }

    getCell (x: number, y: number): Particle {
        const idx = this.getIndex(x, y)
        return this.cells[idx]
    }

    reset () {
        for (let i = 0; i < this.width * this.height; i++) {
            if (i < this.width || i > this.width * (this.height - 1) || i % this.width === 0 || (i + 1) % this.width === 0) {
                this.cells[i] = new WallParticle()
            } else {
                this.cells[i] = new EmptyParticle()
            }
        }
    }

    set (x: number, y: number, particle: Particle) {
        const idx = this.getIndex(x, y)
        this.cells[idx] = particle
    }

    paint (x: number, y: number, size: number, type: ParticleType) {
        const radius = Math.ceil(size / 2)

        for (let dx = -radius; dx < radius; dx++) {
            for (let dy = -radius; dy < radius; dy++) {
                if ((dx ** 2) + (dy ** 2) > radius ** 2) {
                    continue
                }

                const px = x + dx
                const py = y + dy

                if (px < 0 || px > this.width - 1 || py < 0 || py > this.height - 1) {
                    continue
                }

                const cell = this.getCell(px, py)

                if (cell.type === ParticleType.Empty || type === ParticleType.Empty) {
                    const Class = getParticleClass(type)
                    this.set(px, py, new Class({ clock: this.generation }))
                }
            }
        }
    }

    getCellByIndex (idx: number) {
        return this.cells[idx]
    }

    update () {
        // const scanx = this.generation % 2 === 0 ? this.width - x - 1 : x
        // for (let y = this.height - 1; y >= 0; y--) {
        for (let y = 0; y < this.height; y++) {
            const scany = this.generation % 2 === 0 ? this.height - y - 1 : y
            for (let x = 0; x < this.width; x++) {
                this.updateCell(this.getCell(x, scany), this.apiFabric(x, scany))
            }
        }

        this.generation++
        if (this.generation > 1000) this.generation = 0
    }

    updateCell (cell: Particle, api: Api) {
        if (cell.clock === this.generation) return

        cell.update(cell, api)
    }
}
