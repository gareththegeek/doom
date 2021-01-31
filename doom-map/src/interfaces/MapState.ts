import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { WadVertex } from 'doom-wad/dist/interfaces/WadVertexLump'
import { Map } from '..'

export interface MapState {
    atlas: TextureAtlas
    vertices: WadVertex[]
    map: Map
}
