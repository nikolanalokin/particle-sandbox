import { Api } from '../Api'
import { random } from '../utils'

export type Particle = {
    baseColor: string
    color: string
    clock: number
    state: 'solid' | 'liquid' | 'gas' | 'plasma'
    density: number
    temperature: number
}

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


export function updateParticle (cell: any, api: Api) {
    // updateState(cell)
    move(cell, api)
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
    if (cell.state === 'solid') moveSolid(cell, api)
    if (cell.state === 'liquid') moveLiquid(cell, api)
    if (cell.state === 'gas') moveGas(cell, api)
    if (cell.state === 'plasma') movePlasma(cell, api)
}

function moveSolid (cell: any, api: Api) {
    // сыпучее поведение
    // плотность влияет на вероятность (1) соскальзывания, (2) отскок с разным вектором скорости
    // на соскальзывание влияет и плотность среды
    // среда - это окружающие частицы

    if (cell.density > 5000) {
        api.set(0, 0, cell)
        return
    }

    const below = api.get(0, 1) as any

    if (below.state === null || below.state === 'gas') {
        api.set(0, 0, below)
        api.set(0, 1, cell)
        return
    }

    if (below.state === 'solid') {
        const isSliding = cell.density - DENSITIES.solid[0] < 1000 && random(0, 1000) > cell.density - DENSITIES.solid[0]

        if (isSliding) {
            const dx = api.randomDir2()
            const belowSide1 = api.get(dx, 1) as any
            const belowSide2 = api.get(-dx, 1) as any

            if (belowSide1.state === null || belowSide1.state === 'gas') {
                api.set(0, 0, belowSide1)
                api.set(dx, 1, cell)
            } else if (belowSide2.state === null || belowSide2.state === 'gas') {
                api.set(0, 0, belowSide2)
                api.set(-dx, 1, cell)
            }
        } else {
            api.set(0, 0, cell)
        }

        return
    }

    if (below.state === 'liquid') {
        if (cell.density - below.density > random(0, 1000)) {
            api.set(0, 0, below)
            api.set(0, 1, cell)
        } else {
            api.set(0, 0, cell)
        }

        return
    }

    if (below.state === 'plasma') {
        api.set(0, 0, cell)

        return
    }

    api.set(0, 0, cell)
}

function moveLiquid (cell: any, api: Api) {
    // текучее поведение
    // нет отскоков
    // возможно смещение по горизонтали

}

function moveGas (cell: any, api: Api) {
    // хаотическое поведение
    // в основном направлено вверх, либо по горизонтали, изредка вниз (скорее случайные флуктуации)
    // есть рассеивание/растворение, следовательно время жизни

}

function movePlasma (cell: any, api: Api) {
    // реактивное поведение
    // яростное распространение во все стороны
    // быстрая потеря температуры

}

const DENSITIES = {
    plasma: [1, 1000],
    gas: [1001, 2000],
    liquid: [2001, 3000],
    solid: [3001, 4000],
}
