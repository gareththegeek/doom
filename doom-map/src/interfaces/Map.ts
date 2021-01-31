import { BlockMap } from './BlockMap'
import { Line } from './Line'
import { Sector } from './Sector'
import { Thing } from './Thing'

export interface Map {
    sectors: Sector[]
    blockmap: BlockMap
    lines: Line[]
    things: Thing[]
}
