import { WadBlockMapLump } from './WadBlockmapLump'
import { WadLineDefsLump } from './WadLineDefsLump'
import { WadLump } from './WadLump'
import { WadSectorsLump } from './WadSectorsLump'
import { WadSideDefsLump } from './WadSideDefsLump'
import { WadThingsLump } from './WadThingsLump'
import { WadVertexLump } from './WadVertexLump'

export interface WadMapLump extends WadLump {
    things: WadThingsLump
    linedefs: WadLineDefsLump
    sidedefs: WadSideDefsLump
    vertices: WadVertexLump
    sectors: WadSectorsLump
    blockmap: WadBlockMapLump
}
