import { processLoops } from './processLoops'

describe('processLoops', () => {
    interface TestExample {
        adjacency: [from: number, to: number][]
        expected: number[][]
    }

    const examples: TestExample[] = [
        {
            adjacency: [
                [0, 1],
                [1, 2],
                [2, 0]
            ],
            expected: [[0, 1, 2]]
        },
        {
            adjacency: [
                [0, 1],
                [1, 2],
                [2, 0],
                [3, 4],
                [4, 5],
                [5, 3]
            ],
            expected: [
                [0, 1, 2],
                [3, 4, 5]
            ]
        },
        {
            // Must handle degenerate case where one vertex appears more than once in the sector
            // e.g. 4 in the following:
            // 1 - 2
            // |   |
            // 3 - 4 - 5
            //     |   |
            //     6 - 7
            adjacency: [
                [1, 2],
                [2, 4],
                [4, 5],
                [5, 7],
                [7, 6],
                [6, 4],
                [4, 3],
                [3, 1],
            ],
            expected: [
                [1, 2, 4, 3],
                [4, 5, 7, 6]
            ]
        },
        {
            // From sector 28 of e1m1
            adjacency: [
                [11, 12],
                [12, 13],
                [12, 17],
                [17, 14],
                [14, 11],
                [13, 19],
                [19, 20],
                [20, 12],
                [20, 21],
                [21, 23],
                [23, 24],
                [24, 20]
            ],
            expected: [
                [11, 12, 17, 14],
                [12, 13, 19, 20],
                [20, 21, 23, 24]
            ]
        }
    ]
    examples.forEach((example, index) => {
        it(`correctly processes adjacency data into loops - example ${index}`, () => {
            const actual = processLoops(example.adjacency)
            expect(actual).toEqual(example.expected)
        })
    })
})
