import { Line, Sector } from '../../interfaces/Sector'
import { ActivationType } from '../ActivateLookup'
import { d } from './d'

export const d1 = (type: ActivationType, line: Line): Sector[] => d(type, line, true)
