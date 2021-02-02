import { Line, Sector } from 'doom-map'
import { ActivationType } from '../ActivateLookup'
import { g } from './g'

export const g1 = (type: ActivationType, line: Line): Sector[] => g(type, line, true)
