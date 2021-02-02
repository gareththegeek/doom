import { Line } from 'doom-map'
import { ActivationType } from '../ActivateLookup'
import { s } from './s'

export const sr = (type: ActivationType, line: Line) => s(type, line, false)
