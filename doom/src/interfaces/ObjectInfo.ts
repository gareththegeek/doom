import { StateType } from "./StateType";

export interface ObjectFlags {
    special: boolean // Call P_SpecialThing when touched
    solid: boolean // Blocks
    shootable: boolean // Can be hit
    nosector: boolean // Invisible but touchable
    noblockmap: boolean // Inert but displayable
    ambush: boolean // Deaf monster
    justhit: boolean // Will try to attack right back
    justattacked: boolean // Will take at least one step before attacking
    spawnceiling: boolean // Hang from the ceiling
    nogravity: boolean // Unaffected by gravity
    dropoff: boolean // This allows jumps from high places
    pickup: boolean // For players will pick up items
    noclip: boolean // Player cheat
    slide: boolean // Keep info about sliding along walls
    float: boolean // Flying monsters
    teleport: boolean // Don't cross lines ???? or look at heights on teleport
    missile: boolean // Don't hit same species, explode on block.
    dropped: boolean // Dropped by a demon, not level spawned
    shadow: boolean // Invisibility
    noblood: boolean // Don't bleed when shot (use puff) e.g. barrel
    corpse: boolean // Don't stop moving halfway off a step, dead bodies slide all the way down
    infloat: boolean // Floating to a height for a move, ??? don't auto float to target's height
    countkill: boolean // On kill, count this enemy object towards intermission kill total
    countitem: boolean // On picking up count this item towards intermission item total
    skullfly: boolean // Special handling: skull in flight
    notdmatch: boolean // Don't spawn this object in death match mode
    translation: boolean // Colour translation in mp
}

export interface ObjectInfo {
    doomednum: number,
    spawnstate: StateType,
    spawnhealth: number,
    seestate: StateType,
    seesound: number,
    reactiontime: number,
    attacksound: number,
    painstate: StateType,
    painchance: number,
    painsound: number,
    meleestate: StateType,
    missilestate: StateType,
    deathstate: StateType,
    xdeathstate: StateType,
    deathsound: number,
    speed: number,
    radius: number,
    height: number,
    mass: number,
    damage: number,
    activesound: number,
    flags: ObjectFlags,
    raisestate: StateType
}