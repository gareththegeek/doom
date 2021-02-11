import { Line } from '../interfaces/Sector'
import { StatefulObjectThing } from '../interfaces/State'
import { Intersection } from './collisionCheck'
import { isSolidForThing } from './isSolidForThing'

export const isSolidForMonster = (actor: StatefulObjectThing, intersection: Intersection): boolean => {
    if (intersection.isLine) {
        const line = intersection.collider as Line
        if (line.flags.blocksMonstersOnly) {
            return true
        }
    }

    return isSolidForThing(actor, intersection)
}
