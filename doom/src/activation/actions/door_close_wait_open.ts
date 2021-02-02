import { Sector } from 'doom-map'
import { closeDoor } from '../mutations/closeDoor'
import { openDoor } from '../mutations/openDoor'
import { wait } from '../mutations/wait'

const DOOR_WAIT = 4

export const door_close_wait_open = async (sector: Sector, amount: number) => {
    if (await closeDoor(sector, amount)) return
    if (await wait(sector, DOOR_WAIT)) return
    if (await openDoor(sector, amount)) return

    sector.update = undefined
}
