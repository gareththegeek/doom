// prettier-ignore
/* eslint-disable */
import { vec2 } from 'gl-matrix'
import { LinkedList, toArrayReverse } from 'low-mem'
import { Block, BlockMap } from '../interfaces/BlockMap'
import { Stateful, StatefulObject } from '../interfaces/State'
import { rayTraceBlockMap } from './fireRay'

describe('rayTraceBlockMap', () => {
    it('handles empty blockmap', () => {
        const blocks = new LinkedList<Block>()
        const blockmap = { origin: [0, 0], blocks: [[{}]] } as BlockMap
        const stateful = { geometry: { position: [0, 0, 0], rotation: 0 } } as StatefulObject
        rayTraceBlockMap(blocks, blockmap, stateful)

        expect(blocks.length()).toBe(1)
    })

    const buildBlocks = (width: number, height: number): Block[][] => {
        const result = []
        for (let x = 0; x < width; x++) {
            const column = []
            for (let y = 0; y < height; y++) {
                column.push({
                    origin: [x, y] as vec2,
                    statefuls: new LinkedList<Stateful>(),
                    lines: []
                })
            }
            result.push(column)
        }
        return result
    }

    const testCases = [
        { position: [0, 0, 0], rotation: 0, expected: [] },
        { position: [1056, 0, 3616], rotation: 180, expected: [[14, 9], [14, 8], [14, 7], [14, 6], [14, 5], [14, 4], [14, 3], [14, 2], [14, 1], [14, 0]] },
        { position: [1056, 0, 3616], rotation: 0, expected: [[14, 9], [14, 10], [14, 11], [14, 12], [14, 13], [14, 14], [14, 15], [14, 16], [14, 17], [14, 18], [14, 19], [14, 20], [14, 21], [14, 22]] },
        { position: [1056, 0, 3616], rotation: -90, expected: [[14, 9], [15, 9], [16, 9], [17, 9], [18, 9], [19, 9], [20, 9], [21, 9], [22, 9], [23, 9], [24, 9], [25, 9], [26, 9], [27, 9], [28, 9], [29, 9], [30, 9], [31, 9], [32, 9], [33, 9], [34, 9], [35, 9]] },
        { position: [1056, 0, 3616], rotation: 90, expected: [[14, 9], [13, 9], [12, 9], [11, 9], [10, 9], [9, 9], [8, 9], [7, 9], [6, 9], [5, 9], [4, 9], [3, 9], [2, 9], [1, 9], [0, 9]] },        
    ]

    testCases.forEach(({ position, rotation, expected }) => {
        it(`Correctly traces blocks for ${position} ${rotation}`, () => {
            const blockmap = {
                origin: [-776, 4872],
                blocks: buildBlocks(36, 23)
            } as BlockMap

            const blockList = new LinkedList<Block>()
            rayTraceBlockMap(blockList, blockmap, {
                geometry: { position, rotation: rotation * (Math.PI / 180) }
            } as StatefulObject)

            const blocks = toArrayReverse(blockList)
            expect(blocks.length).toEqual(expected.length)
            blocks.forEach((actual, index) => {
                expect(actual.origin).toEqual(expected[index])
            })
        })
    })
})
