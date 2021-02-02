import { Map, Thing } from 'doom-map'
import { Player } from './Player'

export interface GameState {
    player: Player
    map: Map
    cheats: { noclip: boolean }
    input: { isPressed: { [key: string]: boolean } }
}
