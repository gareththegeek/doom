import { rebuildSectorGeometry } from 'doom-map'
import { renderScene } from 'doom-video'
import { G } from '../global'

export const render = (() => {
    // let then = 0
    let lastAnim = 0
    return (now: number) => {
        now *= 0.001

        const {
            map: { things, sectors }
        } = G

        // TODO use doom state and ticks to manage this and ideally move animation logic to doom-video
        if (now - lastAnim > 0.2) {
            things.forEach((thing) => {
                if (thing.geometry !== undefined) {
                    thing.geometry.frame = (thing.geometry.frame! + 1) % thing.geometry.frameCount!
                }
            })
            lastAnim = now
        }
        
        sectors.filter((sector) => sector.dirty).forEach((sector) => rebuildSectorGeometry(sector))

        renderScene()
    }
})()
