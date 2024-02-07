/**
 *
 * @param color 'h s l'
 */
export function hslStringToObject (color: string): [number, number, number] {
    return color.split(' ').map(Number) as [number, number, number]
}
/**
 *
 * @param color 'h s l'
 */
export function hslObjectToString (color: number[]): string {
    return color.join(' ')
}

export function hslSetLum (color: string, updater: (lum: number) => number) {
    const colorObject = hslStringToObject(color)
    colorObject[2] = updater(colorObject[2])
    return hslObjectToString(colorObject)
}

export function hexToRgb (hex: string) {
    const bigint = parseInt(hex.slice(1), 16)
    return [(bigint >> 16) & 255,(bigint >> 8) & 255,bigint & 255]
}

export function hslToRgb (h: number, s: number, l: number) {
    s /= 100
    l /= 100
    const k = n => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return [255 * f(0), 255 * f(8), 255 * f(4)]
}
