import PubSub from 'pubsub-js'
import { vec2, vec3 } from 'gl-matrix'
import { SWITCH_LINE } from '../interfaces/messageTypes'
import { Block } from '../interfaces/BlockMap'
import { StatefulObjectThing } from '../interfaces/State'
import { forEachLinkedList, LinkedList } from 'low-mem'
import { lineCollisionCheck, LineCollisionCheckResult, LineIntersection, resetLineResult } from './lineCollisionCheck'
import { getBlocks } from './getBlocks'

const USE_RANGE = 64

const vec3tovec2 = (vec3: vec3): vec2 => [vec3[0], vec3[2]]

const blocks = new LinkedList<Block>()
const lineCollisions: LineCollisionCheckResult = {
    allow: false,
    lines: new LinkedList<LineIntersection>()
}

const useLine = ({ line }: LineIntersection): void => {
    if (line.special > 0) {
        PubSub.publish(SWITCH_LINE, { line })
    }
}

export const use = (player: StatefulObjectThing): void => {
    const p0 = vec3tovec2(player.geometry.position)
    const direction = vec2.rotate(vec2.create(), [0, -USE_RANGE], [0, 0], -player.geometry!.rotation)
    const p1 = vec2.add(vec2.create(), p0, direction)

    getBlocks(blocks, player, p0, p1)
    resetLineResult(lineCollisions)
    lineCollisionCheck(lineCollisions, blocks, 8, p0, p1)

    forEachLinkedList(lineCollisions.lines, useLine)
}
