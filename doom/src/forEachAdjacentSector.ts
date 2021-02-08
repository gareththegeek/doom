import { Sector } from './interfaces/Sector'

const sectorDefined = (sector: Sector | undefined): sector is Sector => sector !== undefined

export const forEachAdjacentSector = (sector: Sector, callback: (sector: Sector) => void): void => {
    for (const inside of sector.sides) {
        const other = inside.other?.sector
        if (sectorDefined(other)) {
            callback(other)
        }
    }
}
