import { Line } from 'doom-map'
import { ActivationType } from '../ActivateLookup'
import { w } from './w'

export const wr = (type: ActivationType, line: Line) => w(type, line, false)
