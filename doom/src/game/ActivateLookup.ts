import { Line } from 'doom-map'
import { d1_door_open_stay } from './d1_door_open_stay'
import { s1_door_open_stay } from './s1_door_open_stay'
import { s1_floor_lowers } from './s1_floor_lowers'
import { w1_door_open_stay } from './w1_door_open_stay'
import { w1_floor_lowers } from './w1_floor_lowers'

export enum ActivationType {
    Switch,
    Walk
}

export type ActivateHandler = (type: ActivationType, line: Line) => void

export const ActivateLookup: { [special: number]: ActivateHandler } = {
    1: d1_door_open_stay,
    2: w1_door_open_stay,
    3: w1_door_open_stay,
    4: w1_door_open_stay,
    10: w1_floor_lowers,
    19: w1_floor_lowers,
    21: s1_floor_lowers,
    23: s1_floor_lowers,
    26: d1_door_open_stay,
    27: d1_door_open_stay,
    28: d1_door_open_stay,
    29: s1_door_open_stay,
    31: d1_door_open_stay,
    32: d1_door_open_stay,
    33: d1_door_open_stay,
    34: d1_door_open_stay,
    36: w1_floor_lowers,
    37: w1_floor_lowers,
    38: w1_floor_lowers,
    45: s1_floor_lowers,
    60: s1_floor_lowers,
    61: s1_door_open_stay,
    62: s1_floor_lowers,
    63: s1_door_open_stay,
    70: s1_floor_lowers,
    71: s1_floor_lowers,
    82: w1_floor_lowers,
    83: w1_floor_lowers,
    84: w1_floor_lowers,
    86: w1_door_open_stay,
    88: w1_floor_lowers,
    98: w1_floor_lowers,
    99: s1_door_open_stay,
    102: s1_floor_lowers,
    103: s1_door_open_stay,
    105: w1_door_open_stay,
    106: w1_door_open_stay,
    108: w1_door_open_stay,
    109: w1_door_open_stay,
    111: s1_door_open_stay,
    112: s1_door_open_stay,
    114: s1_door_open_stay,
    115: s1_door_open_stay,
    117: d1_door_open_stay,
    118: d1_door_open_stay,
    120: w1_floor_lowers,
    121: w1_floor_lowers,
    122: s1_floor_lowers,
    123: s1_floor_lowers,
    133: s1_door_open_stay,
    134: s1_door_open_stay,
    135: s1_door_open_stay,
    136: s1_door_open_stay,
    137: s1_door_open_stay
}
