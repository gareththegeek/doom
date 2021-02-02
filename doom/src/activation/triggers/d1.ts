import { Line, Sector } from 'doom-map'
import { ActivationType } from '../ActivateLookup'
import { d } from './d'

export const d1 = (type: ActivationType, line: Line): Sector | undefined => d(type, line, true)
