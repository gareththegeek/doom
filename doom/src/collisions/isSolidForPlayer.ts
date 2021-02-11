import { vec2 } from 'gl-matrix'
import { G } from '../global'
import { StatefulObjectThing } from '../interfaces/State'
import { Intersection } from './collisionCheck'
import { isSolidForThing } from './isSolidForThing'

export const isSolidForPlayer = (actor: StatefulObjectThing, intersection: Intersection): boolean => {
    if (G.cheats.noclip) {
        return false
    }

    return isSolidForThing(actor, intersection)
}
