import { vec2 } from 'gl-matrix'
import { G } from '../global'
import { isPressed } from '../input/isPressed'
import {
    MAX_PLAYER_ROTATION,
    MAX_PLAYER_SPEED,
    PLAYER_ACCELERATION,
    PLAYER_ANGULAR_ACCELERATION,
    PLAYER_ROTATION_DECAY
} from '../interfaces/Player'

const origin = [0, 0] as vec2
const acceleration = vec2.create()
export const setPlayerAcceleration = (deltaTime: number) => {
    const {
        player: { geometry }
    } = G
    acceleration[0] = 0
    acceleration[1] = 0
    if (isPressed('ArrowUp')) acceleration[1] -= 1
    if (isPressed('ArrowDown')) acceleration[1] += 1
    if (isPressed(',')) acceleration[0] -= 1
    if (isPressed('.')) acceleration[0] += 1
    vec2.normalize(acceleration, acceleration)
    vec2.scale(acceleration, acceleration, PLAYER_ACCELERATION * deltaTime)
    vec2.rotate(acceleration, acceleration, origin, -geometry.rotation)
    G.player.acceleration[0] = acceleration[0]
    G.player.acceleration[2] = acceleration[1]

    let angularAcceleration = 0
    const player = G.player
    if (player.angularVelocity !== 0) {
        const decay = PLAYER_ROTATION_DECAY * deltaTime
        if (Math.abs(player.angularVelocity) < decay) {
            player.angularVelocity = 0
        } else if (player.angularVelocity > 0) {
            player.angularVelocity -= decay
        } else {
            player.angularVelocity += decay
        }
    }
    if (isPressed('ArrowLeft')) angularAcceleration += PLAYER_ANGULAR_ACCELERATION * deltaTime
    if (isPressed('ArrowRight')) angularAcceleration -= PLAYER_ANGULAR_ACCELERATION * deltaTime
    player.angularVelocity += angularAcceleration
    if (Math.abs(player.angularVelocity) > MAX_PLAYER_ROTATION) {
        if (player.angularVelocity > 0) {
            player.angularVelocity = MAX_PLAYER_ROTATION
        } else {
            player.angularVelocity = -MAX_PLAYER_ROTATION
        }
    }
    geometry.rotation += player.angularVelocity
}
