import { isPhysics, Stateful } from '../interfaces/State'
import { applyAcceleration } from './applyAcceleration'
import { applyVelocity } from './applyVelocity'
import { doFriction } from './doFriction'
import { doGravity } from './doGravity'

export const doPhysics = (stateful: Stateful, deltaTime: number): void => {
    if (!isPhysics(stateful)) {
        return
    }

    doFriction(stateful, deltaTime)
    doGravity(stateful, deltaTime)
    applyAcceleration(stateful)
    applyVelocity(stateful, deltaTime)
}
