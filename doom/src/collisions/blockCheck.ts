import { Thing } from 'doom-map'
import { vec2 } from 'gl-matrix'
import { Stateful } from '../interfaces/State'
import { getBlock } from './getBlock'

export const blockCheck = (stateful: Stateful, p0: vec2, p1: vec2): void => {
    const oldBlock = getBlock(p0)
    const newBlock = getBlock(p1)
    if (newBlock !== oldBlock) {
        if (oldBlock !== undefined) {
            oldBlock.statefuls.splice(oldBlock.statefuls.indexOf(stateful))
        }
        if (newBlock !== undefined) {
            newBlock.statefuls.push(stateful)
            stateful.block = newBlock
        }
    }
}
