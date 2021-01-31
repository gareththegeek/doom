import { Scene } from '..'
import { VideoResources } from './VideoResources'

export interface VideoState {
    gl: WebGL2RenderingContext
    scene: Scene
    resources: VideoResources
}
