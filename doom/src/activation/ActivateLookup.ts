import { Line, Sector } from '../interfaces/Sector'
import {
    ceiling_raise_to,
    crusher_start_with,
    crusher_stop,
    door_close_stay,
    door_close_stay_open,
    door_close_wait_open,
    door_open_stay,
    door_open_wait_close,
    exit_level,
    exit_to_secret_level,
    floor_lower_to,
    floor_raise_by,
    floor_raise_donut,
    floor_raise_to,
    floor_start_moving_up_and_down,
    floor_stop_moving,
    lift_lower_wait_raise,
    light_change_to,
    light_start_blinking,
    stairs_raise_by,
    teleport_monsters_only
} from './actions'
import { teleport } from './actions/teleport'
import {
    above_floor,
    above_highest_floor,
    below_lowest_ceiling,
    brightest_adjacent,
    ceiling_lower_to,
    darkest_adjacent,
    floor,
    highest_ceiling,
    highest_floor,
    lowest_ceiling,
    lowest_floor,
    next_higher_floor,
    shortest_lower_texture,
    v
} from './amounts'
import { d1, d1_blue, d1_red, d1_yellow, dr, dr_blue, dr_red, dr_yellow, g1, gr, s1, sr, w1, wr } from './triggers'

export enum ActivationType {
    Switch,
    Walk,
    Gun
}

export type ActivateTrigger = (type: ActivationType, line: Line) => Sector[]
export type ActivateHandler = (sector: Sector) => void
export type ActivateAmountHandler = (sector: Sector, amount: number, flag?: boolean) => void

type ActivateLookupEntry = {
    trigger: ActivateTrigger
    handler: ActivateHandler
}

const a = (trigger: ActivateTrigger, handler: ActivateHandler): ActivateLookupEntry => ({
    trigger,
    handler
})

// Curry - (abbreviated for sanity in the table below)
const c = (handler: ActivateAmountHandler, amount: (sector: Sector) => number, flag?: boolean): ActivateHandler => (sector: Sector) =>
    handler(sector, amount(sector), flag)

// Curry relative - (abbreviated for sanity in the table below)
const cr = (
    handler: ActivateAmountHandler,
    offset: number,
    relativeAmount: (sector: Sector, offset: number) => number
): ActivateHandler => (sector: Sector) => handler(sector, relativeAmount(sector, offset))

const DOOR_SPEED_SLOW = 70
const DOOR_SPEED_FAST = DOOR_SPEED_SLOW * 2
const FAST_DAMAGE = 2 //TODO
const SLOW_DAMAGE = 1 //TODO

