import { Sector, Thing } from 'doom-map'
import { Geometry } from 'doom-video'

const isDefined = (geometry: Geometry | undefined): geometry is Geometry => geometry !== undefined

export const light_change_to = (sector: Sector, amount: number) => {
    sector.lightLevel = amount
    sector.things
        .map((thing) => thing.geometry)
        .filter(isDefined)
        .forEach((geometry) => (geometry.light = amount))
}
