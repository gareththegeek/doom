import { vec2 } from 'gl-matrix'
import { forEachLinkedList } from 'low-mem'
import { moveStateful } from '../collisions/moveStateful'
import { forEachAdjacentSector } from '../forEachAdjacentSector'
import { G } from '../global'
import { isPressed } from '../input/isPressed'
import { Sector } from '../interfaces/Sector'
import { Stateful, StatefulObjectThing } from '../interfaces/State'
import { StateType } from '../interfaces/StateType'
import { getState } from '../state/getState'
import { doGravity } from './gravity'

const origin = vec2.create()
const velocity = vec2.create()
const result = vec2.create()
const t0 = vec2.create()
const t1 = vec2.create()

const forward = (stateful: StatefulObjectThing, speed: number): void => {
    const geometry = stateful.geometry
    velocity[1] = speed
    vec2.rotate(result, velocity, origin, -geometry.rotation)

    t0[0] = geometry.position[0]
    t0[1] = geometry.position[2]
    vec2.subtract(t1, t0, result)

    moveStateful(stateful, t0, t1)

    geometry.position[0] = t1[0]
    geometry.position[2] = t1[1]
}

const setDirty = (sector: Sector): void => {
    sector.dirty = true
}

const updateState = (stateful: Stateful): void => {
    stateful.tics -= 1
    if (stateful.tics > 0) {
        return
    }
    if (stateful.state.action !== undefined) {
        stateful.state.action(stateful)
    }
    if (stateful.state.nextState === StateType.S_NULL) {
        return
    }
    stateful.state = getState(stateful.state.nextState)
    stateful.tics = stateful.state.tics
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

            forEachLinkedList(statefuls, updateState)
        }

        for (const sector of sectors) {
            if (sector.update === undefined) {
                continue
            }
            sector.update!.function(deltaTime)
            sector.dirty = true
            forEachAdjacentSector(sector, setDirty)
            doGravity(sector)
        }

        if (isPressed('ArrowUp')) forward(player, deltaTime * 500)
        if (isPressed('ArrowLeft')) geometry.rotation += deltaTime * 3
        if (isPressed('ArrowDown')) forward(player, -deltaTime * 500)
        if (isPressed('ArrowRight')) geometry.rotation -= deltaTime * 3
        // if (isPressed('q')) geometry.position[1] += deltaTime * 500
        // if (isPressed('a')) geometry.position[1] -= deltaTime * 500
    }
})()
