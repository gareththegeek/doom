import { createMap, Thing } from 'doom-map'
import { SkillType } from 'doom-map/dist/interfaces/MapFlags'
import { createScene } from 'doom-video'
import { G } from '../global'
import { Player } from '../interfaces/Player'

const createPlayer = (thing: Thing): Player => ({
    thing,
    keys: {
        blue: false,
        red: false,
        yellow: false
    }
})

export const loadMap = (mapName: string): void => {
    console.info(`Loading map ${mapName}`)
    const map = createMap(mapName, { multiplayer: false, skill: SkillType.skill45 })
    G.map = map

    console.info('Configuring player')
    const playerThing = map.things.find((thing) => thing.type === 1)
    if (playerThing === undefined || playerThing.geometry === undefined) {
        throw new Error('Unable to find player start in level D:')
    }
    const player = createPlayer(playerThing)
    G.player = player
    playerThing.geometry.visible = false

    const objects = [...map.sectors.map((sector) => sector), ...map.things.map((thing) => thing)]
    createScene(objects, playerThing.geometry, [0, 48, 0])
    console.info('Prepared scene')
}
