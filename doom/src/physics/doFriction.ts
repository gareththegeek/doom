import { vec2 } from 'gl-matrix'
import { Physics } from '../interfaces/State'

const FRICTION = 1500

const velocity = vec2.create()
const friction = vec2.create()
export const doFriction = (stateful: Physics, deltaTime: number): void => {
    velocity[0] = stateful.velocity[0]
    velocity[1] = stateful.velocity[2]
    const speed = vec2.length(velocity)
    if (speed > 0) {
        vec2.normalize(friction, velocity)
        vec2.scale(friction, friction, Math.min(FRICTION * deltaTime, speed))
        vec2.sub(velocity, velocity, friction)
    }
    stateful.velocity[0] = velocity[0]
    stateful.velocity[2] = velocity[1]
}
