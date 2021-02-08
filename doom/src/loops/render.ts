import { rebuildSectorGeometry } from 'doom-map'
import { setSpriteFrame } from 'doom-sprite'
import { renderScene } from 'doom-video'
import { G, isStatefulObject } from '../global'
import { vec3 } from 'gl-matrix'
import { forEachLinkedList } from 'low-mem'
import { Stateful } from '../interfaces/State'

const updateSprite = (stateful: Stateful): void => {
    const { player } = G

    if (!isStatefulObject(stateful)) {
        return
    }

    const TWO_PI = Math.PI * 2
    const direction = vec3.subtract(vec3.create(), stateful.geometry.position, player.geometry.position)
    const angleToObject = Math.atan2(-direction[2], direction[0])
    const objectAngle = stateful.geometry.rotation

    let angle = (objectAngle - angleToObject - Math.PI / 2) % TWO_PI

    setSpriteFrame(stateful.geometry, stateful.state.frame, 8 - Math.round(angle / (Math.PI / 4)))
}

export const render = (() => {
    return (now: number) => {
        now *= 0.001

        const { statefuls, sectors } = G

        forEachLinkedList(statefuls, updateSprite)
        
        sectors.filter((sector) => sector.dirty).forEach((sector) => rebuildSectorGeometry(sector))

        renderScene()
    }
})()
