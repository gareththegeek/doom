import { vec2 } from 'gl-matrix'
import { movePhysics } from '../collisions/movePhysics'
import { Physics } from '../interfaces/State'

const p0 = vec2.create()
const p1 = vec2.create()
const velocity = vec2.create()
export const applyVelocity = (stateful: Physics, deltaTime: number): void => {
    p0[0] = stateful.geometry.position[0]
    p0[1] = stateful.geometry.position[2]
    velocity[0] = stateful.velocity[0] * deltaTime
    velocity[1] = stateful.velocity[2] * deltaTime
    vec2.add(p1, p0, velocity)

    movePhysics(stateful, p0, p1)
    vec2.sub(velocity, p1, p0)
    stateful.velocity[0] = velocity[0] * (1 / deltaTime)
    stateful.velocity[2] = velocity[1] * (1 / deltaTime)
    stateful.geometry.position[0] = p1[0]
    stateful.geometry.position[2] = p1[1]
}
