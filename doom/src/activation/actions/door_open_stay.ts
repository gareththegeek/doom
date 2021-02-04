import { Sector } from '../../interfaces/Sector'
import { openDoor } from '../mutations/openDoor'

export const door_open_stay = async (sector: Sector, amount: number) => {
    await openDoor(sector, amount)
    sector.update = undefined
}
