import { Line } from '../interfaces/Line'
import { Sector } from '../interfaces/Sector'

export const activate = (line: Line, sector: Sector): void => {
    console.log(`Activated line ${line.index} with special type ${line.special} and sector ${sector.index}`)
    sector.lightLevel = 35
}
