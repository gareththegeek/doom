import { Sector } from 'doom-map'

const sectorDefined = (sector: Sector | undefined): sector is Sector => sector !== undefined

export const getAdjacentSectors = (sector: Sector): Sector[] => [
    ...new Set(
        sector.sides.map((side) => (side.sector === sector ? side.other?.sector : side.sector)).filter(sectorDefined)
    )
]
