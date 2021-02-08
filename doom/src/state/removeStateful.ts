import { removeFromBlock } from '../collisions/removeFromBlock'
import { removeFromSector } from '../collisions/removeFromSector'
import { G, isStatefulObject } from '../global'
import { Stateful } from '../interfaces/State'

export const removeStateful = (stateful: Stateful) => {
    const { statefuls, scene } = G
    statefuls.splice(statefuls.indexOf(stateful), 1)
    removeFromBlock(stateful)
    removeFromSector(stateful)
    if (isStatefulObject(stateful)) {
        scene.objects.splice(scene.objects.indexOf(stateful), 1)
    }
}
