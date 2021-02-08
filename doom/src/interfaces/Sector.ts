import { MapLine, MapSector, MapSide } from 'doom-map'
import { LinkedList } from 'low-mem'
import { Stateful } from './State'

export interface Line extends MapLine {
    front: Side
    back: Side | undefined
}

export interface Side extends MapSide {
    sector: Sector
    other: Side | undefined
    line: Line
}

export interface SectorUpdate {
    cancel: boolean
    function: SectorUpdateFunction
}
export type SectorUpdateFunction = (deltaTime: number) => void

export interface Sector extends MapSector {
    update?: SectorUpdate
    statefuls: LinkedList<Stateful>
    sides: Side[]
}
