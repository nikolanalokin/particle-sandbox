import { Grid } from './Grid'
import { Particle, Species, WallParticle } from './Particle'

interface CreateApiOptions {
    grid: Grid
}

export function createApi ({ grid }: CreateApiOptions) {
    return (x: number, y: number) => {
        return {
            get (dx: number, dy: number): Particle {
                const px = x + dx
                const py = y + dy
                if (px < 0 || px > grid.width - 1 || py < 0 || py > grid.height - 1) {
                    return new WallParticle({
                        clock: grid.generation
                    })
                }
                return grid.getCell(px, py)
            },
            set (dx: number, dy: number, cell: Particle, skip?: boolean) {
                const px = x + dx
                const py = y + dy
                if (px < 0 || px > grid.width - 1 || py < 0 || py > grid.height - 1) {
                    return
                }
                if (grid.getCell(px, py).species === Species.Wall) {
                    return
                }
                grid.set(px, py, cell)
                if (!skip) cell.clock = grid.generation
            },
            randomDir () {
                return [-1, 0, 1].random() as -1 | 0 | 1
            },
            randomDir2 () {
                return [-1, 1].random() as -1 | 1
            },
        }
    }
}

export type ApiCreator = ReturnType<typeof createApi>
export type Api = ReturnType<ApiCreator>