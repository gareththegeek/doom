// const popAdjacency = (adjacency: number[][], current: number): number => {
//     const nextI = adjacency.findIndex((a) => a[0] === current)
//     if (nextI === -1) {
//         throw new Error('Missing vertex in sector adjacency data')
//     }
//     const next = adjacency.splice(nextI, 1)[0]
//     return next[1]
// }

// const getDuplicates = (adjacency: number[][]): number[] => {
//     return Object.entries(
//         adjacency
//             .map((a) => a[0])
//             .reduce((a, c) => {
//                 if (a[c] === undefined) {
//                     a[c] = 0
//                 }
//                 a[c] += 1
//                 return a
//             }, {} as { [i: number]: number })
//     )
//         .filter(([_, value]) => value > 1)
//         .map(([key]) => parseInt(key))
// }

// const processLoop = (adjacency: number[][]): number[] => {
//     const duplicates = getDuplicates(adjacency)
//     if (duplicates.length > 0) {
//         // Degenerate case where one vertex appears more than once in the sector e.g.
//         // 1 - 2
//         // |   |
//         // 3 - 4 - 5
//         //     |   |
//         //     6 - 7

//         debugger
//     }

//     const start = adjacency[0][0]
//     const indices = [start]
//     let current = popAdjacency(adjacency, start)
//     while (current !== start) {
//         indices.push(current)

//         current = popAdjacency(adjacency, current)
//     }
//     return indices
// }

interface AdjacencyLeaf {
    index: number
    children: AdjacencyLeaf[]
}

type AdjacencyLookup = { [index: number]: AdjacencyLeaf }

const buildAdjacencyTree = (adjacency: number[][]): AdjacencyLeaf[] => {
    const lookup = adjacency.reduce((a, c) => {
        a[c[0]] = { index: c[0], children: [] }
        return a
    }, {} as AdjacencyLookup)
    adjacency.forEach((a) => {
        const leaf = lookup[a[0]]
        leaf.children.push(lookup[a[1]])
    })
    return Object.values(lookup)
}

interface ProcessLeafResult {
    success: boolean
    loop: number[]
}

const processLeaf = (rootIndex: number, seen: number[], leaf: AdjacencyLeaf): ProcessLeafResult => {
    if (leaf.index === rootIndex) {
        return {
            success: true,
            loop: []
        }
    }
    if (seen.includes(leaf.index)) {
        return {
            success: false,
            loop: []
        }
    }
    for (let child of leaf.children) {
        const result = processLeaf(rootIndex, [...seen, leaf.index], child)
        if (!result.success) {
            continue
        }
        return {
            success: true,
            loop: [leaf.index, ...result.loop]
        }
    }
    return {
        success: false,
        loop: []
    }
}

const processLoop = (leaves: AdjacencyLeaf[]): number[] => {
    const root = leaves[0]
    const seen: number[] = []
    for (let child of root.children) {
        const result = processLeaf(root.index, seen, child)
        if (result.success) {
            return [root.index, ...result.loop]
        }
    }
    throw new Error('Unable to find valid loop in sector')
}

const pruneAdjacency = (adjacency: number[][], loop: number[]): void => {
    loop.forEach((_, i) => {
        const adjacencyIndex = adjacency.findIndex((x) => x[0] === loop[i] && x[1] === loop[(i + 1) % loop.length])
        adjacency.splice(adjacencyIndex, 1)
    })
}

export const processLoops = (adjacency: number[][]): number[][] => {
    const loops: number[][] = []
    while (adjacency.length > 0) {
        const leaves = buildAdjacencyTree(adjacency)
        const nextLoop = processLoop(leaves)
        pruneAdjacency(adjacency, nextLoop)
        loops.push(nextLoop)
    }

    return loops
}
