import { MapBlock, MapBlockMap } from 'doom-map'
import { LinkedList } from 'low-mem'
import { Line } from './Sector'
import { Stateful } from './State'

export interface Block extends MapBlock {
    statefuls: LinkedList<Stateful>
    lines: Line[]
}

export interface BlockMap extends MapBlockMap {
    blocks: Block[][]
}
