// prettier-ignore
/* eslint-disable */
import { Thing } from 'doom-map'
import { vec2 } from 'gl-matrix'
import { LinkedList, toArrayReverse, toLinkedList } from 'low-mem'
import { G } from '../global'
import { Block, BlockMap } from '../interfaces/BlockMap'
import { Player } from '../interfaces/Player'
import { Line, Side } from '../interfaces/Sector'
import { Physics, State, Stateful } from '../interfaces/State'
import { StateType } from '../interfaces/StateType'
import { fireRay, rayTraceBlockMap } from './fireRay'

const buildBlocks = (width: number, height: number): Block[][] => {
    const result = []
    for (let x = 0; x < width; x++) {
        const column = []
        for (let y = 0; y < height; y++) {
            column.push({
                origin: [x, y] as vec2,
                statefuls: new LinkedList<Physics>(),
                lines: []
            })
        }
        result.push(column)
    }
    return result
}

describe('rayTraceBlockMap', () => {
    const testCases = [
        { position: [0, 0, 0], rotation: 0, last: [-8, 8], expected: [] },
        {
            position: [1056, 0, 3616],
            rotation: 180,
            last: [1016, 4872 + 128],
            expected: [
                [14, 9],
                [14, 8],
                [14, 7],
                [14, 6],
                [14, 5],
                [14, 4],
                [14, 3],
                [14, 2],
                [14, 1],
                [14, 0]
            ]
        },
        {
            position: [1056, 0, 3616],
            rotation: 0,
            last: [1016, 2056 - 128],
            expected: [
                [14, 9],
                [14, 10],
                [14, 11],
                [14, 12],
                [14, 13],
                [14, 14],
                [14, 15],
                [14, 16],
                [14, 17],
                [14, 18],
                [14, 19],
                [14, 20],
                [14, 21],
                [14, 22]
            ]
        },
        {
            position: [1056, 0, 3616],
            rotation: -90,
            last: [3704 + 128, 3720],
            expected: [
                [14, 9],
                [15, 9],
                [16, 9],
                [17, 9],
                [18, 9],
                [19, 9],
                [20, 9],
                [21, 9],
                [22, 9],
                [23, 9],
                [24, 9],
                [25, 9],
                [26, 9],
                [27, 9],
                [28, 9],
                [29, 9],
                [30, 9],
                [31, 9],
                [32, 9],
                [33, 9],
                [34, 9],
                [35, 9]
            ]
        },
        {
            position: [1056, 0, 3616],
            rotation: 90,
            last: [-776 - 128, 3720],
            expected: [
                [14, 9],
                [13, 9],
                [12, 9],
                [11, 9],
                [10, 9],
                [9, 9],
                [8, 9],
                [7, 9],
                [6, 9],
                [5, 9],
                [4, 9],
                [3, 9],
                [2, 9],
                [1, 9],
                [0, 9]
            ]
        }
    ]

    testCases.forEach(({ position, rotation, expected, last }) => {
        it(`Correctly traces blocks for ${position} ${rotation}`, () => {
            const blockmap = {
                origin: [-776, 4872],
                blocks: buildBlocks(36, 23)
            } as BlockMap

            const blockList = new LinkedList<Block>()
            const actualLast = [0, 0]
            rayTraceBlockMap(blockList, actualLast as vec2, blockmap, {
                geometry: { position, rotation: rotation * (Math.PI / 180) }
            } as Physics)

            const blocks = toArrayReverse(blockList)
            expect(actualLast).toEqual(last)
            expect(blocks.length).toEqual(expected.length)
            blocks.forEach((actual, index) => {
                expect(actual.origin).toEqual(expected[index])
            })
        })
    })
})

