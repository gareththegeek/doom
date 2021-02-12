import { G } from '../global'
import { Physics, } from '../interfaces/State'
import { Intersection } from './collisionCheck'
import { isSolidForThing } from './isSolidForThing'

export const isSolidForPlayer = (actor: Physics, intersection: Intersection): boolean => {
    if (G.cheats.noclip) {
        return false
    }

    return isSolidForThing(actor, intersection)
}
