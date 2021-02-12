import { ReadonlyVec2 } from 'gl-matrix'
import { Physics } from '../interfaces/State'
import { addToBlock } from './addToBlock'
import { getBlock } from './getBlock'
import { removeFromBlock } from './removeFromBlock'

export const blockCheck = (stateful: Physics, p1: ReadonlyVec2): void => {
    const newBlock = getBlock(p1)
    if (newBlock !== stateful.block) {
        removeFromBlock(stateful)
        addToBlock(newBlock, stateful)
    }
}
