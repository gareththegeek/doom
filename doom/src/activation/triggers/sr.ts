import { Line, Sector } from 'doom-map'
import { ActivationType } from '../ActivateLookup'
import { s } from './s'

export const sr = (type: ActivationType, line: Line): Sector[] => s(type, line, false)
