import { createMap } from 'doom-map'
import { SkillType } from 'doom-map/dist/interfaces/MapFlags'
import { createSpriteGeometry, setSpriteFrame } from 'doom-sprite'
import { createScene, GeometryBox } from 'doom-video'
import { findLinkedList, LinkedList, toLinkedList } from 'low-mem'
import { addToBlock } from '../collisions/addToBlock'
import { addToSector } from '../collisions/addToSector'
import { G, isStatefulThing } from '../global'
import { Block, BlockMap } from '../interfaces/BlockMap'
import { ObjectInfoLookup } from '../interfaces/ObjectInfoLookup'
import { ObjectInfoType } from '../interfaces/ObjectInfoType'
import { Player, PlayerState } from '../interfaces/Player'
import { Sector } from '../interfaces/Sector'
import { Stateful, StatefulObject, StatefulThing } from '../interfaces/State'
import { Weapon, WeaponInfoLookup, WeaponType } from '../interfaces/Weapon'
import { addStateful } from '../state/addStateful'
import { allocateSprite, allocateStateful } from '../state/allocateStateful'

const createPistol = (player: StatefulObject): Weapon => {
    const info = { ...WeaponInfoLookup[WeaponType.Pistol] }
    const result = allocateSprite(info.readystate) as Weapon
    result.ammo = 50
    result.info = info
    result.sector = player.sector
    //TODO constants for native screen res
    result.geometry.position = [160, 0, 0]
    result.geometry.screenspace = true
    //TODO light must be linked to sector
    result.geometry.light = 255
    return result
}

const createPlayerState = (player: StatefulObject): PlayerState => {
    const weapons = {
        [WeaponType.Pistol]: createPistol(player)
    }
    return {
        weapons,
        currentWeapon: weapons[WeaponType.Pistol],
        nextWeapon: undefined,
        keys: { blue: false, red: false, yellow: false }
    }
}

const isPlayer = (stateful: Stateful): boolean => {
    if (!isStatefulThing(stateful)) {
        return false
    }
    return stateful.thing.type === 1
}

export const loadMap = (mapName: string): void => {
    console.info(`Loading map ${mapName}`)

    G.mapName = mapName
    const map = createMap(mapName, { multiplayer: false, skill: SkillType.skill45 })

    G.sectors = map.sectors as Sector[]
    G.sectors.forEach((sector) => (sector.statefuls = new LinkedList<Stateful>()))

    G.blockmap = map.blockmap as BlockMap
    G.blockmap.blocks.forEach((row) =>
        row.forEach((block) => {
            block.statefuls = new LinkedList()
        })
    )

    G.statefuls = toLinkedList(
        map.things.map((thing) => {
            let info = Object.values(ObjectInfoLookup).find((info) => info.doomednum === thing.type)
            if (info === undefined) {
                //throw new Error(`Unable to find object info for thing type ${thing.type}`)
                console.warn(`Couldn't find object info for thing type ${thing.type} so just using MT_PLAYER`)
                info = ObjectInfoLookup[ObjectInfoType.MT_PLAYER]
            }

            const sector = G.sectors[thing.sector.index]
            const block = thing.block as Block
            const result = allocateStateful(info.spawnstate) as StatefulThing
            result.thing = thing
            result.sector = sector
            result.info = info
            addToBlock(block, result)
            addToSector(sector, result)

            if (result.state.spriteName === '-') {
                return result
            }

            const geometry = createSpriteGeometry(result.state.spriteName)
            setSpriteFrame(geometry, result.state.frame, 0)
            geometry.position = thing.spawnPosition
            geometry.rotation = thing.spawnAngle - Math.PI / 2
            geometry.light = thing.sector.lightLevel
            ;((result as Stateful) as StatefulObject).geometry = geometry

            return result
        })
    )

    console.info('Configuring player')
    const playerStateful = findLinkedList(G.statefuls, isPlayer) as Player
    if (playerStateful === undefined || playerStateful.geometry === undefined) {
        throw new Error('Unable to find player start in level D:')
    }

    G.scene = createScene(G.statefuls as LinkedList<GeometryBox>, G.sectors as GeometryBox[], playerStateful.geometry, [
        0,
        48,
        0
    ])

    playerStateful.playerState = createPlayerState(playerStateful)
    playerStateful.geometry.visible = false
    addStateful(playerStateful.playerState.currentWeapon)
    G.player = playerStateful

    console.info('Prepared scene')
}
