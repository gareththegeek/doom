import { mat4 } from 'gl-matrix'
import { getModelView } from '.'
import { bindBufferSet, renderBufferSet } from '../buffers'
import { ShaderProgram } from '../shaders/ShaderProgram'
import { Geometry } from '../interfaces/Geometry'
import { Scene } from '../interfaces/Scene'
import { VideoResources } from '../interfaces/VideoResources'
import { Camera } from '..'
import { V } from '../system/global'
import { WORLD_SPACE_PROGRAM } from '../shaders/createShaderPrograms'

const clearScene = () => {
    const { gl } = V
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

const applyCamera = (camera: Camera): void => {
    const {
        gl,
        resources: { programs }
    } = V
    const program = programs[WORLD_SPACE_PROGRAM]
    const canvas = gl.canvas as HTMLCanvasElement
    gl.uniform2fv(program.uniformLocations.resolution, [canvas.clientWidth, canvas.clientHeight])
    gl.uniformMatrix4fv(program.uniformLocations.projectionMatrix, false, camera.projection)
    gl.uniform1f(program.uniformLocations.skyRotation, -camera.target!.rotation / (Math.PI * 2))
}

const renderGeometry = (camera: Camera, geometry: Geometry): void => {
    const {
        gl,
        resources: { programs }
    } = V
    const program = programs[WORLD_SPACE_PROGRAM]

    if (!geometry.visible) {
        return
    }

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

    bindBufferSet(geometry.buffers)
    renderBufferSet(geometry)
}

const bindTextures = (): void => {
    const {
        gl,
        resources: { texture, palette, colourmaps }
    } = V
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, palette)
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, colourmaps)
}

export const renderScene = (): void => {
    const {
        scene: { camera, objects }
    } = V
    clearScene()
    bindTextures()
    applyCamera(camera)

    objects
        .filter((object) => object.geometry !== undefined)
        .forEach((object) => renderGeometry(camera, object.geometry!))
}
