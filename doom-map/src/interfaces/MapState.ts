import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { Wad } from 'doom-wad/dist/interfaces/Wad'
import { WadVertex } from 'doom-wad/dist/interfaces/WadVertexLump'
import { Map } from '..'

export interface MapState {
    wad: Wad
    vertices: WadVertex[]
    atlas: TextureAtlas
    map: Map
}
