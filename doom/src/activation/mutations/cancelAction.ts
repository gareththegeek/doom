import { Sector } from '../../interfaces/Sector'

export const cancelAction = (sector: Sector) => {
    if (sector.update === undefined) {
        return
    }
    sector.update.cancel = true
}
