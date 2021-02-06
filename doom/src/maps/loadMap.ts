import { createMap } from 'doom-map'
import { SkillType } from 'doom-map/dist/interfaces/MapFlags'
import { createSpriteGeometry, setSpriteFrame } from 'doom-sprite'
import { createScene } from 'doom-video'
import { findStatefulObjects, findStatefulThings, G } from '../global'
import { Block, BlockMap } from '../interfaces/BlockMap'
import { ObjectInfoLookup } from '../interfaces/ObjectInfoLookup'
import { ObjectInfoType } from '../interfaces/ObjectInfoType'
import { Player, PlayerState, Weapon, WeaponType } from '../interfaces/Player'
import { Sector } from '../interfaces/Sector'
import { Stateful, StatefulObject, StatefulThing } from '../interfaces/State'
import { StateType } from '../interfaces/StateType'
import { StateLookup } from '../state/StateLookup'

const createPistol = (player: StatefulObject): Weapon => {
    const result = {
        ammo: 0,
        block: undefined,
        sector: player.sector,
        geometry: createSpriteGeometry('pisg'),
        ready: false,
        state: StateLookup[StateType.S_PISTOL]
    }
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

export const loadMap = (mapName: string): void => {
    console.info(`Loading map ${mapName}`)

    G.mapName = mapName
    const map = createMap(mapName, { multiplayer: false, skill: SkillType.skill45 })

    G.sectors = map.sectors as Sector[]
    G.sectors.forEach((sector) => (sector.statefuls = []))

    G.blockmap = map.blockmap as BlockMap
    G.blockmap.blocks.forEach((row) =>
        row.forEach((block) => {
            block.statefuls = []
        })
    )

    G.statefuls = map.things.map((thing) => {
        let info = Object.values(ObjectInfoLookup).find((info) => info.doomednum === thing.type)
        if (info === undefined) {
            //throw new Error(`Unable to find object info for thing type ${thing.type}`)
            console.warn(`Couldn't find object info for thing type ${thing.type} so just using MT_PLAYER`)
            info = ObjectInfoLookup[ObjectInfoType.MT_PLAYER]
        }

        const sector = G.sectors[thing.sector.index]
        const block = thing.block as Block
        const result: StatefulThing = {
            thing,
            sector,
            block,
            info,
            state: { ...StateLookup[info.spawnstate] }
        }
        sector.statefuls.push(result)
        block.statefuls.push(result)

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

    console.info('Configuring player')
    const playerStateful = findStatefulThings().find((stateful) => stateful.thing.type === 1) as Player | undefined
    if (playerStateful === undefined || playerStateful.geometry === undefined) {
        throw new Error('Unable to find player start in level D:')
    }
    playerStateful.playerState = createPlayerState(playerStateful)
    playerStateful.geometry.visible = false
    G.statefuls.push(playerStateful.playerState.currentWeapon)
    G.player = playerStateful

    const objects = [...map.sectors.map((sector) => sector), ...findStatefulObjects()]
    createScene(objects, playerStateful.geometry, [0, 48, 0])
    console.info('Prepared scene')
}
