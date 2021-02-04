import PubSub from 'pubsub-js'
import { rebuildSectorGeometry } from 'doom-map'
import { setSpriteFrame } from 'doom-sprite'
import { renderScene } from 'doom-video'
import { G, isStatefulObject } from '../global'
import { ON_KEY_DOWN } from '../interfaces/messageTypes'

export const render = (() => {
    // let then = 0
    let lastAnim = 0
    let i = 0
    let j = 0
    PubSub.subscribe(ON_KEY_DOWN, (_: any, { key }: { key: any }) => {
        if (key === 'z') {
            j += 1
        }
    })
    return (now: number) => {
        now *= 0.001

        const { statefuls, sectors } = G

        // TODO use doom state and ticks to manage this and ideally move animation logic to doom-video
        if (now - lastAnim > 0.2) {
            statefuls.filter(isStatefulObject).forEach(({ geometry }) => {
                if (geometry !== undefined) {
                    setSpriteFrame(geometry, i, j)
                }
            })
            lastAnim = now
            i += 1
        }

        sectors.filter((sector) => sector.dirty).forEach((sector) => rebuildSectorGeometry(sector))

        renderScene()
    }
})()
