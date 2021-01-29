export interface ThingInfo {
    width: number
    height: number
    sprite: string
    sequence: string
    monster: boolean
    obstacle: boolean
    flying: boolean
    ceiling: boolean
    pickup: boolean
    weapon: boolean
    artifact: boolean
}

const t = (
    width: number,
    height: number,
    sprite: string,
    sequence: string,
    monster: boolean,
    obstacle: boolean,
    flying: boolean,
    ceiling: boolean,
    pickup: boolean,
    weapon: boolean,
    artifact: boolean
): ThingInfo => ({
    width,
    height,
    sprite,
    sequence,
    monster,
    obstacle,
    flying,
    ceiling,
    pickup,
    weapon,
    artifact
})

// This guy should help
//https://github.com/id-Software/DOOM/blob/77735c3ff0772609e9c8d29e3ce2ab42ff54d20b/linuxdoom-1.10/info.c
// Also this dude
//https://github.com/id-Software/DOOM/blob/77735c3ff0772609e9c8d29e3ce2ab42ff54d20b/linuxdoom-1.10/p_enemy.c

export const ThingInfoLookup: { [type: number]: ThingInfo } = {
    1: t(16, 56, 'play', 'a', false, false, false, false, false, false, false), //	Player 1 start
    2: t(16, 56, 'play', 'a', false, false, false, false, false, false, false), //	Player 2 start
    3: t(16, 56, 'play', 'a', false, false, false, false, false, false, false), //	Player 3 start
    4: t(16, 56, 'play', 'a', false, false, false, false, false, false, false), //	Player 4 start
    5: t(20, 16, 'bkey', 'ab', false, false, false, false, true, false, false), //	Blue keycard
    6: t(20, 16, 'ykey', 'ab', false, false, false, false, true, false, false), //	Yellow keycard
    7: t(128, 100, 'spid', 'ab', true, true, false, false, false, false, false), //	SpiderdeMO
    8: t(20, 16, 'bpak', 'a', false, false, false, false, true, false, false), //	Backpack
    9: t(20, 56, 'spos', 'ab', true, true, false, false, false, false, false), //	Shotgun guy
    10: t(20, 16, 'play', 'w', false, false, false, false, false, false, false), //	Bloody mess
    11: t(16, 56, '-', '', false, false, false, false, false, false, false), //	deathmatch start
    12: t(20, 16, 'play', 'w', false, false, false, false, false, false, false), //	Bloody mess
    13: t(20, 16, 'rkey', 'ab', false, false, false, false, true, false, false), //	Red keycard
    14: t(20, 16, '-', '', false, false, false, false, false, false, false), //	teleport landing
    15: t(20, 16, 'play', 'n', false, false, false, false, false, false, false), //	Dead player
    16: t(40, 110, 'cybr', 'ab', true, true, false, false, false, false, false), //	CyberdeMO
    17: t(20, 16, 'celp', 'a', false, false, false, false, true, false, false), //	Energy cell pack
    18: t(20, 16, 'poss', 'l', false, false, false, false, false, false, false), //	Dead former human
    19: t(20, 16, 'spos', 'l', false, false, false, false, false, false, false), //	Dead former sergeant
    20: t(20, 16, 'troo', 'm', false, false, false, false, false, false, false), //	Dead imp
    21: t(20, 16, 'sarg', 'n', false, false, false, false, false, false, false), //	Dead deMO
    22: t(20, 16, 'head', 'l', false, false, false, false, false, false, false), //	Dead cacodeMO
    23: t(20, 16, 'skul', 'k', false, false, false, false, false, false, false), //	Dead lost soul (invisible)
    24: t(20, 16, 'pol5', 'a', false, false, false, false, false, false, false), //	Pool of blood and flesh
    25: t(16, 16, 'pol1', 'a', false, true, false, false, false, false, false), //	Impaled human
    26: t(16, 16, 'pol6', 'ab', false, true, false, false, false, false, false), //	Twitching impaled human
    27: t(16, 16, 'pol4', 'a', false, true, false, false, false, false, false), //	Skull on a pole
    28: t(16, 16, 'pol2', 'a', false, true, false, false, false, false, false), //	Five skulls "shish kebab"
    29: t(16, 16, 'pol3', 'ab', false, true, false, false, false, false, false), //	Pile of skulls and candles
    30: t(16, 16, 'col1', 'a', false, true, false, false, false, false, false), //	Tall green pillar
    31: t(16, 16, 'col2', 'a', false, true, false, false, false, false, false), //	Short green pillar
    32: t(16, 16, 'col3', 'a', false, true, false, false, false, false, false), //	Tall red pillar
    33: t(16, 16, 'col4', 'a', false, true, false, false, false, false, false), //	Short red pillar
    34: t(20, 16, 'cand', 'a', false, false, false, false, false, false, false), //	Candle
    35: t(16, 16, 'cbra', 'a', false, true, false, false, false, false, false), //	Candelabra
    36: t(16, 16, 'col5', 'ab', false, true, false, false, false, false, false), //	Short green pillar with beating heart
    37: t(16, 16, 'col6', 'a', false, true, false, false, false, false, false), //	Short red pillar with skull
    38: t(20, 16, 'rsku', 'ab', false, false, false, false, true, false, false), //	Red skull key
    39: t(20, 16, 'ysku', 'ab', false, false, false, false, true, false, false), //	Yellow skull key
    40: t(20, 16, 'bsku', 'ab', false, false, false, false, true, false, false), //	Blue skull key
    41: t(16, 16, 'ceye', 'abcb', false, true, false, false, false, false, false), //	Evil eye
    42: t(16, 16, 'fsku', 'abc', false, true, false, false, false, false, false), //	Floating skull
    43: t(16, 16, 'tre1', 'a', false, true, false, false, false, false, false), //	Burnt tree
    44: t(16, 16, 'tblu', 'abcd', false, true, false, false, false, false, false), //	Tall blue firestick
    45: t(16, 16, 'tgrn', 'abcd', false, true, false, false, false, false, false), //	Tall green firestick
    46: t(16, 16, 'tred', 'abcd', false, true, false, false, false, false, false), //	Tall red firestick
    47: t(16, 16, 'smit', 'a', false, true, false, false, false, false, false), //	Brown stump
    48: t(16, 16, 'elec', 'a', false, true, false, false, false, false, false), //	Tall techno column
    49: t(16, 68, 'gor1', 'abcb', false, true, false, true, false, false, false), //	Hanging victim, twitching
    50: t(16, 84, 'gor2', 'a', false, true, false, true, false, false, false), //	Hanging victim, arms out
    51: t(16, 84, 'gor3', 'a', false, true, false, true, false, false, false), //	Hanging victim, one-legged
    52: t(16, 68, 'gor4', 'a', false, true, false, true, false, false, false), //	Hanging pair of legs
    53: t(16, 52, 'gor5', 'a', false, true, false, true, false, false, false), //	Hanging leg
    54: t(32, 16, 'tre2', 'a', false, true, false, false, false, false, false), //	Large brown tree
    55: t(16, 16, 'smbt', 'abcd', false, true, false, false, false, false, false), //	Short blue firestick
    56: t(16, 16, 'smgt', 'abcd', false, true, false, false, false, false, false), //	Short green firestick
    57: t(16, 16, 'smrt', 'abcd', false, true, false, false, false, false, false), //	Short red firestick
    58: t(30, 56, 'sarg', 'ab', true, true, false, false, false, false, false), //	Spectre
    59: t(20, 84, 'gor2', 'a', false, false, false, true, false, false, false), //	Hanging victim, arms out
    60: t(20, 68, 'gor4', 'a', false, false, false, true, false, false, false), //	Hanging pair of legs
    61: t(20, 52, 'gor3', 'a', false, false, false, true, false, false, false), //	Hanging victim, one-legged
    62: t(20, 52, 'gor5', 'a', false, false, false, true, false, false, false), //	Hanging leg
    63: t(20, 68, 'gor1', 'abcb', false, false, false, true, false, false, false), //	Hanging victim, twitching
    64: t(20, 56, 'vile', 'ab', true, true, false, false, false, false, false), //	Arch-vile
    65: t(20, 56, 'cpos', 'ab', true, true, false, false, false, false, false), //	Heavy weapon dude
    66: t(20, 56, 'skel', 'ab', true, true, false, false, false, false, false), //	Revenant
    67: t(48, 64, 'fatt', 'ab', true, true, false, false, false, false, false), //	Mancubus
    68: t(64, 64, 'bspi', 'ab', true, true, false, false, false, false, false), //	Arachnotron
    69: t(24, 64, 'bos2', 'ab', true, true, false, false, false, false, false), //	Hell knight
    70: t(16, 16, 'fcan', 'abc', false, true, false, false, false, false, false), //	Burning barrel
    71: t(31, 56, 'pain', 'a', true, true, true, false, false, false, false), //	Pain elemental
    72: t(16, 72, 'keen', 'a', true, true, false, true, false, false, false), //	Commander Keen
    73: t(16, 88, 'hdb1', 'a', false, true, false, true, false, false, false), //	Hanging victim, guts reMO
    74: t(16, 88, 'hdb2', 'a', false, true, false, true, false, false, false), //	Hanging victim, guts and brain reMO
    75: t(16, 64, 'hdb3', 'a', false, true, false, true, false, false, false), //	Hanging torso, looking down
    76: t(16, 64, 'hdb4', 'a', false, true, false, true, false, false, false), //	Hanging torso, open skull
    77: t(16, 64, 'hdb5', 'a', false, true, false, true, false, false, false), //	Hanging torso, looking up
    78: t(16, 64, 'hdb6', 'a', false, true, false, true, false, false, false), //	Hanging torso, brain reMO
    79: t(20, 16, 'pob1', 'a', false, false, false, false, false, false, false), //	Pool of blood
    80: t(20, 16, 'pob2', 'a', false, false, false, false, false, false, false), //	Pool of blood
    81: t(20, 16, 'brs1', 'a', false, false, false, false, false, false, false), //	Pool of brains
    82: t(20, 16, 'sgn2', 'a', false, false, false, false, true, true, false), //	Super shotgun
    83: t(20, 16, 'mega', 'abcd', false, false, false, false, true, false, true), //	Megasphere
    84: t(20, 56, 'sswv', 'ab', true, true, false, false, false, false, false), //	Wolfenstein SS
    85: t(16, 16, 'tlmp', 'abcd', false, true, false, false, false, false, false), //	Tall techno floor lamp
    86: t(16, 16, 'tlp2', 'abcd', false, true, false, false, false, false, false), //	Short techno floor lamp
    87: t(20, 32, '-', '', false, false, false, false, false, false, false), //	spawn spot
    88: t(16, 16, 'bbrn', 'a', false, true, false, false, false, false, false), //	Romero's head
    89: t(20, 32, '-', '', false, false, false, false, false, false, false), //	mo
    2001: t(20, 16, 'shot', 'a', false, false, false, false, true, true, false), //	Shotgun
    2002: t(20, 16, 'mgun', 'a', false, false, false, false, true, true, false), //	Chaingun
    2003: t(20, 16, 'laun', 'a', false, false, false, false, true, true, false), //	Rocket launcher
    2004: t(20, 16, 'plas', 'a', false, false, false, false, true, true, false), //	Plasma gun
    2005: t(20, 16, 'csaw', 'a', false, false, false, false, true, true, false), //	Chainsaw
    2006: t(20, 16, 'bfug', 'a', false, false, false, false, true, true, false), //	BFG9000
    2007: t(20, 16, 'clip', 'a', false, false, false, false, true, false, false), //	Clip
    2008: t(20, 16, 'shel', 'a', false, false, false, false, true, false, false), //	4 shotgun shells
    2010: t(20, 16, 'rock', 'a', false, false, false, false, true, false, false), //	Rocket
    2011: t(20, 16, 'stim', 'a', false, false, false, false, true, false, false), //	Stimpack
    2012: t(20, 16, 'medi', 'a', false, false, false, false, true, false, false), //	Medikit
    2013: t(20, 16, 'soul', 'abcdcb', false, false, false, false, true, false, true), //	Supercharge
    2014: t(20, 16, 'bon1', 'abcdcb', false, false, false, false, true, false, true), //	Health bonus
    2015: t(20, 16, 'bon2', 'abcdcb', false, false, false, false, true, false, true), //	ArMO
    2018: t(20, 16, 'arm1', 'ab', false, false, false, false, true, false, false), //	ArMO
    2019: t(20, 16, 'arm2', 'ab', false, false, false, false, true, false, false), //	MegaarMO
    2022: t(20, 16, 'pinv', 'abcd', false, false, false, false, true, false, true), //	Invulnerability
    2023: t(20, 16, 'pstr', 'a', false, false, false, false, true, false, true), //	Berserk
    2024: t(20, 16, 'pins', 'abcd', false, false, false, false, true, false, true), //	Partial invisibility
    2025: t(20, 16, 'suit', 'a', false, false, false, false, true, false, false), //	Radiation shielding suit
    2026: t(20, 16, 'pmap', 'abcdcb', false, false, false, false, true, false, true), //	Computer area map
    2028: t(16, 16, 'colu', 'a', false, true, false, false, false, false, false), //	Floor lamp
    2035: t(10, 42, 'bar1', 'ab', false, true, false, false, false, false, false), //	Exploding barrel
    2045: t(20, 16, 'pvis', 'ab', false, false, false, false, true, false, true), //	Light amplification visor
    2046: t(20, 16, 'brok', 'a', false, false, false, false, true, false, false), //	Box of rockets
    2047: t(20, 16, 'cell', 'a', false, false, false, false, true, false, false), //	Energy cell
    2048: t(20, 16, 'ammo', 'a', false, false, false, false, true, false, false), //	Box of bullets
    2049: t(20, 16, 'sbox', 'a', false, false, false, false, true, false, false), //	Box of shotgun shells
    3001: t(20, 56, 'troo', 'ab', true, true, false, false, false, false, false), //	Imp
    3002: t(30, 56, 'sarg', 'ab', true, true, false, false, false, false, false), //	DeMO
    3003: t(24, 64, 'boss', 'ab', true, true, false, false, false, false, false), //	Baron of Hell
    3004: t(20, 56, 'poss', 'ab', true, true, false, false, false, false, false), //	Zombieman
    3005: t(31, 56, 'head', 'a', true, true, true, false, false, false, false), //	CacodeMO
    3006: t(16, 56, 'skul', 'ab', true, true, true, false, false, false, false) //	Lost soul
}
