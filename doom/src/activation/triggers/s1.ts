import { Line, Sector } from '../../interfaces/Sector'
import { ActivationType } from '../ActivateLookup'
import { s } from './s'

export const s1 = (type: ActivationType, line: Line): Sector[] => s(type, line, true)
