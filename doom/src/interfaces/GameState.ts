import { Map } from 'doom-map'
import { Player } from './Player'

export interface GameState {
    previousMap: string | undefined
    player: Player
    map: Map
    cheats: { noclip: boolean }
    input: { isPressed: { [key: string]: boolean } }
}