describe('fireRay', () => {
    it('should hit expected collider', () => {
        const player = {
            thing: {} as Thing,
            geometry: {
                position: [0, 0, 0],
                rotation: 0,
                visible: true
            },
            info: { flags: { solid: true }, radius: 16 }
        }
        const expected1 = {
            geometry: { position: [-160, 104, 3232], rotation: -(Math.PI / 2), visible: true },
            info: { flags: { solid: true }, radius: 16, deathstate: StateType.S_POSS_DIE1 },
            thing: {} as Thing,
            state: {} as State
        }
        const expected2 = {
            geometry: { position: [-192, 104, 3296], rotation: -(Math.PI / 2), visible: true },
            info: { flags: { solid: true }, radius: 20, deathstate: StateType.S_POSS_DIE1 },
            thing: {} as Thing,
            state: {} as State
        }

        G.blockmap = {
            origin: [-776, 4872],
            blocks: buildBlocks(36, 23)
        }
        ;[
            {
                origin: [-776, 3336] as vec2,
                statefuls: new LinkedList<Stateful>(),
                lines: [
                    {
                        index: 124,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 0, ceilingHeight: 128 } } as Side,
                        back: undefined,
                        start: [-768, 3520],
                        end: [-768, 2944]
                    } as Line
                ]
            },
            {
                origin: [-648, 3336],
                statefuls: new LinkedList<Stateful>(),
                lines: [
                    {
                        index: 128,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 0, ceilingHeight: 128 } } as Side,
                        back: { sector: { floorHeight: 0, ceilingHeight: 264 } } as Side,
                        start: [-640, 3520],
                        end: [-640, 2944]
                    } as Line
                ]
            },
            {
                origin: [-520, 3336],
                statefuls: new LinkedList<Stateful>(),
                lines: []
            },
            {
                origin: [-392, 3336],
                statefuls: toLinkedList([
                    ({
                        geometry: { position: [-288, 104, 3232], rotation: -(Math.PI / 2), visible: true },
                        info: { flags: { solid: true }, radius: 16 },
                        thing: {} as Thing
                    } as unknown) as Stateful
                ]),
                lines: [
                    {
                        index: 97,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 264 } } as Side,
                        back: undefined,
                        start: [-256, 3328],
                        end: [-320, 3296]
                    } as Line,
                    {
                        index: 103,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 136, ceilingHeight: 240 } } as Side,
                        back: undefined,
                        start: [-320, 3296],
                        end: [-336, 3296]
                    } as Line,
                    {
                        index: 107,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 0, ceilingHeight: 264 } } as Side,
                        back: undefined,
                        start: [-336, 3296],
                        end: [-336, 3344]
                    } as Line,
                    {
                        index: 118,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 264 } } as Side,
                        back: { sector: { floorHeight: 136, ceilingHeight: 240 } } as Side,
                        start: [-320, 3296],
                        end: [-320, 3168]
                    } as Line,
                    {
                        index: 119,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 0, ceilingHeight: 264 } } as Side,
                        back: { sector: { floorHeight: 136, ceilingHeight: 240 } } as Side,
                        start: [-336, 3168],
                        end: [-336, 3296]
                    } as Line
                ]
            },
            {
                origin: [-264, 3336],
                statefuls: (toLinkedList([
                    expected2,
                    expected1,
                    {
                        geometry: { position: [-224, 128, 3232], rotation: -(Math.PI / 2), visible: true },
                        info: { flags: { solid: false }, radius: 0 },
                        thing: {} as Thing
                    }
                ]) as unknown) as LinkedList<Stateful>,
                lines: [
                    {
                        index: 97,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 264 } } as Side,
                        back: undefined,
                        start: [-256, 3328],
                        end: [-320, 3296]
                    } as Line,
                    {
                        index: 101,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 136, ceilingHeight: 240 } } as Side,
                        back: undefined,
                        start: [-256, 3344],
                        end: [-256, 3328]
                    } as Line,
                    {
                        index: 114,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 264 } } as Side,
                        back: { sector: { floorHeight: 136, ceilingHeight: 240 } } as Side,
                        start: [-128, 3328],
                        end: [-256, 3328]
                    } as Line,
                    {
                        index: 348,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 264 } } as Side,
                        back: { sector: { floorHeight: 128, ceilingHeight: 264 } } as Side,
                        start: [-240, 3264],
                        end: [-208, 3264]
                    } as Line,
                    {
                        index: 349,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 264 } } as Side,
                        back: { sector: { floorHeight: 128, ceilingHeight: 264 } } as Side,
                        start: [-208, 3264],
                        end: [-192, 3248]
                    } as Line,
                    {
                        index: 350,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 264 } } as Side,
                        back: { sector: { floorHeight: 128, ceilingHeight: 264 } } as Side,
                        start: [-192, 3248],
                        end: [-192, 3216]
                    } as Line,
                    {
                        index: 351,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 264 } } as Side,
                        back: { sector: { floorHeight: 128, ceilingHeight: 264 } } as Side,
                        start: [-192, 3216],
                        end: [-208, 3200]
                    } as Line,
                    {
                        index: 353,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 264 } } as Side,
                        back: { sector: { floorHeight: 128, ceilingHeight: 264 } } as Side,
                        start: [-240, 3200],
                        end: [-256, 3216]
                    } as Line,
                    {
                        index: 354,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 264 } } as Side,
                        back: { sector: { floorHeight: 128, ceilingHeight: 264 } } as Side,
                        start: [-256, 3216],
                        end: [-256, 3248]
                    } as Line,
                    {
                        index: 355,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 264 } } as Side,
                        back: { sector: { floorHeight: 128, ceilingHeight: 264 } } as Side,
                        start: [-256, 3248],
                        end: [-240, 3264]
                    } as Line
                ]
            },
            {
                origin: [-136, 3336],
                statefuls: (toLinkedList([
                    {
                        geometry: { position: [-96, 104, 3296], rotation: Math.PI, visible: true },
                        info: { flags: { solid: false }, radius: 20 },
                        thing: {} as Thing
                    },
                    {
                        geometry: { position: [-32, 104, 3232], rotation: 0, visible: true },
                        info: { flags: { solid: false }, radius: 20 },
                        thing: {} as Thing
                    }
                ]) as unknown) as LinkedList<Stateful>,
                lines: [
                    {
                        index: 94,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 192 } } as Side,
                        back: undefined,
                        start: [48, 3392],
                        end: [-64, 3328]
                    } as Line,
                    {
                        index: 102,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 136, ceilingHeight: 240 } } as Side,
                        back: undefined,
                        start: [-128, 3328],
                        end: [-128, 3344]
                    } as Line,
                    {
                        index: 113,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 264 } } as Side,
                        back: { sector: { floorHeight: 104, ceilingHeight: 192 } } as Side,
                        start: [-64, 3136],
                        end: [-64, 3328]
                    } as Line,
                    {
                        index: 114,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 264 } } as Side,
                        back: { sector: { floorHeight: 136, ceilingHeight: 240 } },
                        start: [-128, 3328],
                        end: [-256, 3328]
                    } as Line,
                    {
                        index: 132,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 264 } } as Side,
                        back: undefined,
                        start: [-64, 3328],
                        end: [-88, 3328]
                    } as Line,
                    {
                        index: 133,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 104, ceilingHeight: 264 } } as Side,
                        back: undefined,
                        start: [-88, 3328],
                        end: [-128, 3328]
                    } as Line
                ]
            },
            {
                origin: [-8, 3336],
                statefuls: (toLinkedList([
                    player,
                    {
                        geometry: { position: [32, 104, 3232], rotation: 0, visible: true },
                        info: { flags: { solid: false }, radius: 20 },
                        thing: {} as Thing
                    }
                ]) as unknown) as LinkedList<Stateful>,
                lines: [
                    {
                        index: 92,
                        flags: { blocks: false },
                        front: { sector: { floorHeight: -8, ceilingHeight: 224 } } as Side,
                        back: { sector: { floorHeight: 104, ceilingHeight: 192 } } as Side,
                        start: [64, 3392],
                        end: [128, 3264]
                    } as Line
                ]
            }
        ].forEach((block, index) => {
            G.blockmap.blocks[index][12] = block as Block
        })

        player.geometry.position = [79.79052734375, 104, 3228.559326171875]
        player.geometry.rotation = 1.5998640000000033
        let actual = fireRay(player as Player)
        expect(actual?.collider).toBe(expected1)

        player.geometry.position = [24.91266632080078, 104, 3227.240478515625]
        player.geometry.rotation = 1.8502530000000315
        actual = fireRay(player as Player)
        expect(actual?.collider).toBe(expected2)

        player.geometry.position = [39.32548522949219, 104, 3216.176513671875]
        player.geometry.rotation = 1.8991200000000141
        actual = fireRay(player as Player)
        expect(actual?.collider).toBe(expected2)
    })
})
