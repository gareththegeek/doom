import { forEachLinkedList } from 'low-mem'
import { forEachAdjacentSector } from '../forEachAdjacentSector'
import { G } from '../global'
import { Sector } from '../interfaces/Sector'
import { Stateful } from '../interfaces/State'
import { doPhysics } from '../physics'
import { setPlayerAcceleration } from '../physics/setPlayerAcceleration'
import { updateState } from '../state/updateState'

const setDirty = (sector: Sector): void => {
    sector.dirty = true
}

let deltaTime = 0
const callDoPhysics = (stateful: Stateful): void => {
    doPhysics(stateful, deltaTime)
}

export const update = (() => {
    let then = 0
    let lastTic = 0
    return (now: number) => {
        now *= 0.001
        deltaTime = now - then
        then = now

        const { sectors, statefuls } = G

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
        }

        setPlayerAcceleration(deltaTime)

        forEachLinkedList(statefuls, callDoPhysics)
    }
})()
