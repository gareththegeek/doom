import { WadLump } from './WadLump'

export interface WadMusicLump extends WadLump {
    data: Buffer
}
