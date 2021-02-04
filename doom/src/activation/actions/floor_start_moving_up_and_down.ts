import { Sector } from '../../interfaces/Sector'
import { lowerFloor } from '../mutations/lowerFloor'
import { raiseFloor } from '../mutations/raiseFloor'

export const floor_start_moving_up_and_down = async (sector: Sector) => {
    //TODO is this right?
    const floor = sector.floorHeight
    while (true) {
        if (await raiseFloor(sector, sector.ceilingHeight)) break
        if (await lowerFloor(sector, floor)) break
    }
    sector.update = undefined
}
