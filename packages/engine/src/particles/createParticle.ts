import { hslSetLum } from '../color-utils'
import { Species, SpeciesValue } from '../core'
import { random } from '../utils'
import { Particle } from './Particle'

export function createEmpty (opts: Partial<Particle> = {}): Particle {
    const baseColor = '0 0 95'
    return {
        baseColor,
        clock: 0,
        state: null,
        density: 0,
        temperature: null,
        color: baseColor,
        velocity: [0, 0],
        ...opts
    }
}

export function createWall (opts: Partial<Particle> = {}): Particle {
    const baseColor = '0 0 30'
    return {
        baseColor,
        clock: 0,
        state: 'solid',
        density: Infinity,
        temperature: 20,
        color: hslSetLum(baseColor, value => value + random(-5, 5)),
        velocity: [0, 0],
        ...opts
    }
}

export function createSand (opts: Partial<Particle> = {}): Particle {
    const baseColor = '50 90 50'
    return {
        baseColor,
        clock: 0,
        state: 'solid',
        density: 3200,
        temperature: 20,
        color: hslSetLum(baseColor, value => value + random(-12, 12)),
        velocity: [0, 1],
        ...opts
    }
}

export function createWater (opts: Partial<Particle> = {}): Particle {
    const baseColor = '225 90 45'
    return {
        baseColor,
        clock: 0,
        state: 'liquid',
        density: 2200,
        temperature: 20,
        color: hslSetLum(baseColor, value => value + random(-5, 5)),
        velocity: [0, 1],
        ...opts
    }
}

export function getCreateFunc (species: SpeciesValue) {
    return {
        [Species.Empty]: createEmpty,
        [Species.Wall]: createWall,
        [Species.Sand]: createSand,
        [Species.Water]: createWater,
    }[species]
}
