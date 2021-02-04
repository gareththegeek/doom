import { Sector } from '../../interfaces/Sector'
import { isStatefulObject } from '../../global'

export const light_change_to = (sector: Sector, amount: number) => {
    sector.lightLevel = amount
    sector.statefuls
        .filter(isStatefulObject)
        .map((thing) => thing.geometry)
        .forEach((geometry) => (geometry.light = amount))
}
