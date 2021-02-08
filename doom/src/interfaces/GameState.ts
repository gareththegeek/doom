import { Scene } from 'doom-video'
import { LinkedList } from 'low-mem'
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
    scene: Scene
    statefuls: LinkedList<Stateful>
    cheats: { noclip: boolean }
    input: { isPressed: { [key: string]: boolean } }
}
