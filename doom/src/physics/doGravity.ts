import { Physics } from '../interfaces/State'

const GRAVITY = -9.8

export const doGravity = (stateful: Physics, deltaTime: number): void => {
    if (stateful.info.flags.nogravity) {
        return
    }
    if (stateful.geometry.position[1] > stateful.sector.floorHeight) {
        stateful.acceleration[1] += GRAVITY * deltaTime
    }
}
