import { Geometry } from 'doom-video/dist/scene/Geometry'
import { Block } from './BlockMap'
import { Sector } from './Sector'

export interface Thing {
    index: number
    type: number
    geometry: Geometry | undefined
    sector: Sector
    block: Block
}
