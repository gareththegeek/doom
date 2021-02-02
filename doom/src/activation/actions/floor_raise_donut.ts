import { Sector } from 'doom-map'
import { floor_lower_to, floor_raise_to } from '.'
import { lowest_floor } from '../amounts'

export const floor_raise_donut = async (sector: Sector) => {
    const outer = sector.sides[0].other?.sector
    if (outer === undefined) {
        console.warn(`Unable to find the donut ${sector.index} :'(`)
        return
    }
    const target = lowest_floor(outer)

    const promises = [floor_lower_to(sector, target), floor_raise_to(outer, target)]
    await Promise.all(promises)

    sector.update = undefined
    outer.update = undefined
}
