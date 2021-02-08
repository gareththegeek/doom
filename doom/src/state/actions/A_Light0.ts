import { Stateful } from '../../interfaces/State'
import { removeStateful } from '../removeStateful'

export const A_Light0 = (stateful: Stateful): void => {
    console.log('A_Light0', stateful)
    removeStateful(stateful)
}
