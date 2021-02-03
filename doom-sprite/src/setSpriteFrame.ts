import { Geometry } from 'doom-video'
import { S } from './global'

const INDICES_PER_FRAME = 6

export const setSpriteFrame = (geometry: Geometry, frame: number, angle: number): void => {
    const { lookup } = S
    const sheet = lookup[geometry.spriteName!]
    frame = frame % sheet.frames.length
    angle = angle % 8
    geometry.startIndex = sheet.frames[frame].angle[angle] * INDICES_PER_FRAME
    geometry.indexCount = INDICES_PER_FRAME
}
