import { getMapBlock } from 'doom-map'
import { vec2 } from 'gl-matrix'
import { G } from '../global'
import { Block } from '../interfaces/BlockMap'

export const getBlock = (point: vec2): Block => getMapBlock(G.blockmap, point) as Block
