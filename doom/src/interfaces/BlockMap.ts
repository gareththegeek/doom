import { MapBlock, MapBlockMap } from 'doom-map'
import { Line } from './Sector'
import { Stateful } from './State'

export interface Block extends MapBlock {
    statefuls: Stateful[]
    lines: Line[]
}

export interface BlockMap extends MapBlockMap {
    blocks: Block[][]
}
