import { Sector } from 'doom-map'
import { lowerCeiling } from '../mutations/lowerCeiling'

export const ceiling_lower_to = async (sector: Sector, amount: number): Promise<void> => {
    await lowerCeiling(sector, amount)
    sector.update = undefined
}
