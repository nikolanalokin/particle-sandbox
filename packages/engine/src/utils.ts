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

    const yIncrement = abs_dx > abs_dy

    de = yIncrement ? (abs_dy / abs_dx) : (abs_dx / abs_dy)

    let i = 0, length = yIncrement ? abs_dx : abs_dy

    while (i <= length) {
        result.push([x, y])
        e += de
        if (e >= 1) {
            if (yIncrement) {
                y += dir_y
            } else {
                x += dir_x
            }
            e -= 1
        }
        if (yIncrement) {
            x += dir_x
        } else {
            y += dir_y
        }
        i++
    }

    return result
}
