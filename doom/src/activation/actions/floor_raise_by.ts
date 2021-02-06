import { Sector } from '../../interfaces/Sector'
import { raiseFloor } from '../mutations/raiseFloor'
import { changeToAdjacentSector } from './changeToAdjacentTexture'

export const floor_raise_by = async (sector: Sector, amount: number, changeTexture = false) => {
    await raiseFloor(sector, amount)
    if (changeTexture) {
        changeToAdjacentSector(sector)
    }
    sector.update = undefined
}
