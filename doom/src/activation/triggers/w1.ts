import { Line, Sector } from 'doom-map'
import { ActivationType } from '../ActivateLookup'
import { w } from './w'

export const w1 = (type: ActivationType, line: Line): Sector[] => w(type, line, true)
