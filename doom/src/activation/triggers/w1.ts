import { Line } from 'doom-map'
import { ActivationType } from '../ActivateLookup'
import { w } from './w'

export const w1 = (type: ActivationType, line: Line) => w(type, line, true)
