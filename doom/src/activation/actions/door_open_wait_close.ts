import { Sector } from '../../interfaces/Sector'
import { closeDoor } from '../mutations/closeDoor'
import { openDoor } from '../mutations/openDoor'
import { wait } from '../mutations/wait'

const DOOR_WAIT = 4

export const door_open_wait_close = async (sector: Sector, amount: number) => {
    if (await openDoor(sector, amount)) return
    if (await wait(sector, DOOR_WAIT)) return
    if (await closeDoor(sector, amount)) return

    sector.update = undefined
}
