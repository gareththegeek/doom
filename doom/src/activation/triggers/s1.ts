import { Line } from 'doom-map'
import { ActivationType } from '../ActivateLookup'
import { s } from './s'

export const s1 = (type: ActivationType, line: Line) => s(type, line, true)
