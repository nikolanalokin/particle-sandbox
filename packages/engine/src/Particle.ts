import { Api, Vector } from './Api'
import { GRAVITY } from './Scene'
import { hslSetLum } from './color-utils'
import { lineBetweenCallback, random } from './utils'

interface ParticleOptions {
    clock?: number
}

export abstract class Particle {
    species: SpeciesValue
    /** in HSL */
    color: string = '0 0 5'

    clock: number = 0

    constructor (opts: ParticleOptions = {}) {
        if (opts.clock) this.clock = opts.clock
    }

    update (cell: Particle, api: Api) {}
}

export class EmptyParticle extends Particle {
    species = Species.Empty
    color: string = '0 0 95'
}

export class WallParticle extends Particle {
    species = Species.Wall
    color: string = '0 0 30'

    constructor (opts?: ParticleOptions) {
        super(opts)
        this.color = hslSetLum(this.color, value => value + random(-5, 5))
    }
}

// export const emptyParticle = new EmptyParticle()
// export const wallParticle = new WallParticle()

// Тестирование ускорения
/* export class SandParticle extends Particle {
    species = Species.Sand
    color: string = '50 90 50'

    vx: number = 0
    vy: number = 0

    max_vx: number = 4
    max_vy: number = 4

    constructor (opts?: ParticleOptions) {
        super(opts)
        this.color = hslSetLum(this.color, value => value + random(-12, 12))
    }

    // одновляем скорость
    // определяем следующую предполагаемую ячейку
    // строим луч до ячейки и проверяем каждый пиксель на коллизию
    // перемещаем на место валидной ячейки

    updateVelocity () {
        this.vx = Math.abs(this.vx) <= .1 ? 0 : this.vx * .8
        this.vy = Math.abs(this.vy + GRAVITY) > this.max_vy ? this.max_vy : this.vy + GRAVITY
    }

    update(cell: SandParticle, api: Api): void {
        this.updateVelocity()

        const dx = Math.round(this.vx)
        const dy = Math.round(this.vy)

        let last = {
            cell: null,
            x: 0,
            y: 0,
        }

        let next = {
            cell: null,
            x: 0,
            y: 0,
        }

        lineBetweenCallback(0, 0, dx, dy, (x, y) => {
            next.cell = api.get(x, y)
            next.x = x
            next.y = y

            if ((x !== 0 || y !== 0) && next.cell.species !== Species.Empty) {
                return true
            }

            last.cell = next.cell
            last.x = next.x
            last.y = next.y
        })

        // не двигалась
        if (last.cell === this) {
            // console.log(1)
            api.set(0, 0, this)
            return
        }

        const rand_dir = api.randomDir2()

        // встретила препятствие
        if (last.cell !== next.cell) {
            if (api.get(next.x + rand_dir, next.y).species === Species.Empty) {
                // console.log(2)
                api.set(0, 0, new EmptyParticle())
                api.set(next.x + rand_dir, next.y, this)

                this.vx = rand_dir * this.vy / 2
                this.vy = 1
            } else if (api.get(next.x - rand_dir, next.y).species === Species.Empty) {
                // console.log(3)
                api.set(0, 0, new EmptyParticle())
                api.set(next.x - rand_dir, next.y, this)

                this.vx = -rand_dir * this.vy / 2
                this.vy = 1
            } else {
                // console.log(4)
                api.set(0, 0, new EmptyParticle())
                api.set(last.x, last.y, this)

                this.vx = 0
                this.vy = 0
            }

            return
        }

        api.set(0, 0, new EmptyParticle())
        api.set(last.x, last.y, this)
    }
} */

export class SandParticle extends Particle {
    species = Species.Sand
    color: string = '50 90 50'

