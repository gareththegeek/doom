import { Sector } from '../../interfaces/Sector'
import { lowerFloor } from '../mutations/lowerFloor'

export const floor_lower_to = async (sector: Sector, amount: number) => {
    await lowerFloor(sector, amount)
    sector.update = undefined
}
