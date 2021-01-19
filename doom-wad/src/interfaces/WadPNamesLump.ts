import { WadLump } from './WadLump'

export interface WadPNamesLump extends WadLump {
    names: string[]
}
