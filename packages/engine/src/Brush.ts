import { Species, SpeciesValue } from './core'

export class Brush {
    species: SpeciesValue = Species.Sand

    update () {

    }

    render () {

    }

    setSpecies (species: SpeciesValue) {
        this.species = species
    }
}
