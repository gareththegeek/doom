import { getMapBlockCoordinates } from 'doom-map'
import { BLOCK_SIZE } from 'doom-map/dist/interfaces/MapBlockMap'
import { vec2 } from 'gl-matrix'
import { LinkedList } from 'low-mem'
import { G } from '../global'
import { Block, BlockMap } from '../interfaces/BlockMap'
import { StatefulObject, StatefulObjectThing } from '../interfaces/State'
import { StateLookup } from '../state/StateLookup'
import { collisionCheck, CollisionCheckResult, Intersection, resetCollisionResult } from './collisionCheck'
import { removeFromBlock } from './removeFromBlock'

const blocks = new LinkedList<Block>()
const collisions = {
    allow: false,
    intersections: new LinkedList<Intersection>()
} as CollisionCheckResult

const pos = vec2.create()
const final = vec2.create()
const coords = vec2.create()
const p0 = vec2.create()
const p1 = vec2.create()

const inBounds = (x: number, y: number, x0: number, y0: number, x1: number, y1: number): boolean =>
    x >= x0 && x < x1 && y >= y0 && y < y1

export const rayTraceBlockMap = (
    blocks: LinkedList<Block>,
    last: vec2,
    blockmap: BlockMap,
    { geometry: { position, rotation } }: StatefulObject
): void => {
    const x0 = 0
    const x1 = blockmap.blocks.length
    const y0 = 0
    const y1 = blockmap.blocks[0].length

    pos[0] = position[0]
    pos[1] = position[2]
    getMapBlockCoordinates(coords, blockmap, pos)
    let x = coords[0]
    let y = coords[1]

    const sinr = Math.sin(-rotation)
    const cosr = Math.cos(-rotation)
    let dx = Math.abs(sinr)
    let dy = Math.abs(cosr)
    let error = dx - dy
    dx *= 2
    dy *= 2

    const incx = sinr > 0 ? 1 : -1
    const incy = cosr > 0 ? 1 : -1

    blocks.clear()
    while (inBounds(x, y, x0, y0, x1, y1)) {
        blocks.add(blockmap.blocks[x][y])

        if (error > 0) {
            x += incx
            error -= dy
        } else {
            y += incy
            error += dx
        }
    }
    
    final[0] = blockmap.origin[0] + x * BLOCK_SIZE
    final[1] = blockmap.origin[1] - y * BLOCK_SIZE
    const distance = vec2.distance(final, pos)
    last[0] = pos[0] + sinr * distance
    last[1] = pos[1] - cosr * distance
}

export const fireRay = (stateful: StatefulObject): Intersection | undefined => {
    const { blockmap } = G
    rayTraceBlockMap(blocks, p1, blockmap, stateful)

    p0[0] = stateful.geometry.position[0]
    p0[1] = stateful.geometry.position[2]
    resetCollisionResult(collisions)
    collisionCheck(stateful, collisions, blocks, 0, p0, p1)

    if (collisions.allow) {
        console.warn('Somehow shot clear out of the level?')
        return undefined
    }

    const intersection = collisions.intersections.prev()!.item
    console.log('hit', intersection.collider, stateful.geometry, blocks)
    if (!intersection.isLine) {
        const hit = intersection.collider as StatefulObjectThing
        console.log('hit', hit)
        hit.state = StateLookup[hit.info.deathstate]
        hit.tics = hit.state.tics
        removeFromBlock(hit)
    }
    return intersection
}
