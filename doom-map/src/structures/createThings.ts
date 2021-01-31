import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
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
    atlas: TextureAtlas,
    blockmap: BlockMap,
    sectors: Sector[],
    data: SectorGeometryData[],
    wadThing: WadThing,
    index: number
): Thing => {
    const info = getInfo(wadThing.thingType)

    const sector = sectors.find((_, index) => thingInSector(data[index], wadThing))
    if (sector === undefined) {
        throw new Error(`Unable to find sector for thing ${index}`)
    }

    const block = getBlock(blockmap, [wadThing.x, -wadThing.y])
    if (info.sprite === '-') {
        return newThing(index, wadThing.thingType, undefined, sector, block)
    }

    const geometry = createSprite(atlas, info.sprite, info.sequence)
    geometry.position = [wadThing.x, sector.floorHeight, -wadThing.y]
    geometry.rotation = ((wadThing.angle - 90) * Math.PI) / 180.0
    geometry.light = sector.lightLevel

    return newThing(index, wadThing.thingType, geometry, sector, block)
}

export const createThings = (
    atlas: TextureAtlas,
    { things }: WadMapLump,
    sectors: Sector[],
    data: SectorGeometryData[],
    blockmap: BlockMap,
    flags: MapFlags
): Thing[] =>
    things
        .filter((thing) => {
            const multi = !thing.flags.multiplayerOnly || flags.multiplayer
            const skill =
                (thing.flags.skill12 && flags.skill === SkillType.skill12) ||
                (thing.flags.skill3 && flags.skill === SkillType.skill3) ||
                (thing.flags.skill45 && flags.skill === SkillType.skill45)

            return multi && skill
        })
        .map((thing, index) => createThing(atlas, blockmap, sectors, data, thing, index))
