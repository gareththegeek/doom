import { BlockMap, Line, Sector, Thing } from 'doom-map'
import { vec2, vec3 } from 'gl-matrix'
import { activate } from '../game/activate'
import { lineLineIntersection } from '../maths/lineLineIntersection'
import { getBlocks } from './getBlocks'

const USE_RANGE = 48

const vec3tovec2 = (vec3: vec3): vec2 => [vec3[0], vec3[2]]

const hasIntersection = (lineIntersection: {
    line: Line
    intersection: vec2 | undefined
}): lineIntersection is { line: Line; intersection: vec2 } => lineIntersection.intersection !== undefined

export const use = (blockmap: BlockMap, player: Thing): void => {
    const p0 = vec3tovec2(player.geometry!.position)
    const direction = vec2.rotate(vec2.create(), [0, USE_RANGE], [0, 0], player.geometry!.rotation)
    const p1 = vec2.add(vec2.create(), p0, direction)

    const blocks = getBlocks(blockmap, player, p0, p1)
    const lines = blocks.flatMap((block) => block.lines)
    const intersections = lines
        .map((line) => ({
            line,
            intersection: lineLineIntersection(line.start, line.end, p0, p1)
        }))
        .filter(hasIntersection)
        .map(({ line, intersection }) => ({ line, distance: vec2.squaredDistance(intersection, p0) }))
        .sort((a, b) => a.distance - b.distance)

    for (const line of intersections.map(({ line }) => line)) {
        if (line.special > 0) {
            activate(line)
            return
        }
        if (line.back === undefined || line.back.sector.floorHeight !== line.front.sector.floorHeight) {
            return
        }
    }
}
