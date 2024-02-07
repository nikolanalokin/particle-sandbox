import { lineBetween, lineBetweenOptimized } from './utils'

export { Scene } from './Scene'
export { Species } from './Particle'
export type { SpeciesValue } from './Particle'

console.log('increase x', lineBetweenOptimized(0, 0, 5, 2))
