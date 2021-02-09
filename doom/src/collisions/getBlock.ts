import { getMapBlock } from 'doom-map'
import { ReadonlyVec2 } from 'gl-matrix'
import { G } from '../global'
import { Block } from '../interfaces/BlockMap'

export const getBlock = (point: ReadonlyVec2): Block => getMapBlock(G.blockmap, point) as Block
