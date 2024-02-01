import { EmptyParticle, Particle, SandParticle } from './Particle'

export interface GridOptions {
    width?: number
    height?: number
}

export class Grid {
    width: number = 200
    height: number = 200

    cells: Particle[][] = []

    constructor (opts: GridOptions = {}) {
        if (opts.width) this.width = opts.width
        if (opts.height) this.height = opts.height
    }

    fill (particle: Particle) {
        for (let col = 0; col < this.width; col++) {
            if (!this.cells[col]) this.cells[col] = []
            for (let row = 0; row < this.height; row++) {
                this.cells[col][row] = particle
            }
        }
    }

    set (col, row, particle) {
        this.cells[col][row] = particle
    }

    setArea (centerCol, centerRow, setter) {
        this.cells[centerCol][centerRow - 1] = setter()
        this.cells[centerCol - 1][centerRow] = setter()
        this.cells[centerCol][centerRow] = setter()
        this.cells[centerCol + 1][centerRow] = setter()
        this.cells[centerCol][centerRow + 1] = setter()
    }

    getCellByIndex (index: number) {
        return this.cells[index % this.width][Math.floor(index / this.width)]
    }

    update () {
        const modified = new Set()

        for (let row = this.height - 1; row >= 0; row--) {
            for (let col = 0; col < this.width; col++) {
                const particle = this.cells[col][row]
                if (particle instanceof SandParticle) {
                    if (modified.has(particle)) continue
                    const below = this.cells[col]?.[row + 1]
                    const belowLeft = this.cells[col - 1]?.[row + 1]
                    const belowRight = this.cells[col + 1]?.[row + 1]
                    if (below instanceof EmptyParticle) {
                        this.swap(col, row, col, row + 1)
                    } else if (belowLeft instanceof EmptyParticle) {
                        this.swap(col, row, col - 1, row + 1)
                    } else if (belowRight instanceof EmptyParticle) {
                        this.swap(col, row, col + 1, row + 1)
                    }
                    modified.add(particle)
                }
            }
        }
    }

    swap (col1: number, row1: number, col2: number, row2: number) {
        const temp = this.cells[col1][row1]
        this.cells[col1][row1] = this.cells[col2][row2]
        this.cells[col2][row2] = temp
    }
}
