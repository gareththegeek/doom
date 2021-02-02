import { WadVertex } from 'doom-wad/dist/interfaces/WadVertexLump'
import { BlockMap } from './BlockMap'
import { Line } from './Line'
import { Sector } from './Sector'
import { Thing } from './Thing'

export interface Map {
    name: string,
    sectors: Sector[]
    blockmap: BlockMap
    lines: Line[]
    things: Thing[]
    vertices: WadVertex[]
}
