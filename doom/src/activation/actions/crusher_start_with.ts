import { Sector } from 'doom-map'
import { lowerCeiling } from '../mutations/lowerCeiling'
import { raiseCeiling } from '../mutations/raiseCeiling'

export const crusher_start_with = async (sector: Sector, amount: number): Promise<void> => {
    //TODO crusher amount ?
    //TODO how to handle crusher stop?  The promise will never return
    const targetCeiling = sector.ceilingHeight
    while (true) {
        if (await lowerCeiling(sector, sector.floorHeight)) {
            break
        }
        if (await raiseCeiling(sector, targetCeiling)) {
            break
        }
    }
    sector.update = undefined
}
