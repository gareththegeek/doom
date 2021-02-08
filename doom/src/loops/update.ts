import { Thing } from 'doom-map'
import { vec2 } from 'gl-matrix'
import { collisionCheck } from '../collisions/collisionCheck'
import { getAdjacentSectors } from '../getAdjacentSectors'
import { G, isStatefulObject } from '../global'
import { isPressed } from '../input/isPressed'
import { StatefulObjectThing } from '../interfaces/State'
import { StateType } from '../interfaces/StateType'
import { getState } from '../state/getState'

const forward = (stateful: StatefulObjectThing, speed: number): void => {
    const {
        cheats: { noclip }
    } = G

    const geometry = stateful.geometry
    const result: vec2 = [0, 0]
    vec2.rotate(result, [0, speed], [0, 0], -geometry.rotation)

    const t0 = [geometry.position[0], geometry.position[2]] as vec2
    let t1 = vec2.create()
    vec2.subtract(t1, t0, result)

    const postCollisionPosition = collisionCheck(stateful, t0, t1)
    if (!noclip) {
        t1 = postCollisionPosition
    }

    geometry.position[0] = t1[0]
    geometry.position[2] = t1[1]
}

export const update = (() => {
    let then = 0
    let lastTic = 0
    return (now: number) => {
        now *= 0.001
        const deltaTime = now - then
        then = now

        const { player, sectors, statefuls } = G
        const geometry = player.geometry

        const tic = now - lastTic > 1 / 35
        if (tic) {
            lastTic = now

            statefuls.forEach((stateful) => {
                stateful.state.tics -= 1
                if (stateful.state.tics > 0) {
                    return
                }
                if (stateful.state.action !== undefined) {
                    stateful.state.action(stateful)
                }
                if (stateful.state.nextState === StateType.S_NULL) {
                    //removeStateful(stateful)
                    return
                }
                stateful.state = getState(stateful.state.nextState)
            })
        }

        sectors
            .filter((sector) => sector.update !== undefined)
            .forEach((sector) => {
                sector.update!.function(deltaTime)
                sector.dirty = true
                sector.statefuls
                    .filter(isStatefulObject)
                    //TODO falling rather than being glued to the floor
                    .forEach(({ geometry }) => (geometry.position[1] = sector.floorHeight))
                getAdjacentSectors(sector).forEach((sector) => (sector.dirty = true))
            })

        if (isPressed('ArrowUp')) forward(player, deltaTime * 500)
        if (isPressed('ArrowLeft')) geometry.rotation += deltaTime * 3
        if (isPressed('ArrowDown')) forward(player, -deltaTime * 500)
        if (isPressed('ArrowRight')) geometry.rotation -= deltaTime * 3
        // if (isPressed('q')) geometry.position[1] += deltaTime * 500
        // if (isPressed('a')) geometry.position[1] -= deltaTime * 500
    }
})()
