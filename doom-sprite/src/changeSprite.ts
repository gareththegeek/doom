import { Geometry } from 'doom-video'
import { setSpriteFrame } from '.'
import { S } from './global'

export const changeSprite = (geometry: Geometry, name: string): void => {
    const { lookup } = S
    geometry.spriteName = name
    geometry.buffers = lookup[name].buffers
    setSpriteFrame(geometry, 0, 0)
}
