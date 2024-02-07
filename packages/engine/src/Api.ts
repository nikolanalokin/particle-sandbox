import { Grid } from './Grid'
import { Particle, Species, WallParticle } from './Particle'
import { random } from './utils'

/**
 * d% - delta
 * dir% - direction
 * n% - next
 */

interface CreateApiOptions {
    grid: Grid
}

export function createApi ({ grid }: CreateApiOptions) {
    return (x: number, y: number) => {
        return {
            get (dx: number, dy: number): Particle {
                const nx = x + dx
                const ny = y + dy
                if (nx < 0 || nx > grid.width - 1 || ny < 0 || ny > grid.height - 1) {
                    return new WallParticle({
                        clock: grid.generation
                    })
                }
                return grid.getCell(nx, ny)
            },
            set (dx: number, dy: number, cell: Particle, skip?: boolean) {
                const nx = x + dx
                const ny = y + dy
                if (nx < 0 || nx > grid.width - 1 || ny < 0 || ny > grid.height - 1) {
                    return
                }
                if (grid.getCell(nx, ny).species === Species.Wall) {
                    return
                }
                grid.set(nx, ny, cell)
                if (!skip) cell.clock = grid.generation
            },
            randomDir () {
                return [-1, 0, 1].random() as -1 | 0 | 1
            },
            randomDir2 () {
                return [-1, 1].random() as -1 | 1
            },
            randomVec () {
                return [
                    [-1, -1],
                    [0, -1],
                    [1, -1],
                    [-1, 0],
                    [0, 0],
                    [1, 0],
                    [-1, 1],
                    [0, 1],
                    [1, 1],
                ][random(0, 8)] as Vector<Direction>
            },
        }
    }
}

export type Direction = -1 | 0 | 1
export type DirectionSide = Exclude<Direction, 0>
export type Vector<T extends number = number> = [T, T]

export type ApiCreator = ReturnType<typeof createApi>
export type Api = ReturnType<ApiCreator>
