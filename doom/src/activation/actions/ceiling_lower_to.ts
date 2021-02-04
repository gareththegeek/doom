import { Sector } from '../../interfaces/Sector'
import { lowerCeiling } from '../mutations/lowerCeiling'

export const ceiling_lower_to = async (sector: Sector, amount: number): Promise<void> => {
    await lowerCeiling(sector, amount)
    sector.update = undefined
}
