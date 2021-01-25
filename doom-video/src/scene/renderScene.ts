import { mat4 } from 'gl-matrix'
import { getModelView } from '.'
import { bindBufferSet, renderBufferSet } from '../buffers'
import { ShaderProgram } from '../shaders/ShaderProgram'
import { bindTexture } from '../textures'
import { Camera } from './Camera'
import { Geometry } from './Geometry'
import { Scene } from './Scene'

const clearScene = (gl: WebGL2RenderingContext) => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

const applyCamera = (gl: WebGL2RenderingContext, program: ShaderProgram, camera: Camera): void => {
    gl.uniformMatrix4fv(program.uniformLocations.projectionMatrix, false, camera.projection)
}

const renderGeometry = (
    gl: WebGL2RenderingContext,
    program: ShaderProgram,
    camera: Camera,
    geometry: Geometry
): void => {
    const modelView = mat4.multiply(mat4.create(), getModelView(camera), getModelView(geometry))
    gl.uniformMatrix4fv(program.uniformLocations.modelViewMatrix, false, modelView)

    bindBufferSet(gl, program, geometry.buffers)
    renderBufferSet(gl, geometry.buffers)
}

export const renderScene = (
    gl: WebGL2RenderingContext,
    program: ShaderProgram,
    { camera, objects, texture }: Scene
): void => {
    clearScene(gl)
    bindTexture(gl, texture)
    applyCamera(gl, program, camera)
    objects.forEach((object) => renderGeometry(gl, program, camera, object))
}
