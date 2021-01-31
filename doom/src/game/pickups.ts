import { Thing, ThingInfoLookup } from 'doom-map'

export const pickups = (things: Thing[]): void => {
    const pickupable = things.filter((thing) => ThingInfoLookup[thing.type].pickup)
    pickupable.forEach((thing) => {
        thing.block.things.splice(thing.block.things.indexOf(thing))
        thing.sector.things.splice(thing.sector.things.indexOf(thing))
        thing.geometry!.visible = false
        console.log(`Picked up ${ThingInfoLookup[thing.type].sprite}`)
    })
}
