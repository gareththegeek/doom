import { Physics } from '../interfaces/State'

const GRAVITY = -98

export const doGravity = (stateful: Physics, deltaTime: number): void => {
    if (stateful.info.flags.nogravity) {
        return
    }
    if (stateful.geometry.position[1] > stateful.sector.floorHeight) {
        stateful.acceleration[1] = GRAVITY * deltaTime
        stateful.velocity[1] += stateful.acceleration[1]
        stateful.geometry.position[1] += stateful.velocity[1]
    }
    if (stateful.geometry.position[1] < stateful.sector.floorHeight) {
        stateful.geometry.position[1] = stateful.sector.floorHeight
        stateful.velocity[1] = 0
        stateful.acceleration[1] = 0
    }
}
