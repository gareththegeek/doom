import { Sector } from '../../interfaces/Sector'
import { raiseFloor } from '../mutations/raiseFloor'

export const floor_raise_to = async (sector: Sector, amount: number) => {
    console.log(sector, amount)
    await raiseFloor(sector, amount)
    sector.update = undefined
}
