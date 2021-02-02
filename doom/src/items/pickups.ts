import { Thing, ThingInfoLookup } from 'doom-map'
import { G } from '../global'

export const pickups = (things: Thing[]): void => {
    const pickupable = things.filter((thing) => ThingInfoLookup[thing.type].pickup)
    pickupable.forEach((thing) => {
        thing.block.things.splice(thing.block.things.indexOf(thing))
        thing.sector.things.splice(thing.sector.things.indexOf(thing))
        thing.geometry!.visible = false
        console.info(`Picked up ${ThingInfoLookup[thing.type].sprite}`)
        if (thing.type === 5 || thing.type === 40) {
            G.player.keys.blue = true
        }
        if (thing.type === 13 || thing.type === 38) {
            G.player.keys.red = true
        }
        if (thing.type === 6 || thing.type === 39) {
            G.player.keys.yellow = true
        }
    })
}
