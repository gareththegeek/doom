import { BufferSet } from 'doom-video'
import { SpriteFrame } from './SpriteFrame'

export interface SpriteSheet {
    buffers: BufferSet
    frames: SpriteFrame[]
}
