import { WadBlockMapLump } from './WadBlockmapLump'
import { WadLineDef } from './WadLineDefsLump'
import { WadLump } from './WadLump'
import { WadSector } from './WadSectorsLump'
import { WadSideDef } from './WadSideDefsLump'
import { WadThing } from './WadThingsLump'
import { WadVertex } from './WadVertexLump'

export interface WadMapLump extends WadLump {
    things: WadThing[]
    linedefs: WadLineDef[]
    sidedefs: WadSideDef[]
    vertices: WadVertex[]
    sectors: WadSector[]
    blockmap: WadBlockMapLump
}
