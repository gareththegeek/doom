import { G, isStatefulObject } from '../global'
import { Stateful } from '../interfaces/State'

export const addStateful = (stateful: Stateful) => {
    const { statefuls, scene } = G
    statefuls.push(stateful)
    if (isStatefulObject(stateful)) {
        scene.objects.push(stateful)
    }
}
