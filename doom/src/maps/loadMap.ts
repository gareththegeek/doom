import { createMap } from 'doom-map'
import { SkillType } from 'doom-map/dist/interfaces/MapFlags'
import { createScene } from 'doom-video'
import { G } from '../global'

export const loadMap = (mapName: string): void => {
    const { wad } = G

    console.info(`Loading map ${mapName}`)
    const wadMap = wad.maps[mapName]
    
    const map = createMap(G.atlas, wadMap, { multiplayer: false, skill: SkillType.skill45 })
    G.map = map
    
    console.info('Configuring player')
    const player = map.things.find((thing) => thing.type === 1)
    if (player === undefined || player.geometry === undefined) {
        throw new Error('Unable to find player start in level D:')
    }
    G.player = player
    player.geometry.visible = false

    const objects = [...map.sectors.map((sector) => sector), ...map.things.map((thing) => thing)]
    createScene(objects, player.geometry, [0, 48, 0])
    console.info('Prepared scene')
}
