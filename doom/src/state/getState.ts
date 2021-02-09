import { State } from '../interfaces/State'
import { StateType } from '../interfaces/StateType'
import { StateLookup } from './StateLookup'

export const getState = (type: StateType): State => StateLookup[type]
