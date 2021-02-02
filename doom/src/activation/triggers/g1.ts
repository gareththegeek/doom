import { Line } from 'doom-map'
import { ActivationType } from '../ActivateLookup'
import { g } from './g'

export const g1 = (type: ActivationType, line: Line) => g(type, line, true)
