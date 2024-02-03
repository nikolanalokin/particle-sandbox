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
