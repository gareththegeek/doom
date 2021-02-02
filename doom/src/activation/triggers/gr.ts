import { Line, Sector } from 'doom-map'
import { ActivationType } from '../ActivateLookup'
import { g } from './g'

export const gr = (type: ActivationType, line: Line): Sector[] => g(type, line, false)
