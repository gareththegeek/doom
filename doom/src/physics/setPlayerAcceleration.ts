import { vec2 } from 'gl-matrix'
import { G } from '../global'
import { isPressed } from '../input/isPressed'
import { PLAYER_ACCELERATION } from '../interfaces/Player'

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

    if (isPressed('ArrowLeft')) geometry.rotation += deltaTime * 3
    if (isPressed('ArrowRight')) geometry.rotation -= deltaTime * 3
}
