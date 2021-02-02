import { Line, Sector } from 'doom-map'
import { door_open_stay, floor_lowers } from './actions'
import { d1, s1, w1 } from './triggers'

export enum ActivationType {
    Switch,
    Walk
}

export type ActivateTrigger = (type: ActivationType, line: Line) => Sector | undefined
export type ActivateHandler = (sector: Sector) => void

type ActivateLookupEntry = {
    trigger: ActivateTrigger
    handler: ActivateHandler
}

const a = (trigger: ActivateTrigger, handler: ActivateHandler): ActivateLookupEntry => ({
    trigger,
    handler
})

export const ActivateLookup: { [special: number]: ActivateLookupEntry } = {
    1: a(d1, door_open_stay),
    2: a(w1, door_open_stay),
    3: a(w1, door_open_stay),
    4: a(w1, door_open_stay),
    10: a(w1, floor_lowers),
    19: a(w1, floor_lowers),
    21: a(s1, floor_lowers),
    23: a(s1, floor_lowers),
    26: a(d1, door_open_stay),
    27: a(d1, door_open_stay),
    28: a(d1, door_open_stay),
    29: a(s1, door_open_stay),
    31: a(d1, door_open_stay),
    32: a(d1, door_open_stay),
    33: a(d1, door_open_stay),
    34: a(d1, door_open_stay),
    36: a(w1, floor_lowers),
    37: a(w1, floor_lowers),
    38: a(w1, floor_lowers),
    45: a(s1, floor_lowers),
    60: a(s1, floor_lowers),
    61: a(s1, door_open_stay),
    62: a(s1, floor_lowers),
    63: a(s1, door_open_stay),
    70: a(s1, floor_lowers),
    71: a(s1, floor_lowers),
    82: a(w1, floor_lowers),
    83: a(w1, floor_lowers),
    84: a(w1, floor_lowers),
    86: a(w1, door_open_stay),
    88: a(w1, floor_lowers),
    98: a(w1, floor_lowers),
    99: a(s1, door_open_stay),
    102: a(s1, floor_lowers),
    103: a(s1, door_open_stay),
    105: a(w1, door_open_stay),
    106: a(w1, door_open_stay),
    108: a(w1, door_open_stay),
    109: a(w1, door_open_stay),
    111: a(s1, door_open_stay),
    112: a(s1, door_open_stay),
    114: a(s1, door_open_stay),
    115: a(s1, door_open_stay),
    117: a(d1, door_open_stay),
    118: a(d1, door_open_stay),
    120: a(w1, floor_lowers),
    121: a(w1, floor_lowers),
    122: a(s1, floor_lowers),
    123: a(s1, floor_lowers),
    133: a(s1, door_open_stay),
    134: a(s1, door_open_stay),
    135: a(s1, door_open_stay),
    136: a(s1, door_open_stay),
    137: a(s1, door_open_stay)
}
