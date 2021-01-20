import { WadLump } from './WadLump'

export interface WadThingFlags {
    skill12: boolean
    skill3: boolean
    skill45: boolean
    deaf: boolean
    multiplayerOnly: boolean
}

export interface WadThing {
    x: number
    y: number
    angle: number
    thingType: number
    flags: WadThingFlags
}

export interface WadThingsLump extends WadLump {
    things: WadThing[]
}
