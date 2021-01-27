import { mat4 } from 'gl-matrix'
import { getModelView } from '.'
import { bindBufferSet, renderBufferSet } from '../buffers'
import { ShaderProgram } from '../shaders/ShaderProgram'
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
    if (geometry.flat) {
        modelView[0] = 1.0
        modelView[4] = 0.0
        modelView[8] = 0.0
        modelView[2] = 0.0
        modelView[6] = 0.0
        modelView[10] = 1.0
    }
    gl.uniformMatrix4fv(program.uniformLocations.modelViewMatrix, false, modelView)
    gl.uniform1f(program.uniformLocations.lightLevel, ((1 - geometry.light / 255) * 32) / 34)

    bindBufferSet(gl, program, geometry.buffers)
    renderBufferSet(gl, geometry.buffers)
}

const bindTextures = (gl: WebGL2RenderingContext, { texture, palette, colourmaps }: Scene): void => {
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, palette)
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, colourmaps)
}

export const renderScene = (gl: WebGL2RenderingContext, program: ShaderProgram, scene: Scene): void => {
    clearScene(gl)
    bindTextures(gl, scene)
    applyCamera(gl, program, scene.camera)
    scene.objects.forEach((object) => renderGeometry(gl, program, scene.camera, object))
}
