import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { Map, Thing } from 'doom-map'
import { Wad } from 'doom-wad/dist/interfaces/Wad'

export interface GameState {
    wad: Wad
    atlas: TextureAtlas
    player: Thing
    map: Map
    cheats: { noclip: boolean }
}
