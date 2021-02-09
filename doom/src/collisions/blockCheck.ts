import { ReadonlyVec2, vec2 } from 'gl-matrix'
import { Stateful } from '../interfaces/State'
import { addToBlock } from './addToBlock'
import { getBlock } from './getBlock'
import { removeFromBlock } from './removeFromBlock'

export const blockCheck = (stateful: Stateful, p1: ReadonlyVec2): void => {
    const newBlock = getBlock(p1)
    if (newBlock !== stateful.block) {
        removeFromBlock(stateful)
        addToBlock(newBlock, stateful)
    }
}
