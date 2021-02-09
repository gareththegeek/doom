import { vec2 } from 'gl-matrix'
import { LinkedList } from 'low-mem'
import { Block } from '../interfaces/BlockMap'
import { Line, Side } from '../interfaces/Sector'
import { lineCollisionCheck, LineIntersection, resetLineResult } from './lineCollisionCheck'

describe('lineCollisionCheck', () => {
    it('should detect collision with line', () => {
        const radius = 16
        const p0 = [682.8463745117188, 3343.74560546875] as vec2
        const p1 = [687.4652099609375, 3344.62548828125] as vec2
        const blocks = [
            {
                origin: [632, 3336],
                lines: [{ index: 1, start: [704, 3104], end: [704, 3360] }]
            },
            {
                origin: [632, 3464],
                lines: [
                    { index: 2, start: [704, 3552], end: [704, 3360] },
                    { index: 3, start: [704, 3104], end: [704, 3360] },
                    { index: 4, start: [704, 3360], end: [680, 3360] },
                    { index: 5, start: [680, 3360], end: [512, 3328] }
                ]
            }
        ] as Block[]
        const lineCollisions = {
            allow: false,
            lines: new LinkedList<LineIntersection>()
        }

        lineCollisionCheck(lineCollisions, blocks, radius, p0, p1)

        expect(lineCollisions.allow).toBe(false)
        expect(lineCollisions.lines.length()).toBe(1)
        expect(lineCollisions.lines.next()!.item.line.index).toBe(4)

        resetLineResult(lineCollisions)
    })

    const toArray = <T>(list: LinkedList<T>): T[] => {
        const result = []
        let current = list.next()
        while (current !== undefined) {
            result.push(current.item)
            current = list.next(current)
        }
        return result
    }

    it('should detect collision with pillar', () => {
        const radius = 16
        const p0 = [880, 3124] as vec2
        const p1 = [892, 3112] as vec2
        const blocks = [
            {
                origin: [888, 3208],
                lines: [
                    { index: 17, start: [896, 3072], end: [896, 3104] },
                    { index: 18, start: [896, 3104], end: [928, 3104] },
                    { index: 19, start: [928, 3104], end: [928, 3072] },
                    { index: 47, start: [928, 3104], end: [1184, 3104] },
                    { index: 49, start: [928, 3360], end: [928, 3104] },
                    {
                        index: 50,
                        start: [896, 3360],
                        end: [896, 3104],
                        flags: { blocks: false },
                        front: { sector: { floorHeight: 0, ceilingHeight: 80 } },
                        back: { sector: { floorHeight: 0, ceilingHeight: 80 } }
                    }
                ]
            }
        ] as Block[]
        const lineCollisions = {
            allow: false,
            lines: new LinkedList<LineIntersection>()
        }

        lineCollisionCheck(lineCollisions, blocks, radius, p0, p1)

        expect(lineCollisions.allow).toBe(false)
        expect(lineCollisions.lines.length()).toBe(2)
        const lines = toArray(lineCollisions.lines)
        expect(lines[0].line.index).toBe(50)
        expect(lines[1].line.index).toBe(18)

        resetLineResult(lineCollisions)
    })

    const oneSided = (index: number, start: vec2, end: vec2): Line =>
        ({
            index,
            start,
            end
        } as Line)

    const twoSided = (index: number, start: vec2, end: vec2): Line =>
        ({
            index,
            start,
            end,
            flags: { blocks: false },
            front: { sector: { floorHeight: 0, ceilingHeight: 80 } },
            back: { sector: { floorHeight: 0, ceilingHeight: 80 } }
        } as Line)

    it('should still detect collision with pillar', () => {
        const radius = 16
        const p0 = [896, 3124] as vec2
        const p1 = [920, 3112] as vec2
        const blocks = [
            {
                origin: [888, 3208],
                lines: [
                    oneSided(17, [896, 3072], [896, 3104]),
                    oneSided(18, [896, 3104], [928, 3104]),
                    oneSided(19, [928, 3104], [928, 3072]),
                    twoSided(47, [928, 3104], [1184, 3104]),
                    twoSided(49, [928, 3360], [928, 3104]),
                    twoSided(50, [896, 3360], [896, 3104])
                ]
            },
            {
                origin: [888, 3080],
                lines: [
                    oneSided(17, [896, 3072], [896, 3104]),
                    oneSided(19, [928, 3104], [928, 3072]),
                    oneSided(20, [928, 3072], [896, 3072]),
                    twoSided(51, [928, 3072], [1184, 3072])
                ]
            }
        ] as Block[]
        const lineCollisions = {
            allow: false,
            lines: new LinkedList<LineIntersection>()
        }

        lineCollisionCheck(lineCollisions, blocks, radius, p0, p1)

        expect(lineCollisions.allow).toBe(false)
        expect(lineCollisions.lines.length()).toBe(3)
        const lines = toArray(lineCollisions.lines)
        expect(lines[0].line.index).toBe(50)
        expect(lines[1].line.index).toBe(18)
        expect(lines[2].line.index).toBe(49)

        resetLineResult(lineCollisions)
    })
})
