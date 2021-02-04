import { Map } from 'doom-map'
import { Player } from './Player'
import { Stateful } from './State'

export interface GameState {
    previousMap: string | undefined
    player: Player
    map: Map
    statefuls: Stateful[]
    cheats: { noclip: boolean }
    input: { isPressed: { [key: string]: boolean } }
}
