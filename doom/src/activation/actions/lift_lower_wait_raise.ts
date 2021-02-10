import { Sector } from '../../interfaces/Sector'
import { lowest_floor } from '../amounts'
import { lowerFloor } from '../mutations/lowerFloor'
import { raiseFloor } from '../mutations/raiseFloor'
import { wait } from '../mutations/wait'

const LIFT_WAIT = 2

export const lift_lower_wait_raise = async (sector: Sector) => {
    const start = sector.floorHeight
    if (await lowerFloor(sector, lowest_floor(sector), 140)) return
    if (await wait(sector, LIFT_WAIT)) return
    if (await raiseFloor(sector, start, 140)) return

    sector.update = undefined
}
