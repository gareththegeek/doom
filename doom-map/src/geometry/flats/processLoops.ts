interface AdjacencyLeaf {
    index: number
    children: AdjacencyLeaf[]
}

type AdjacencyLookup = { [index: number]: AdjacencyLeaf }

interface ProcessLeafResult {
    success: boolean
    loop: number[]
}

const buildAdjacencyTree = (adjacency: number[][]): AdjacencyLeaf[] => {
    const lookup = adjacency.reduce((a, c) => {
        a[c[0]] = { index: c[0], children: [] }
        return a
    }, {} as AdjacencyLookup)
    adjacency.forEach((a) => {
        const leaf = lookup[a[0]]
        const next = lookup[a[1]]
        if (next === undefined) {
            // Build an adjacency leaf - this is an unclosed sector :/
            leaf.children.push({
                index: a[1],
                children: []
            })
        }
        leaf.children.push(next)
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
