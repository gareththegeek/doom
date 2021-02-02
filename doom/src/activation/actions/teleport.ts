import { Sector } from 'doom-map'
import { changeSector } from '../../collisions/changeSector'
import { G } from '../../global'

export const teleport = (sector: Sector) => {
    //TODO telefrags
    const x = sector.sides.reduce((a, c) => a + c.start[0], 0) / sector.sides.length
    const y = sector.sides.reduce((a, c) => a + c.start[1], 0) / sector.sides.length

    const {
        player: { thing }
    } = G
    thing.geometry!.position = [x, sector.floorHeight, y]
    changeSector(thing, sector)
}
