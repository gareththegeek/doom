import { Line } from 'doom-map'
import { vec2 } from 'gl-matrix'
import { lineCircleIntersection } from './lineCircleIntersection'

describe('lineCircleIntersection', () => {
    interface LineCircleIntersectionExample {
        line: Line
        centre: vec2
        radius: number
        expected: number | undefined
    }

    const examples: LineCircleIntersectionExample[] = [
        { line: { start: [0, 5], end: [20, 10] } as Line, centre: [10, 0], radius: 7, expected: undefined },
        { line: { start: [0, 5], end: [20, 10] } as Line, centre: [10, 0], radius: 8, expected: 52.941 },
        { line: { start: [0, 5], end: [20, 10] } as Line, centre: [3, 10], radius: 3, expected: undefined },
        { line: { start: [0, 5], end: [20, 10] } as Line, centre: [3, 10], radius: 4, expected: undefined },
        { line: { start: [0, 5], end: [20, 10] } as Line, centre: [3, 10], radius: 5, expected: 17 },
        { line: { start: [0, 5], end: [20, 10] } as Line, centre: [24, 10], radius: 3, expected: undefined },
        { line: { start: [0, 5], end: [20, 10] } as Line, centre: [24, 10], radius: 4, expected: 4 * 4 },
        { line: { start: [0, 5], end: [20, 10] } as Line, centre: [24, 10], radius: 5, expected: 4 * 4 },
        { line: { start: [0, 5], end: [20, 10] } as Line, centre: [-4, 2], radius: 4, expected: undefined },
        { line: { start: [0, 5], end: [20, 10] } as Line, centre: [-4, 2], radius: 5, expected: 5 * 5 },
        { line: { start: [-2, -2], end: [2, -2] } as Line, centre: [0, -5], radius: 2, expected: undefined },
        { line: { start: [-2, -2], end: [2, -2] } as Line, centre: [0, -5], radius: 3, expected: 3 * 3 },
        { line: { start: [-2, -2], end: [2, -2] } as Line, centre: [-4, -5], radius: 3, expected: undefined },
        { line: { start: [-2, -2], end: [2, -2] } as Line, centre: [-4, -5], radius: 4, expected: 13 },
        { line: { start: [2, -2], end: [-2, -2] } as Line, centre: [0, -5], radius: 2, expected: undefined },
        { line: { start: [2, -2], end: [-2, -2] } as Line, centre: [0, -5], radius: 3, expected: 3 * 3 },
        { line: { start: [2, -2], end: [-2, -2] } as Line, centre: [-4, -5], radius: 3, expected: undefined },
        { line: { start: [2, -2], end: [-2, -2] } as Line, centre: [-4, -5], radius: 4, expected: 13 },
        { line: { start: [2, 12], end: [2, 2] } as Line, centre: [-2, -1], radius: 4, expected: undefined },
        { line: { start: [2, 12], end: [2, 2] } as Line, centre: [-2, -1], radius: 5, expected: 5 * 5 },
        { line: { start: [2, 12], end: [2, 2] } as Line, centre: [-2, 15], radius: 4, expected: undefined },
        { line: { start: [2, 12], end: [2, 2] } as Line, centre: [-2, 15], radius: 5, expected: 5 * 5 }
    ]

    examples.forEach((example) => {
        it(`Correctly detects line circle intersection distance for line [[${example.line.start}]->[${example.line.end}]] and circle [[${example.centre}], ${example.radius}] -> [${example.expected}]`, () => {
            const { line, centre, radius, expected } = example
            const actual = lineCircleIntersection(line, centre, radius)
            if (expected === undefined) {
                expect(actual).toBeUndefined()
            } else {
                expect(actual).toBeCloseTo(expected!)
            }
        })
    })
})
