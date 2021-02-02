import { Sector } from 'doom-map'
import { raiseFloor } from '../mutations/raiseFloor'

export const floor_raise_by = async (sector: Sector, amount: number) => {
    await raiseFloor(sector, amount)
    sector.update = undefined
}
