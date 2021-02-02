import { Sector } from 'doom-map'

export const cancelAction = (sector: Sector) => {
    if (sector.update === undefined) {
        return
    }
    sector.update.cancel = true
}
