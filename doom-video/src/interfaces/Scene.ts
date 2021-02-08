import { LinkedList } from 'low-mem'
import { Camera } from './Camera'
import { GeometryBox } from './GeometryBox'

export interface Scene {
    camera: Camera
    ortho: Camera
    objects: LinkedList<GeometryBox>
    rooms: GeometryBox[]
}
