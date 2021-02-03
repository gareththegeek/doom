import { Geometry } from 'doom-video'
import { vec3 } from 'gl-matrix'
import { S } from './global'
import { setSpriteFrame } from './setSpriteFrame'

export const createSpriteGeometry = (name: string): Geometry => {
    const { lookup } = S
    const geometry = {
        spriteName: name,
        buffers: lookup[name].buffers,
        flat: true,
        light: 0,
        position: [0, 0, 0] as vec3,
        rotation: 0,
        visible: true,
        startIndex: 0,
        indexCount: 0
    }
    setSpriteFrame(geometry, 0, 0)
    return geometry
}
