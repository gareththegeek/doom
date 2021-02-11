import { getMapBlockCoordinates } from 'doom-map'
import { vec2 } from 'gl-matrix'
import { LinkedList, toArrayReverse } from 'low-mem'
import { G } from '../global'
import { Block, BlockMap } from '../interfaces/BlockMap'
import { StatefulObject } from '../interfaces/State'

const blocks = new LinkedList<Block>()

const pos = vec2.create()
const coords = vec2.create()

const inBounds = (x: number, y: number, x0: number, y0: number, x1: number, y1: number): boolean =>
    x >= x0 && x < x1 && y >= y0 && y < y1

export const rayTraceBlockMap = (
    blocks: LinkedList<Block>,
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
}

export const fireRay = (stateful: StatefulObject) => {
    const { blockmap } = G
    rayTraceBlockMap(blocks, blockmap, stateful)
    console.log(stateful.geometry.rotation * (180/Math.PI))
    console.log(toArrayReverse(blocks))
}
