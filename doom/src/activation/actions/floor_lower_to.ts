import { Sector } from '../../interfaces/Sector'
import { lowerFloor } from '../mutations/lowerFloor'
import { changeToAdjacentSector } from './changeToAdjacentTexture'

export const floor_lower_to = async (sector: Sector, amount: number, changeTexture = false) => {
    await lowerFloor(sector, amount)
    if (changeTexture) {
        changeToAdjacentSector(sector)
    }
    sector.update = undefined
}
