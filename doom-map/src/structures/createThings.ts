import { Geometry, createSprite } from 'doom-video'
import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { WadThing } from 'doom-wad/dist/interfaces/WadThingsLump'
import { Sector } from '../interfaces/Sector'
import { Thing } from '../interfaces/Thing'
import { ThingInfo, ThingInfoLookup } from './ThingInfoLookup'
import { Block, BlockMap } from '../interfaces/BlockMap'
import { getBlock } from './getBlock'
import { MapFlags, SkillType } from '../interfaces/MapFlags'
import { SectorGeometryData } from '../interfaces/SectorGeometryData'
import { thingInSector } from './thingInSector'
import { M } from '../global'

const getInfo = (type: number): ThingInfo => ThingInfoLookup[type]

const newThing = (index: number, type: number, geometry: Geometry | undefined, sector: Sector, block: Block): Thing => {
    const thing = {
        index,
        type,
        geometry,
        sector,
        block
    }

    sector.things.push(thing)
    block.things.push(thing)

    return thing
}

const createThing = (
    blockmap: BlockMap,
    sectors: Sector[],
    data: SectorGeometryData[],
    wadThing: WadThing,
    index: number
): Thing | undefined => {
    const info = getInfo(wadThing.thingType)
    
    const sector = sectors.find((_, si) => thingInSector(data[si], wadThing))
    if (sector === undefined) {
        // This happens sometimes (you know who I mean e4m3 thing #232)
        console.warn(`Unable to find sector for thing ${index}`)
        return undefined
    }

    const block = getBlock(blockmap, [wadThing.x, -wadThing.y])
    if (info.sprite === '-') {
        return newThing(index, wadThing.thingType, undefined, sector, block)
    }

    // const geometry = undefined
    const geometry = createSprite(M.atlas, info.sprite, info.sequence)
    geometry.position = [wadThing.x, sector.floorHeight, -wadThing.y]
    geometry.rotation = ((wadThing.angle - 90) * Math.PI) / 180.0
    geometry.light = sector.lightLevel

    return newThing(index, wadThing.thingType, geometry, sector, block)
}

const isDefined = (thing: Thing | undefined): thing is Thing => thing !== undefined

export const createThings = (
    { things }: WadMapLump,
    sectors: Sector[],
    data: SectorGeometryData[],
    blockmap: BlockMap,
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
