import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { Map, Thing } from 'doom-map'
export interface GameState {
    player: Thing
    map: Map
    cheats: { noclip: boolean }
}