export const ActivateLookup: { [special: number]: ActivateLookupEntry } = {
    1: a(dr, c(door_open_wait_close, v(DOOR_SPEED_SLOW))),
    2: a(w1, c(door_open_stay, v(DOOR_SPEED_SLOW))),
    3: a(w1, c(door_close_stay, v(DOOR_SPEED_SLOW))),
    4: a(w1, c(door_open_wait_close, v(DOOR_SPEED_SLOW))),
    5: a(w1, c(floor_raise_to, lowest_ceiling)),
    6: a(w1, c(crusher_start_with, v(FAST_DAMAGE))),
    7: a(s1, c(stairs_raise_by, v(8))),
    8: a(w1, c(stairs_raise_by, v(8))),
    9: a(s1, floor_raise_donut),
    10: a(w1, lift_lower_wait_raise),
    11: a(s1, exit_level),
    12: a(w1, c(light_change_to, brightest_adjacent)),
    13: a(w1, c(light_change_to, v(255))),
    14: a(s1, c(floor_raise_by, v(32), true)),
    15: a(s1, c(floor_raise_by, v(24), true)),
    16: a(w1, c(door_close_wait_open, v(DOOR_SPEED_SLOW))),
    17: a(w1, light_start_blinking),
    18: a(s1, c(floor_raise_to, next_higher_floor)),
    19: a(w1, c(floor_lower_to, highest_floor)),
    20: a(s1, c(floor_raise_to, next_higher_floor, true)),
    21: a(s1, lift_lower_wait_raise),
    22: a(w1, c(floor_raise_to, next_higher_floor, true)),
    23: a(s1, c(floor_lower_to, lowest_floor)),
    24: a(g1, c(floor_raise_to, lowest_ceiling)),
    25: a(w1, c(crusher_start_with, v(SLOW_DAMAGE))),
    26: a(dr_blue, c(door_open_wait_close, v(DOOR_SPEED_SLOW))),
    27: a(dr_yellow, c(door_open_wait_close, v(DOOR_SPEED_SLOW))),
    28: a(dr_red, c(door_open_wait_close, v(DOOR_SPEED_SLOW))),
    29: a(s1, c(door_open_wait_close, v(DOOR_SPEED_SLOW))),
    30: a(w1, c(floor_raise_by, shortest_lower_texture)),
    31: a(d1, c(door_open_stay, v(DOOR_SPEED_SLOW))),
    32: a(d1_blue, c(door_open_stay, v(DOOR_SPEED_SLOW))),
    33: a(d1_red, c(door_open_stay, v(DOOR_SPEED_SLOW))),
    34: a(d1_yellow, c(door_open_stay, v(DOOR_SPEED_SLOW))),
    35: a(w1, c(light_change_to, v(35))),
    36: a(w1, cr(floor_lower_to, 8, above_highest_floor)),
    37: a(w1, c(floor_lower_to, lowest_floor, true)),
    38: a(w1, c(floor_lower_to, lowest_floor)),
    39: a(w1, teleport),
    40: a(w1, c(ceiling_raise_to, highest_ceiling)),
    41: a(s1, c(ceiling_lower_to, floor)),
    42: a(sr, c(door_open_stay, v(DOOR_SPEED_SLOW))),
    43: a(sr, c(ceiling_lower_to, floor)),
    44: a(w1, cr(ceiling_lower_to, 8, above_floor)),
    45: a(sr, c(floor_lower_to, highest_floor)),
    46: a(gr, c(door_open_stay, v(DOOR_SPEED_SLOW))),
    47: a(g1, c(floor_raise_to, next_higher_floor, true)),
    //TODO 48: Scroll Texture Left
    49: a(s1, cr(ceiling_lower_to, 8, above_floor)),
    50: a(s1, c(door_close_stay, v(DOOR_SPEED_SLOW))),
    51: a(s1, exit_to_secret_level),
    52: a(w1, exit_level),
    53: a(w1, floor_start_moving_up_and_down),
    54: a(w1, floor_stop_moving),
    55: a(s1, cr(floor_raise_to, 8, below_lowest_ceiling)),
    56: a(w1, cr(floor_raise_to, 8, below_lowest_ceiling)),
    57: a(w1, crusher_stop),
    58: a(w1, c(floor_raise_by, v(24))),
    59: a(w1, c(floor_raise_by, v(24), true)),
    60: a(sr, c(floor_lower_to, lowest_floor)),
    61: a(sr, c(door_open_stay, v(DOOR_SPEED_SLOW))),
    62: a(sr, lift_lower_wait_raise),
    63: a(sr, c(door_open_wait_close, v(DOOR_SPEED_SLOW))),
    64: a(sr, c(floor_raise_to, lowest_ceiling)),
    65: a(sr, cr(floor_raise_to, 8, below_lowest_ceiling)),
    66: a(sr, c(floor_raise_by, v(24), true)),
    67: a(sr, c(floor_raise_by, v(32), true)),
    68: a(sr, c(floor_raise_to, next_higher_floor, true)),
    69: a(sr, c(floor_raise_to, next_higher_floor)),
    70: a(sr, cr(floor_lower_to, 8, above_highest_floor)),
    71: a(s1, cr(floor_lower_to, 8, above_highest_floor)),
    72: a(wr, cr(ceiling_lower_to, 8, above_floor)),
    73: a(wr, c(crusher_start_with, v(SLOW_DAMAGE))),
    74: a(wr, crusher_stop),
    75: a(wr, c(door_close_stay, v(DOOR_SPEED_SLOW))),
    76: a(wr, c(door_close_stay_open, v(DOOR_SPEED_SLOW))),
    77: a(wr, c(crusher_start_with, v(FAST_DAMAGE))),
    79: a(wr, c(light_change_to, v(35))),
    80: a(wr, c(light_change_to, brightest_adjacent)),
    81: a(wr, c(light_change_to, v(255))),
    82: a(wr, c(floor_lower_to, lowest_floor)),
    83: a(wr, c(floor_lower_to, highest_floor)),
    84: a(wr, c(floor_lower_to, lowest_floor, true)),
    86: a(wr, c(door_open_stay, v(DOOR_SPEED_SLOW))),
    87: a(wr, floor_start_moving_up_and_down),
    88: a(wr, lift_lower_wait_raise),
    89: a(wr, floor_stop_moving),
    90: a(wr, c(door_open_wait_close, v(DOOR_SPEED_SLOW))),
    91: a(wr, c(floor_raise_to, lowest_ceiling)),
    92: a(wr, c(floor_raise_by, v(24))),
    93: a(wr, c(floor_raise_by, v(24), true)),
    94: a(wr, cr(floor_raise_to, 8, below_lowest_ceiling)),
    95: a(wr, c(floor_raise_to, next_higher_floor, true)),
    96: a(wr, c(floor_raise_by, shortest_lower_texture)),
    97: a(wr, teleport),
    98: a(wr, cr(floor_lower_to, 8, above_highest_floor)),
    99: a(sr, c(door_open_stay, v(DOOR_SPEED_FAST))), //TODO sr door (blue)?
    100: a(w1, c(stairs_raise_by, v(16))), //TODO fast
    101: a(s1, c(floor_raise_to, lowest_ceiling)),
    102: a(s1, c(floor_lower_to, highest_floor)),
    103: a(s1, c(door_open_stay, v(DOOR_SPEED_SLOW))),
    104: a(w1, c(light_change_to, darkest_adjacent)),
    105: a(wr, c(door_open_wait_close, v(DOOR_SPEED_FAST))),
    106: a(wr, c(door_open_stay, v(DOOR_SPEED_FAST))),
    107: a(wr, c(door_close_stay, v(DOOR_SPEED_FAST))),
    108: a(w1, c(door_open_wait_close, v(DOOR_SPEED_FAST))),
    109: a(w1, c(door_open_stay, v(DOOR_SPEED_FAST))),
    110: a(w1, c(door_close_stay, v(DOOR_SPEED_FAST))),
    111: a(s1, c(door_open_wait_close, v(DOOR_SPEED_FAST))),
    112: a(s1, c(door_open_stay, v(DOOR_SPEED_FAST))),
    113: a(s1, c(door_close_stay, v(DOOR_SPEED_FAST))),
    114: a(sr, c(door_open_wait_close, v(DOOR_SPEED_FAST))),
    115: a(sr, c(door_open_stay, v(DOOR_SPEED_FAST))),
    116: a(sr, c(door_close_stay, v(DOOR_SPEED_FAST))),
    117: a(dr, c(door_open_wait_close, v(DOOR_SPEED_FAST))),
    118: a(d1, c(door_open_stay, v(DOOR_SPEED_FAST))),
    119: a(w1, c(floor_raise_to, next_higher_floor)),
    120: a(wr, lift_lower_wait_raise), //TODO fast
    121: a(w1, lift_lower_wait_raise), //TODO fast
    122: a(s1, lift_lower_wait_raise), //TODO fast
    123: a(sr, lift_lower_wait_raise), //TODO fast
    124: a(w1, exit_to_secret_level),
    125: a(w1, teleport_monsters_only),
    126: a(wr, teleport_monsters_only),
    127: a(s1, c(stairs_raise_by, v(16))), //TODO fast
    128: a(wr, c(floor_raise_to, next_higher_floor)),
    129: a(wr, c(floor_raise_to, next_higher_floor)), //TODO fast
    130: a(w1, c(floor_raise_to, next_higher_floor)), //TODO fast
    131: a(s1, c(floor_raise_to, next_higher_floor)), //TODO fast
    132: a(sr, c(floor_raise_to, next_higher_floor)), //TODO fast
    133: a(s1, c(door_open_stay, v(DOOR_SPEED_FAST))), //TODO s1 blue?
    134: a(sr, c(door_open_stay, v(DOOR_SPEED_FAST))), //TODO sr blue?
    135: a(s1, c(door_open_stay, v(DOOR_SPEED_FAST))), //TODO s1 red?
    136: a(sr, c(door_open_stay, v(DOOR_SPEED_FAST))), //TODO sr yellow?
    137: a(s1, c(door_open_stay, v(DOOR_SPEED_FAST))), //TODO s1 yellow?
    138: a(sr, c(light_change_to, v(255))),
    139: a(sr, c(light_change_to, v(35))),
    140: a(s1, c(floor_raise_by, v(512))),
    141: a(w1, c(crusher_start_with, v(SLOW_DAMAGE)))
}
