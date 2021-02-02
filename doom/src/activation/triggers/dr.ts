import { Line, Sector } from 'doom-map'
import { ActivationType } from '../ActivateLookup'
import { d } from './d'

export const dr = (type: ActivationType, line: Line): Sector[] => d(type, line, false)
