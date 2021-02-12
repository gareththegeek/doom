import { MapBlock, MapBlockMap } from 'doom-map'
import { LinkedList } from 'low-mem'
import { Line } from './Sector'
import { Physics } from './State'

export interface Block extends MapBlock {
    statefuls: LinkedList<Physics>
    lines: Line[]
}

export interface BlockMap extends MapBlockMap {
    blocks: Block[][]
}
