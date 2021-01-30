import { vec2 } from 'gl-matrix'
import { BlockMap } from '../interfaces/BlockMap'
import { Thing } from '../interfaces/Thing'
import { getBlock } from './getBlock'

export const blockCheck = (blockmap: BlockMap, thing: Thing, p0: vec2, p1: vec2): void => {
    const oldBlock = getBlock(blockmap, p0)
    const newBlock = getBlock(blockmap, p1)
    if (newBlock !== oldBlock) {
        oldBlock.things.splice(oldBlock.things.indexOf(thing))
        newBlock.things.push(thing)
        thing.block = newBlock
    }
}
