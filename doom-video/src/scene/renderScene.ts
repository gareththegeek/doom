import { mat4 } from 'gl-matrix'
import { getModelView } from '.'
import { bindBufferSet, renderBufferSet } from '../buffers'
import { Geometry } from '../interfaces/Geometry'
import { Camera, GeometryBox, Scene } from '..'
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

    gl.uniform2fv(program.uniformLocations.resolution, camera.resolution)
    gl.uniformMatrix4fv(program.uniformLocations.projectionMatrix, false, camera.projection)
    gl.uniform2fv(program.uniformLocations.fov, camera.fov)
    const rotation = (camera.target ?? camera).rotation
    gl.uniform1f(program.uniformLocations.skyRotation, -rotation / (Math.PI * 2))
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
    gl.uniform1f(program.uniformLocations.lightLevel, ((1 - geometry.light / 255) * 31) / 33)
    
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

const renderCamera = (camera: Camera, objects: GeometryBox[]): void => {
    applyCamera(camera)
    objects.forEach((object) => renderGeometry(camera, object.geometry!))
}

export const renderScene = (): void => {
    const { gl, scene } = V
    clearScene()
    bindTextures()

    gl.enable(gl.DEPTH_TEST)
    renderCamera(
        scene.camera,
        scene.objects.filter((object) => object.geometry !== undefined && !object.geometry.screenspace)
    )
    gl.disable(gl.DEPTH_TEST)
    renderCamera(
        scene.ortho,
        scene.objects.filter((object) => object.geometry !== undefined && object.geometry.screenspace)
    )
}
