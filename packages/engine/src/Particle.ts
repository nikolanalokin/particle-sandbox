import { Api } from './Api'
import { random } from './utils'

interface ParticleOptions {
    clock?: number
}

export abstract class Particle {
    type: ParticleType
    /** in HSL */
    color: [number, number, number] = [0, 0, 5]

    clock: number = 0

    constructor (opts: ParticleOptions = {}) {
        if (opts.clock) this.clock = opts.clock
    }

    update (cell: Particle, api: Api) {}
}

export class EmptyParticle extends Particle {
    type = ParticleType.Empty
    color: [number, number, number] = [0, 0, 95]
}

export class WallParticle extends Particle {
    type = ParticleType.Wall
    color: [number, number, number] = [0, 0, 30]

    constructor (opts?: ParticleOptions) {
        super(opts)
        this.color[2] += random(-5, 5)
    }
}

export const emptyParticle = new EmptyParticle()
export const wallParticle = new WallParticle()

export class SandParticle extends Particle {
    type = ParticleType.Sand
    color: [number, number, number] = [50, 90, 50]

    constructor (opts?: ParticleOptions) {
        super(opts)
        this.color[2] += random(-12, 12)
    }

    update(cell: SandParticle, api: Api): void {
        const sideOffset = api.randomDir2()

        if (api.get(0, 1).type === ParticleType.Empty) {
            api.set(0, 0, new EmptyParticle())
            api.set(0, 1, this)
        } else if (api.get(sideOffset, 1).type === ParticleType.Empty) {
            api.set(0, 0, new EmptyParticle())
            api.set(sideOffset, 1, this)
        }
    }
}

export enum ParticleType {
    Empty = 0,
    Wall = 1,
    Sand = 2,
    Water = 3,
}

export function getParticleClass (type: ParticleType) {
    return {
        [ParticleType.Empty]: EmptyParticle,
        [ParticleType.Wall]: WallParticle,
        [ParticleType.Sand]: SandParticle,
        // [ParticleType.Water]: WaterParticle,
    }[type] || EmptyParticle
}
