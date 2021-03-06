import { Sector } from '../../interfaces/Sector'
import { closeDoor } from '../mutations/closeDoor'

export const door_close_stay = async (sector: Sector, amount: number) => {
    await closeDoor(sector, amount)
    sector.update = undefined
}
