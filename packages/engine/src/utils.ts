declare global {
    export interface Array<T> {
        random (): T
    }
}

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))]
}

/** min and max included */
export function random (min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function lineBetween (x1: number, y1: number, x2: number, y2: number) {
    let dx = x2 - x1,
        dy = y2 - y1,
        x = x1, y = y1,
        e = 0, de,
        abs_dx, abs_dy, dir_x, dir_y,
        result = []

    dir_x = Math.sign(dx)
    dir_y = Math.sign(dy)

    abs_dx = Math.abs(dx)
    abs_dy = Math.abs(dy)

    const inverse = abs_dx < abs_dy

    de = !inverse ? abs_dy + 1 : abs_dx + 1

    let i = 0, length = !inverse ? abs_dx : abs_dy

    const step = !inverse ? abs_dx + 1 : abs_dy + 1

    while (i <= length) {
        result.push([x, y])
        e += de
        if (e >= step) {
            if (!inverse) {
                y += dir_y
            } else {
                x += dir_x
            }
            e -= step
        }
        if (!inverse) {
            x += dir_x
        } else {
            y += dir_y
        }
        i++
    }

    return result
}

export function lineBetweenCallback (x1: number, y1: number, x2: number, y2: number, cb: (x, y) => boolean | void) {
    const dx = x2 - x1
    const dy = y2 - y1

    const dir_x = Math.sign(dx)
    const dir_y = Math.sign(dy)

    const abs_dx = Math.abs(dx)
    const abs_dy = Math.abs(dy)

    const isEven = abs_dx < abs_dy

    let e = 0
    let o = {
        calc_cur: isEven ? x1 : y1,
        calc_delta: isEven ? dir_x : dir_y,
        inc_cur: isEven ? y1 : x1,
        inc_end: isEven ? y2 : x2,
        inc_delta: isEven ? dir_y : dir_x,
        x_field: isEven ? 'calc_cur' : 'inc_cur',
        y_field: isEven ? 'inc_cur' : 'calc_cur',
        de: isEven ? abs_dx + 1 : abs_dy + 1,
        step: isEven ? abs_dy + 1 : abs_dx + 1,
    }

    const loop_end = o.inc_end + o.inc_delta

    while (o.inc_cur !== loop_end) {
        if (cb(o[o.x_field], o[o.y_field])) break
        e += o.de
        if (e >= o.step) {
            o.calc_cur += o.calc_delta
            e -= o.step
        }
        o.inc_cur += o.inc_delta
    }

    o = null
}

export function lineBetweenOptimized (x1: number, y1: number, x2: number, y2: number) {
    const dx = x2 - x1
    const dy = y2 - y1

    const dir_x = Math.sign(dx)
    const dir_y = Math.sign(dy)

    const abs_dx = Math.abs(dx)
    const abs_dy = Math.abs(dy)

    const isEven = abs_dx < abs_dy

    let e = 0
    let o = {
        calc_cur: isEven ? x1 : y1,
        calc_delta: isEven ? dir_x : dir_y,
        inc_cur: isEven ? y1 : x1,
        inc_end: isEven ? y2 : x2,
        inc_delta: isEven ? dir_y : dir_x,
        x_field: isEven ? 'calc_cur' : 'inc_cur',
        y_field: isEven ? 'inc_cur' : 'calc_cur',
        de: isEven ? abs_dx + 1 : abs_dy + 1,
        step: isEven ? abs_dy + 1 : abs_dx + 1,
    }

    const result = []
    const loop_end = o.inc_end + o.inc_delta

    while (o.inc_cur !== loop_end) {
        result.push([o[o.x_field], o[o.y_field]])
        e += o.de
        if (e >= o.step) {
            o.calc_cur += o.calc_delta
            e -= o.step
        }
        o.inc_cur += o.inc_delta
    }

    o = null

    return result
}
