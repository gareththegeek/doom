import { Line } from 'doom-map'
import { ActivationType } from '../ActivateLookup'
import { g } from './g'

export const gr = (type: ActivationType, line: Line) => g(type, line, false)
