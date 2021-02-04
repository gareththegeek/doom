import PubSub from 'pubsub-js'
import { rebuildSectorGeometry } from 'doom-map'
import { setSpriteFrame } from 'doom-sprite'
import { renderScene } from 'doom-video'
import { G, isStatefulObject, isStatefulThing } from '../global'
import { ON_KEY_DOWN } from '../interfaces/messageTypes'
import { StateLookup } from '../state/StateLookup'
import { vec2, vec3 } from 'gl-matrix'

export const render = (() => {
    // let then = 0
    let lastAnim = 0
    let j = 0
    PubSub.subscribe(ON_KEY_DOWN, (_: any, { key }: { key: any }) => {
        if (key === 'z') {
            j += 1
        }
    })
    return (now: number) => {
        now *= 0.001

        const { statefuls, sectors } = G
        const { player } = G

        const animate = now - lastAnim > 1 / 35
        if (animate) {
            lastAnim = now
        }

        statefuls.filter(isStatefulObject).forEach((stateful) => {
            if (animate) {
                stateful.state.tics -= 1
                if (stateful.state.tics <= 0) {
                    stateful.state = { ...StateLookup[stateful.state.nextState] }
                }
            }

            const direction = vec3.subtract(vec3.create(), stateful.geometry.position, player.geometry.position)
            //const angleToObject = (vec2..angle([direction[0], direction[2]], [1.0, 0.0]) * 180) / Math.PI
            const angleToObject = Math.atan2(-direction[2], direction[0])
            const objectAngle = stateful.geometry.rotation

            let angle = (objectAngle - angleToObject + Math.PI) % (2 * Math.PI)
            if (angle < 0) angle += 2 * Math.PI
            //angle = 2 * Math.PI - angle

            if (isStatefulThing(stateful)) {
                if (stateful.thing.index === 88) {
                    if (G.input.isPressed['q']) {
                        console.log(
                            direction,
                            angleToObject * (180 / Math.PI),
                            objectAngle * (180 / Math.PI),
                            angle * (180 / Math.PI),
                            Math.round(angle / (Math.PI / 4))
                        )
                    }
                }
            }

            setSpriteFrame(stateful.geometry, stateful.state.frame, 8 - Math.round(angle / (Math.PI / 4)))
        })

        sectors.filter((sector) => sector.dirty).forEach((sector) => rebuildSectorGeometry(sector))

        renderScene()
    }
})()
