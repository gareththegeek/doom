import { forEachLinkedList, LinkedList } from 'low-mem'
import { removeFromBlock } from '../collisions/removeFromBlock'
import { removeFromSector } from '../collisions/removeFromSector'
import { G } from '../global'
import { ObjectFlags } from '../interfaces/ObjectInfo'
import { StatefulObjectThing } from '../interfaces/State'

const pickupable = (flags: ObjectFlags): boolean => flags.special || flags.countitem || flags.pickup || flags.dropped

const pickup = (stateful: StatefulObjectThing): void => {
    if (!pickupable(stateful.info.flags)) {
        return
    }

    const { block, geometry, state, thing } = stateful
    if (block === undefined) {
        return
    }
    removeFromBlock(stateful)
    removeFromSector(stateful)
    geometry.visible = false

    console.info(`Picked up ${state.spriteName}`)
    const { type } = thing
    const { playerState } = G.player
    if (type === 5 || type === 40) {
        playerState.keys.blue = true
    }
    if (type === 13 || type === 38) {
        playerState.keys.red = true
    }
    if (type === 6 || type === 39) {
        playerState.keys.yellow = true
    }
}

export const pickups = (statefuls: LinkedList<StatefulObjectThing>): void => {
    forEachLinkedList(statefuls, pickup)
}
