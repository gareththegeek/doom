import PubSub from 'pubsub-js'
import { rebuildSectorGeometry } from 'doom-map'
import { setSpriteFrame } from 'doom-sprite'
import { renderScene } from 'doom-video'
import { G, isStatefulObject } from '../global'
import { ON_KEY_DOWN } from '../interfaces/messageTypes'
import { StateLookup } from '../state/StateLookup'
import { vec3 } from 'gl-matrix'
import { StatefulObject } from '../interfaces/State'

const updateSprite = (stateful: StatefulObject): void => {
    const { player } = G

    const TWO_PI = Math.PI * 2
    const direction = vec3.subtract(vec3.create(), stateful.geometry.position, player.geometry.position)
    const angleToObject = Math.atan2(-direction[2], direction[0])
    const objectAngle = stateful.geometry.rotation

    let angle = (objectAngle - angleToObject + Math.PI) % TWO_PI

    setSpriteFrame(stateful.geometry, stateful.state.frame, 8 - Math.round(angle / (Math.PI / 4)))
}

export const render = (() => {
    return (now: number) => {
        now *= 0.001

        const { statefuls, sectors } = G

        statefuls.filter(isStatefulObject).forEach((stateful) => {
            updateSprite(stateful)
        })

        sectors.filter((sector) => sector.dirty).forEach((sector) => rebuildSectorGeometry(sector))

        renderScene()
    }
})()
