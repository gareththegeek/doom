import { vec3, vec2 } from 'gl-matrix'
import { Physics } from '../interfaces/State'

const velocity = vec2.create()
export const applyAcceleration = (stateful: Physics): void => {
    vec3.add(stateful.velocity, stateful.velocity, stateful.acceleration)
    velocity[0] = stateful.velocity[0]
    velocity[1] = stateful.velocity[2]
    if (vec2.length(velocity) > stateful.info.speed) {
        vec2.normalize(velocity, velocity)
        vec2.scale(velocity, velocity, stateful.info.speed)
        stateful.velocity[0] = velocity[0]
        stateful.velocity[2] = velocity[1]
    }
}
