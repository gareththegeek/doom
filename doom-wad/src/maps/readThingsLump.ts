import { WadDirectoryEntry } from '../interfaces/WadDirectory'
import { WadThing, WadThingFlags } from '../interfaces/WadThingsLump'

const THINGS_SIZE = 10

const ThingOffset = {
    x: 0,
    y: 2,
    angle: 4,
    thingType: 6,
    flags: 8
}

const toThingFlags = (flagsByte: number): WadThingFlags => ({
    skill12: (flagsByte & 0x01) !== 0,
    skill3: (flagsByte & 0x02) !== 0,
    skill45: (flagsByte & 0x04) !== 0,
    deaf: (flagsByte & 0x08) !== 0,
    multiplayerOnly: (flagsByte & 0x10) !== 0
})

const readThing = (data: Buffer, offset: number): WadThing => ({
    x: data.readInt16LE(offset + ThingOffset.x),
    y: data.readInt16LE(offset + ThingOffset.y),
    angle: data.readInt16LE(offset + ThingOffset.angle),
    thingType: data.readInt16LE(offset + ThingOffset.thingType),
    flags: toThingFlags(data.readInt16LE(offset + ThingOffset.flags))
})

export const readThingsLump = (data: Buffer, entry: WadDirectoryEntry): WadThing[] => {
    const length = entry.size / THINGS_SIZE
    const things = []
    for (let i = 0; i < length; i++) {
        things.push(readThing(data, entry.filepos + i * THINGS_SIZE))
    }
    return things
}
