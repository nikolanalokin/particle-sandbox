import { Api } from './Api'
import { random } from './utils'

interface ParticleOptions {
    clock?: number
}

export abstract class Particle {
    species: SpeciesValue
    /** in HSL */
    color: [number, number, number] = [0, 0, 5]

    clock: number = 0

    constructor (opts: ParticleOptions = {}) {
        if (opts.clock) this.clock = opts.clock
    }

    update (cell: Particle, api: Api) {}
}

export class EmptyParticle extends Particle {
    species = Species.Empty
    color: [number, number, number] = [0, 0, 95]
}

export class WallParticle extends Particle {
    species = Species.Wall
    color: [number, number, number] = [0, 0, 30]

    constructor (opts?: ParticleOptions) {
        super(opts)
        this.color[2] += random(-5, 5)
    }
}

// export const emptyParticle = new EmptyParticle()
// export const wallParticle = new WallParticle()

export class SandParticle extends Particle {
    species = Species.Sand
    color: [number, number, number] = [50, 90, 50]

    constructor (opts?: ParticleOptions) {
        super(opts)
        this.color[2] += random(-12, 12)
    }

    update(cell: SandParticle, api: Api): void {
        const dx = api.randomDir2()
        const below = api.get(0, 1)
        const belowSide = api.get(dx, 1)

        if (below.species === Species.Empty) {
            api.set(0, 0, below)
            api.set(0, 1, this)
        } else if (belowSide.species === Species.Empty) {
            api.set(0, 0, belowSide)
            api.set(dx, 1, this)
        } else if (below.species === Species.Water) {
            api.set(0, 0, below)
            api.set(0, 1, this)
        } else {
            api.set(0, 0, this)
        }
    }
}

export class WaterParticle extends Particle {
    species = Species.Water
    color: [number, number, number] = [225, 90, 45]

    constructor (opts?: ParticleOptions) {
        super(opts)
        this.color[2] += random(-5, 5)
    }

    update(cell: WaterParticle, api: Api): void {
        const dx = api.randomDir2()
        const below = api.get(0, 1)
        const belowSide = api.get(dx, 1)
        const belowOppositeSide = api.get(-dx, 1)

        if (below.species === Species.Empty) {
            api.set(0, 0, below)
            api.set(0, 1, this)
            return
        } else if (belowSide.species === Species.Empty) {
            api.set(0, 0, belowSide)
            api.set(dx, 1, this)
            return
        } else if (belowOppositeSide.species === Species.Empty) {
            api.set(0, 0, belowOppositeSide)
            api.set(-dx, 1, this)
            return
        }
    }
}

// export enum Species {
//     Empty = 0,
//     Wall = 1,
//     Sand = 2,
//     Water = 3,
// }

export function getParticleClass (species: SpeciesValue) {
    return {
        [Species.Empty]: EmptyParticle,
        [Species.Wall]: WallParticle,
        [Species.Sand]: SandParticle,
        [Species.Water]: WaterParticle,
    }[species] || EmptyParticle
}

export const Species = {
    Empty: 0,
    Wall: 1,
    Sand: 2,
    Water: 3,
} as const

export type SpeciesName = keyof typeof Species;
export type SpeciesValue = typeof Species[SpeciesName]
