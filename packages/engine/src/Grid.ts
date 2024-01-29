export interface GridOptions {
    width?: number
    height?: number
}

export class Grid {
    width: number = 400
    height: number = 400

    cells: number[] = []

    constructor (opts: GridOptions = {}) {
        this.width = opts.width
        this.height = opts.height


    }
}
