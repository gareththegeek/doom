import PubSub from 'pubsub-js'
import { vec2 } from 'gl-matrix'
import { SWITCH_LINE } from '../interfaces/messageTypes'
import { Block } from '../interfaces/BlockMap'
import { forEachLinkedList, LinkedList } from 'low-mem'
import { getBlocks } from './getBlocks'
import { collisionCheck, CollisionCheckResult, Intersection, resetCollisionResult } from './collisionCheck'
import { Line } from '../interfaces/Sector'
import { isSolidForPlayer } from './isSolidForPlayer'
import { Player } from '../interfaces/Player'

const USE_RANGE = 64

let p0 = vec2.create()
let p1 = vec2.create()
let direction = vec2.create()

const blocks = new LinkedList<Block>()
const collisions: CollisionCheckResult = {
    allow: false,
    intersections: new LinkedList<Intersection>()
}

const useLine = ({ isLine, collider }: Intersection): void => {
    if (!isLine) {
        return
    }
    const line = collider as Line
    if (line.special > 0) {
        PubSub.publish(SWITCH_LINE, line)
    }
}

export const use = (player: Player): void => {
    p0[0] = player.geometry.position[0]
    p0[1] = player.geometry.position[2]

    vec2.rotate(direction, [0, -USE_RANGE], [0, 0], -player.geometry!.rotation)
    vec2.add(p1, p0, direction)

    getBlocks(blocks, player, p0, p1)
    resetCollisionResult(collisions)
    collisionCheck(player, collisions, blocks, 8, p0, p1, isSolidForPlayer)

    forEachLinkedList(collisions.intersections, useLine)
}
