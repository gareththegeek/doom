import { createMap } from 'doom-map'
import { SkillType } from 'doom-map/dist/interfaces/MapFlags'
import { createSpriteGeometry, setSpriteFrame } from 'doom-sprite'
import { createScene, GeometryBox } from 'doom-video'
import { findLinkedList, LinkedList, toLinkedList } from 'low-mem'
import { addToBlock } from '../collisions/addToBlock'
import { addToSector } from '../collisions/addToSector'
import { G } from '../global'
import { Block, BlockMap } from '../interfaces/BlockMap'
import { ObjectInfoLookup } from '../interfaces/ObjectInfoLookup'
import { ObjectInfoType } from '../interfaces/ObjectInfoType'
import { MAX_PLAYER_SPEED, Player, PlayerState } from '../interfaces/Player'
import { Sector } from '../interfaces/Sector'
import { Stateful } from '../interfaces/State'
import { Weapon, WeaponInfoLookup, WeaponType } from '../interfaces/Weapon'
import { addStateful } from '../state/addStateful'
import { allocatePhysics, allocateWeapon, clearHeap } from '../state/allocateStateful'
import * as mm from '@magenta/music/esm/core.js'
import { BasePlayer } from '@magenta/music'

let player: BasePlayer

const createPistol = (player: Player): Weapon => {
    const info = { ...WeaponInfoLookup[WeaponType.Pistol] }
    const result = allocateWeapon(info.readystate)
    result.ammo = 50
    result.info = info
    result.sector = player.sector
    //TODO light must be linked to sector
    result.geometry.light = 255
    return result
}

const createPlayerState = (player: Player): PlayerState => ({
    weapon: createPistol(player),
    nextWeapon: undefined,
    keys: { blue: false, red: false, yellow: false }
})

const isPlayer = (stateful: Stateful): boolean => {
    if (stateful.thing === undefined) {
        return false
    }
    return stateful.thing.type === 1
}

export const loadMap = async (mapName: string): Promise<void> => {
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

    clearHeap()
    G.statefuls.clear()
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
            const result = allocatePhysics(info.spawnstate)
            result.thing = thing
            result.info = info

            if (result.state.spriteName === '-') {
                return result
            }

            const geometry = createSpriteGeometry(result.state.spriteName)
            setSpriteFrame(geometry, result.state.frame, 0)
            geometry.position = thing.spawnPosition
            geometry.rotation = thing.spawnAngle - Math.PI / 2
            geometry.light = thing.sector.lightLevel
            result.geometry = geometry

            addToBlock(block, result)
            addToSector(sector, result)

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
    playerStateful.info.speed = MAX_PLAYER_SPEED
    playerStateful.angularVelocity = 0
    addStateful(playerStateful.playerState.weapon)
    G.player = playerStateful

    console.info('Starting music')
    //https://github.com/cifkao/html-midi-player/blob/aee0a5c24f5b82e0a72179c2558e04d2eb295fba/src/player.ts#L49
    const midiblob = new Blob([new Uint8Array(map.music, 0, map.music.length)])
    console.log(mm)
    const sequence = await mm.blobToNoteSequence(midiblob)
    const soundFontUrl = 'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus'
    if (player === undefined) {
        player = new mm.SoundFontPlayer(soundFontUrl)
    } else {
        player.stop()
    }
    setTimeout(() => {
        player.start(sequence)
    }, 0);

    console.info('Prepared scene')
}
