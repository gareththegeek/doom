import { Sector } from 'doom-map'
import { closeDoor } from '../mutations/closeDoor'

export const door_close_stay = async (sector: Sector, amount: number) => {
    await closeDoor(sector, amount)
    sector.update = undefined
}
