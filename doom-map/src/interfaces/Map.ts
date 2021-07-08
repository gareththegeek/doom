import { WadVertex } from 'doom-wad/dist/interfaces/WadVertexLump'
import { MapBlockMap } from './MapBlockMap'
import { MapLine } from './MapLine'
import { MapSector } from './MapSector'
import { Thing } from './Thing'

export interface Map {
    name: string,
    sectors: MapSector[]
    blockmap: MapBlockMap
    lines: MapLine[]
    things: Thing[]
    vertices: WadVertex[]
    music: Buffer
}
