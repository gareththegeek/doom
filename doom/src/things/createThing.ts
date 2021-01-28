import { TextureAtlas } from 'doom-atlas/dist/interfaces/TextureAtlas'
import { createSprite } from 'doom-video'
import { WadMapLump } from 'doom-wad/dist/interfaces/WadMapLump'
import { WadThing } from 'doom-wad/dist/interfaces/WadThingsLump'
import { SectorThing } from 'doom-map/dist/interfaces/SectorInfo'
import { Sector } from '../interfaces/Sector'
import { Thing } from '../interfaces/Thing'
import { ThingTypeNames } from './ThingTypeNames'

const getName = (type: number): string => ThingTypeNames[type]

const createThing = (
    gl: WebGL2RenderingContext,
    atlas: TextureAtlas,
    sector: Sector,
    wadThing: WadThing,
    index: number
): Thing => {
    const spriteName = getName(wadThing.thingType)
    if (spriteName === '-') {
        return {
            index,
            geometry: undefined,
            sector
        }
    }

    const geometry = createSprite(gl, atlas, spriteName)
    geometry.position = [wadThing.x, sector.floorHeight, -wadThing.y]
    //TODO is wad angle === rotation?
    geometry.rotation = (wadThing.angle * Math.PI) / 180.0

    const thing = {
        index,
        geometry,
        sector
    }
    sector.things.push(thing)

    return thing
}

export const createThings = (
    gl: WebGL2RenderingContext,
    atlas: TextureAtlas,
    map: WadMapLump,
    sectors: Sector[],
    sectorThings: SectorThing[][]
): Thing[] =>
    sectorThings
        .flat()
        .filter((st) => {
            const thing = map.things[st.thing]
            return !thing.flags.multiplayerOnly && thing.flags.skill45
        })
        .map((st) => createThing(gl, atlas, sectors[st.sector], map.things[st.thing], st.thing))
