import { forEachLinkedList, LinkedList } from 'low-mem'
import { Intersection } from '../collisions/collisionCheck'
import { G } from '../global'
import { ObjectFlags } from '../interfaces/ObjectInfo'
import { Physics } from '../interfaces/State'
import { removeStateful } from '../state/removeStateful'

const pickupable = (flags: ObjectFlags): boolean => flags.special || flags.countitem || flags.pickup || flags.dropped

const pickup = (intersection: Intersection): void => {
    if (intersection.isLine) {
        return
    }
    const stateful = intersection.collider as Physics

    if (!pickupable(stateful.info.flags)) {
        return
    }

    const { block, geometry, state, thing } = stateful
    if (block === undefined) {
        return
    }
    geometry.visible = false
    removeStateful(stateful)

    console.info(`Picked up ${state.spriteName}`)

    if (thing === undefined) {
        return
    }

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

export const pickups = (intersections: LinkedList<Intersection>): void => {
    forEachLinkedList(intersections, pickup)
}
