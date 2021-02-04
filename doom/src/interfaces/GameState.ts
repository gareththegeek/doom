import { Sector } from '../interfaces/Sector'
import { BlockMap } from './BlockMap'
import { Player } from './Player'
import { Stateful } from './State'

export interface GameState {
    mapName: string
    previousMapName: string | undefined
    player: Player
    sectors: Sector[]
    blockmap: BlockMap
    statefuls: Stateful[]
    cheats: { noclip: boolean }
    input: { isPressed: { [key: string]: boolean } }
}