    constructor (opts?: ParticleOptions) {
        super(opts)
        this.color = hslSetLum(this.color, value => value + random(-12, 12))
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
    color: string = '225 90 45'

    constructor (opts?: ParticleOptions) {
        super(opts)
        this.color = hslSetLum(this.color, value => value + random(-5, 5))
    }

    update(cell: WaterParticle, api: Api): void {
        const dx0 = api.randomDir2()
        const below = api.get(0, 1)
        const belowSide = api.get(dx0, 1)
        const belowOppositeSide = api.get(-dx0, 1)

        if (below.species === Species.Empty) {
            api.set(0, 0, below)
            api.set(0, 1, this)
            return
        } else if (belowSide.species === Species.Empty) {
            api.set(0, 0, belowSide)
            api.set(dx0, 1, this)
            return
        } else if (belowOppositeSide.species === Species.Empty) {
            api.set(0, 0, belowOppositeSide)
            api.set(-dx0, 1, this)
            return
        }

        const dx1 = api.randomDir2()
        const dx1d = dx1 * 2

        if (api.get(dx1, 0).species === Species.Empty && api.get(dx1d, 0).species === Species.Empty) {
            api.set(0, 0, api.get(dx1d, 0))
            api.set(dx1d, 0, this)
        } else if (api.get(dx1, 0).species === Species.Empty) {
            api.set(0, 0, api.get(dx1, 0))
            api.set(dx1, 0, this)
        } else {
            api.set(0, 0, this)
        }
    }
}

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


type TParticle = {
    type: 'solid' | 'liquid' | 'gas' | 'plasma'
    clock: number
    baseColor: string
}

type TPhisicalParticle = {
    state: 'solid' | 'liquid' | 'gas' | 'plasma'
    density: number
    temperature: number
}

type TSolidParticle = {
    /** сыпучий */
    loosy: boolean
    density: number

    /** Температура перехода в жидкое состояние | плавление */
    meltingTemperature: number
    /** Температура перехода в газообразное состояние | возгонка */
    sublimationTemperature: number
}

// meltingTemperature === freezingTemperature          | solidLiquidTransitionTemperature
// sublimationTemperature === depositionTemperature    | solidGasTransitionTemperature
// vaporizationTemperature === condensationTemperature | liquidGasTransitionTemperature
// ionizationTemperature === recombinationTemperature  | gasPlasmaTransitionTemperature

// сгорание - переход из плазмы в ничто, количество тиков
// плазма - частица, возницающая из газа, который порождает высоконагретая материя
// температура распространяется от частицы к частице с потерей (качество распространения зависит от теплопередачи)
// нагретая твёрдая частица, в зависимости от температуры либо становится жидкой, либо газообразной
// в следующий тик, если был газ, он либо остаётся таким, либо становится плазмой?
// либо при горении он испускает плазму, имеющую более высокую температуру

type TLiquidParticle = {
    density: number
    /** вязкость */
    viscosity: number

    /** Температура перехода в газообразное состояние | испарение */
    vaporizationTemperature: number
    /** Температура перехода в твердое состояние | кристаллизация */
    freezingTemperature: number
}

type TGasParticle = {
    density: number
    viscosity: number

    /** Температура перехода в жидкое состояние | конденсация */
    condensationTemperature: number
    /** Температура перехода в твердое состояние | десублимация */
    depositionTemperature: number
    /** Температура перехода в плазменное состояние | ионизация? */
    ionizationTemperature: number
}

type TPlasmaParticle = {
    temperature: number
    /** Температура перехода в газообразное состояние | рекомбинация */
    recombinationTemperature: number
}

// фазовые переходы
// реакции

class SolidParticle {
    static type = 'solid'

    update (cell: SolidParticle, api: Api) {

    }
}
class LiquidParticle {
    static type = 'liquid'

    update (cell: LiquidParticle, api: Api) {

    }
}
class GasParticle {
    static type = 'gas'

    update (cell: GasParticle, api: Api) {

    }
}
class PlasmaParticle {
    static type = 'plasma'

    update (cell: PlasmaParticle, api: Api) {

    }
}


function update (cell: any, api: Api) {
    updateState(cell)
}

function updateState (cell: any) {
    cell.prevState = cell.state

    // upgrade

    if (cell.state === 'solid' && cell.temperature >= cell.solidLiquidTransitionTemperature) {
        cell.state = 'liquid'
    }

    if (cell.state === 'solid' && cell.temperature >= cell.solidGasTransitionTemperature) {
        cell.state = 'gas'
    }

    if (cell.state === 'liquid' && cell.temperature >= cell.liquidGasTransitionTemperature) {
        cell.state = 'gas'
    }

    if (cell.state === 'gas' && cell.temperature >= cell.gasPlasmaTransitionTemperature) {
        cell.state = 'plasma'
    }

    // downgrade

    if (cell.state === 'plasma' && cell.temperature < cell.gasPlasmaTransitionTemperature) {
        cell.state = 'gas'
    }

    if (cell.state === 'gas' && cell.temperature < cell.liquidGasTransitionTemperature) {
        cell.state = 'liquid'
    }

    if (cell.state === 'gas' && cell.temperature < cell.solidGasTransitionTemperature) {
        cell.state = 'solid'
    }

    if (cell.state === 'liquid' && cell.temperature < cell.solidLiquidTransitionTemperature) {
        cell.state = 'solid'
    }
}

function move (cell: any, api: Api) {
    if (cell.state === 'solid') moveSolid (cell, api)
    if (cell.state === 'liquid') moveLiquid (cell, api)
    if (cell.state === 'gas') moveGas (cell, api)
    if (cell.state === 'plasma') movePlasma (cell, api)
}

function moveSolid (cell: any, api: Api) {
    if (!cell.loosy) return

    const below = api.get(0, 1) as any

    if (below.state === null) {
        api.set(0, 0, below)
        api.set(0, 1, cell)
        return
    }

    if (below.state === 'liquid') {

        return
    }

    if (below.state === 'gas') {

        return
    }

    if (below.state === 'plasma') {

        return
    }

    const isSliding = random(0, 1000) > cell.density // isShifting

    if (isSliding) {
        const dx = api.randomDir2()
        const belowSide = api.get(dx, 1) as any

        if (api.get(dx, 1).state === null) {
            api.set(0, 0, api.get(dx, 1))
            api.set(dx, 1, cell)
        } else if (api.get(-dx, 1).state === null) {
            api.set(0, 0, api.get(-dx, 1))
            api.set(-dx, 1, cell)
        }
    }

    api.set(0, 0, cell)



    if (belowSide.state === null) {
        api.set(0, 0, belowSide)
        api.set(dx, 1, this)
    } else if (below.species === Species.Water) {
        api.set(0, 0, below)
        api.set(0, 1, this)
    } else {
        api.set(0, 0, this)
    }

}

function moveLiquid (cell: any, api: Api) {

}

function moveGas (cell: any, api: Api) {

}

function movePlasma (cell: any, api: Api) {

}
