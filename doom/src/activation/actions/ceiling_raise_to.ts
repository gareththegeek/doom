import { Sector } from 'doom-map'
import { raiseCeiling } from '../mutations/raiseCeiling'

export const ceiling_raise_to = async (sector: Sector, amount: number): Promise<void> => {
    await raiseCeiling(sector, amount)
    sector.update = undefined
}
