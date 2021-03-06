import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { WadThing } from 'doom-wad/dist/interfaces/WadThingsLump'
import { MapSector } from '../interfaces/MapSector'
import { Thing } from '../interfaces/Thing'
import { MapBlock, MapBlockMap } from '../interfaces/MapBlockMap'
import { getMapBlock } from './getMapBlock'
import { MapFlags, SkillType } from '../interfaces/MapFlags'
import { SectorGeometryData } from '../interfaces/SectorGeometryData'
import { thingInSector } from './thingInSector'
import { vec3 } from 'gl-matrix'

const newThing = (index: number, { thingType, x, y, angle }: WadThing, sector: MapSector, block: MapBlock): Thing => {
    const thing = {
        index,
        type: thingType,
        sector,
        block,
        spawnPosition: [x, sector.floorHeight, -y] as vec3,
        spawnAngle: (angle * Math.PI) / 180 //((angle - 90) * Math.PI) / 180.0
    }

    return thing
}

const createThing = (
    blockmap: MapBlockMap,
    sectors: MapSector[],
    data: SectorGeometryData[],
    wadThing: WadThing,
    index: number
): Thing | undefined => {
    const sector = sectors.find((_, si) => thingInSector(data[si], wadThing))
    if (sector === undefined) {
        // This happens sometimes (you know who I mean e4m3 thing #232)
        console.warn(`Unable to find sector for thing ${index}`)
        return undefined
    }

    const block = getMapBlock(blockmap, [wadThing.x, -wadThing.y])
    if (block === undefined) {
        console.warn(`Unable to find block for thing ${index}`)
        return undefined
    }

    return newThing(index, wadThing, sector, block)
}

const isDefined = (thing: Thing | undefined): thing is Thing => thing !== undefined

export const createThings = (
    { things }: WadMapLump,
    sectors: MapSector[],
    data: SectorGeometryData[],
    blockmap: MapBlockMap,
    flags: MapFlags
): Thing[] =>
    things
        .map((thing, index) => ({ thing, index }))
        .filter(({ thing }) => {
            const multi = !thing.flags.multiplayerOnly || flags.multiplayer
            const skill =
                (thing.flags.skill12 && flags.skill === SkillType.skill12) ||
                (thing.flags.skill3 && flags.skill === SkillType.skill3) ||
                (thing.flags.skill45 && flags.skill === SkillType.skill45)

            // Some maps (I'm looking at you e4m4) have the player start disabled for all difficulties :/
            return thing.thingType === 1 || (multi && skill)
        })
        .map(({ thing, index }) => createThing(blockmap, sectors, data, thing, index))
        .filter(isDefined)
