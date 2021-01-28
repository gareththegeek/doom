import { Geometry } from 'doom-video/dist/scene/Geometry'
import { Sector } from './Sector'

export interface Thing {
    index: number
    geometry: Geometry | undefined
    sector: Sector
}
