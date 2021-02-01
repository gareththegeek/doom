interface AdjacencyLeaf {
    index: number
    children: AdjacencyLeaf[]
}

type AdjacencyLookup = { [index: number]: AdjacencyLeaf }

interface ProcessLeafResult {
    success: boolean
    loop: number[]
}

const buildAdjacencyTree = (adjacency: number[][], ends: number[]): AdjacencyLeaf[] => {
    const lookup = adjacency.reduce((a, c) => {
        a[c[0]] = { index: c[0], children: [] }
        return a
    }, {} as AdjacencyLookup)
    adjacency.forEach((a) => {
        const leaf = lookup[a[0]]
        const next = lookup[a[1]]
        if (next === undefined) {
            // Build an adjacency leaf - this is an unclosed sector :/
            console.warn('Unclosed sector')
            if (ends.includes(a[1]) && ends.length === 2) {
                const end2index = ends.find((end) => end !== a[1])!
                const end2 = lookup[end2index]
                const end1 = { index: a[1], children: [end2] }
                lookup[end1.index] = end1
                leaf.children.push(end1)
            } else {
                leaf.children.push({
                    index: a[1],
                    children: []
                })
            }
        } else {
            leaf.children.push(next)
        }
    })
    return Object.values(lookup)
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
    if (leaf.children.length === 0) {
        console.warn('Closing unclosed sector')
        return {
            success: true,
            loop: [leaf.index]
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
    for (let i = 0; i < loop.length; i++) {
        const adjacencyIndex = adjacency.findIndex((x) => x[0] === loop[i] && x[1] === loop[(i + 1) % loop.length])
        if (adjacencyIndex !== -1) {
            adjacency.splice(adjacencyIndex, 1)
        }
    }
}

const getEnds = (adjacency: number[][]): number[] => {
    const groups = adjacency.flat().reduce<{ [index: number]: number }>((a, c) => {
        a[c] === undefined ? (a[c] = 1) : (a[c] = a[c] + 1)
        return a
    }, {})
    return Object.entries(groups)
        .filter(([_, value]) => value === 1)
        .map(([key]) => parseInt(key))
}

export const processLoops = (adjacency: number[][]): number[][] => {
    const loops: number[][] = []
    // Ends occur in degenerate sectors in two forms
    // Sometimes there is a hole in a sector because part of the sector's lines are assigned to a second
    // degenerate sector like sector 22 in e3m2
    // Sometimes there is a random dead-end such as in sector 81 of e4m3
    const ends = getEnds(adjacency)

    while (adjacency.length > 0) {
        const leaves = buildAdjacencyTree(adjacency, ends)
        const nextLoop = processLoop(leaves)
        pruneAdjacency(adjacency, nextLoop)
        loops.push(nextLoop)
    }

    return loops
}
