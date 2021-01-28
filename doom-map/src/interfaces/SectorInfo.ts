import { BufferSet } from 'doom-video/dist/buffers/BufferSet'

export interface SectorThing {
    sector: number
    thing: number
}

export interface SectorInfo {
    buffers: BufferSet
    things: SectorThing[]
}
