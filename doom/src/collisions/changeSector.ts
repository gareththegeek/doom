import { Sector, Thing } from 'doom-map'

export const changeSector = (thing: Thing, sector: Sector): void => {
    const index = thing.sector.things.indexOf(thing)
    thing.sector.things.splice(index, 1)
    sector.things.push(thing)
    thing.sector = sector
    thing.geometry!.position[1] = sector.floorHeight
}
