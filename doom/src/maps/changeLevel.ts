import { deleteBufferSet, Geometry } from 'doom-video'
import { G } from '../global'
import { loadMap } from './loadMap'

const isDefined = (geometry: Geometry | undefined): geometry is Geometry => geometry !== undefined

export const changeLevel = (mapName: string) => {
    const {
        map: { sectors }
    } = G
    ;[...sectors.map((sector) => sector.geometry)]
        .filter(isDefined)
        .forEach((geometry) => deleteBufferSet(geometry.buffers))

    loadMap(mapName)
}
