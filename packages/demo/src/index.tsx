import { createRoot } from 'react-dom/client'
import { App } from './App'
import 'normalize.css'
import './index.css'

const root = createRoot(document.getElementById('root'))
root.render(<App />)
/*
function lineBetween (x1: number, y1: number, x2: number, y2: number) {
    const dx = Math.abs(x2 - x1)
    const dy = Math.abs(y2 - y1)
    let err = 0
    let derr = dy + 1
    let y = y1
    let diry = y2 - y1 > 0 ? 1 : -1
    const result = []
    for (let x = x1; x <= x2; x++) {
        result.push([x, y])
        err += derr
        if (err >= dx + 1) {
            y += diry
            err -= dx + 1
        }
    }
    return result
}

console.log('increase x', lineBetween2(1, 1, 9, 4))
console.log('increase x', lineBetween2(-1, 1, -9, 4))
console.log('increase x', lineBetween2(-1, -1, -9, -4))
console.log('increase x', lineBetween2(1, -1, 9, -4))

console.log('increase y', lineBetween2(1, 1, 4, 9))
console.log('increase y', lineBetween2(-1, 1, -4, 9))
console.log('increase y', lineBetween2(-1, -1, -4, -9))
console.log('increase y', lineBetween2(1, -1, 4, -9))


function lineBetween2 (x1: number, y1: number, x2: number, y2: number) {
    console.log(`(${x1}, ${y1}) -> (${x2}, ${y2})`)
    let dx, dy, abs_dx, abs_dy, dir_x, dir_y, e = 0, de, x = x1, y = y1, result = []

    dx = x2 - x1
    dy = y2 - y1

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
*/
