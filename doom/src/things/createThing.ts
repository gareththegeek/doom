import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { createSprite } from 'doom-video'
import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { WadThing } from 'doom-wad/dist/interfaces/WadThingsLump'
import { SectorThing } from 'doom-map/dist/interfaces/SectorInfo'
import { Sector } from '../interfaces/Sector'
import { Thing } from '../interfaces/Thing'
import { ThingInfo, ThingInfoLookup } from './ThingInfoLookup'
import { Block, BlockMap } from '../interfaces/BlockMap'
import { getBlock } from '../blockmap/getBlock'
import { Geometry } from 'doom-video/dist/scene/Geometry'

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
    gl: WebGL2RenderingContext,
    atlas: TextureAtlas,
    blockmap: BlockMap,
    sector: Sector,
    wadThing: WadThing,
    index: number
): Thing => {
    const info = getInfo(wadThing.thingType)

    const block = getBlock(blockmap, [wadThing.x, -wadThing.y])

    if (info.sprite === '-') {
        return newThing(index, wadThing.thingType, undefined, sector, block)
    }

    const geometry = createSprite(gl, atlas, info.sprite, info.sequence)
    geometry.position = [wadThing.x, sector.floorHeight, -wadThing.y]
    //TODO is wad angle === rotation?
    geometry.rotation = ((wadThing.angle - 90) * Math.PI) / 180.0
    geometry.light = sector.lightLevel

    return newThing(index, wadThing.thingType, geometry, sector, block)
}

export const createThings = (
    gl: WebGL2RenderingContext,
    atlas: TextureAtlas,
    map: WadMapLump,
    sectors: Sector[],
    blockmap: BlockMap,
    sectorThings: SectorThing[][]
): Thing[] =>
    sectorThings
        .flat()
        .filter((st) => {
            const thing = map.things[st.thing]
            return !thing.flags.multiplayerOnly && thing.flags.skill45
        })
        .map((st) => createThing(gl, atlas, blockmap, sectors[st.sector], map.things[st.thing], st.thing))
