export class Particle {
    color: string = '#101010'

    constructor () {}

    update (col, row, grid) {}
}

export class EmptyParticle extends Particle {}
export class SandParticle extends Particle {
    color: string = '#f5cf11'
}
