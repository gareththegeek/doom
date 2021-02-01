import { BlockMap, Sector, Thing } from 'doom-map'
import { vec2, vec3 } from 'gl-matrix'
import { activate } from '../game/activate'
import { lineLineIntersection } from '../maths/lineLineIntersection'
import { getBlocks } from './getBlocks'

const USE_RANGE = 48

const vec3tovec2 = (vec3: vec3): vec2 => [vec3[0], vec3[2]]

export const use = (blockmap: BlockMap, player: Thing): void => {
    const p0 = vec3tovec2(player.geometry!.position)
    const direction = vec2.rotate(vec2.create(), [0, USE_RANGE], [0, 0], player.geometry!.rotation)
    const p1 = vec2.add(vec2.create(), p0, direction)

    const blocks = getBlocks(blockmap, player, p0, p1)
    const lines = blocks.flatMap((block) => block.lines)
    const intersected = lines.filter((line) => lineLineIntersection(line.start, line.end, p0, p1) !== undefined)
    //TODO only take the nearest intersected line - currently not supported by lineline intersection :(
    const special = intersected.filter((line) => line.special > 0)

    special.forEach((line) => {
        activate(line)
    })
}
