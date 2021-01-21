import { mat4 } from 'gl-matrix'

let cubeRotation = 0.0

const vsSource = `
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  vTextureCoord = aTextureCoord;
}
`

// const vsSource = `
// attribute vec4 aVertexPosition;
// attribute vec4 aVertexColor;

// uniform mat4 uModelViewMatrix;
// uniform mat4 uProjectionMatrix;

// varying lowp vec4 vColor;

// void main(void) {
//   gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
//   vColor = aVertexColor;
// }
// `

// const fsSource = `
// varying lowp vec4 vColor;

// void main(void) {
//   gl_FragColor = vColor;
// }
// `

const fsSource = `
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

void main(void) {
  gl_FragColor = texture2D(uSampler, vTextureCoord);
}
`

interface ProgramInfo {
    program: WebGLProgram
    attribLocations: { [name: string]: number }
    uniformLocations: { [name: string]: WebGLUniformLocation }
}

interface Buffers {
    position: WebGLBuffer
    color: WebGLBuffer
    index: WebGLBuffer
    texture: WebGLBuffer
}

const loadShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader => {
    const shader = gl.createShader(type)

    if (!shader) {
        throw new Error(`Unable to create shader`)
    }

    // Send the source to the shader object
    gl.shaderSource(shader, source)

    // Compile the shader program
    gl.compileShader(shader)

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        throw new Error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`)
    }

    return shader
}

const createShaderProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

    // Create the shader program
    const shaderProgram = gl.createProgram()
    if (!shaderProgram) {
        throw new Error('Unable to create shader program')
    }
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw new Error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`)
    }

    return shaderProgram
}

const createBuffers = (gl: WebGLRenderingContext): Buffers => {
    // Create a buffer for the square's positions.
    const positionBuffer = gl.createBuffer()

    if (!positionBuffer) {
        throw new Error('Unable to create buffer')
    }

    // Now create an array of positions for the cube.
    const positions = [
        // Front face
        -1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        1.0,

        // Back face
        -1.0,
        -1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0,

        // Top face
        -1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        -1.0,

        // Bottom face
        -1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,

        // Right face
        1.0,
        -1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        1.0,
        1.0,
        -1.0,
        1.0,

        // Left face
        -1.0,
        -1.0,
        -1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        -1.0
    ]

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    const faceColors = [
        [1.0, 1.0, 1.0, 1.0], // Front face: white
        [1.0, 0.0, 0.0, 1.0], // Back face: red
        [0.0, 1.0, 0.0, 1.0], // Top face: green
        [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0], // Right face: yellow
        [1.0, 0.0, 1.0, 1.0] // Left face: purple
    ]

    // Convert the array of colors into a table for all the vertices.
    let colors: number[] = []
    for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j]
        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c)
    }

    const colorBuffer = gl.createBuffer()
    if (!colorBuffer) {
        throw new Error('Unable to create buffer')
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

    const indexBuffer = gl.createBuffer()
    if (!indexBuffer) {
        throw new Error('Unable to create buffer')
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    const indices = [
        0,
        1,
        2,
        0,
        2,
        3, // front
        4,
        5,
        6,
        4,
        6,
        7, // back
        8,
        9,
        10,
        8,
        10,
        11, // top
        12,
        13,
        14,
        12,
        14,
        15, // bottom
        16,
        17,
        18,
        16,
        18,
        19, // right
        20,
        21,
        22,
        20,
        22,
        23 // left
    ]

    // Now send the element array to GL
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

    const textureCoordBuffer = gl.createBuffer()
    if (!textureCoordBuffer) {
        throw new Error('Unable to create buffer')
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)

    const textureCoordinates = [
        // Front
        0.0,
        0.0,
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0,
        // Back
        0.0,
        0.0,
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0,
        // Top
        0.0,
        0.0,
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0,
        // Bottom
        0.0,
        0.0,
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0,
        // Right
        0.0,
        0.0,
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0,
        // Left
        0.0,
        0.0,
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0
    ]

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW)

    return {
        position: positionBuffer,
        color: colorBuffer,
        index: indexBuffer,
        texture: textureCoordBuffer
    }
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
const loadTexture = (gl: WebGLRenderingContext, url: string) => {
    const texture = gl.createTexture()
    if (!texture) {
        throw new Error('Unable to create texture')
    }
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0
    const internalFormat = gl.RGBA
    const width = 1
    const height = 1
    const border = 0
    const srcFormat = gl.RGBA
    const srcType = gl.UNSIGNED_BYTE
    const pixel = new Uint8Array([0, 0, 255, 255]) // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel)

    const image = new Image()
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image)

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D)
        } else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        }
    }
    image.src = url

    return texture
}

const isPowerOf2 = (value: number): boolean => {
    return (value & (value - 1)) === 0
}

const renderScene = (gl: WebGLRenderingContext, programInfo: ProgramInfo, texture: WebGLTexture, buffers: Buffers) => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0) // Clear to black, fully opaque
    gl.clearDepth(1.0) // Clear everything
    gl.enable(gl.DEPTH_TEST) // Enable depth testing
    gl.depthFunc(gl.LEQUAL) // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    const fieldOfView = (45 * Math.PI) / 180 // in radians
    const { clientWidth, clientHeight } = gl.canvas as HTMLCanvasElement
    const aspect = clientWidth / clientHeight
    const zNear = 0.1
    const zFar = 100.0
    const projectionMatrix = mat4.create()

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create()

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [-0.0, 0.0, -6.0]
    ) // amount to translate
    mat4.rotate(
        modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to rotate
        cubeRotation, // amount to rotate in radians
        [0, 0, 1]
    ) // axis to rotate around
    mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [0, 1, 0])

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    let numComponents = 3 // pull out 3 values per iteration
    let type = gl.FLOAT // the data in the buffer is 32bit floats
    let normalize = false // don't normalize
    let stride = 0 // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    let offset = 0 // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset)
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program)

    // Set the shader uniforms
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix)
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix)

    // numComponents = 4
    // type = gl.FLOAT
    // normalize = false
    // stride = 0
    // offset = 0
    // let vertexCount = 4

    // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
    // gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, numComponents, type, normalize, stride, offset)
    // gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)

    const num = 2 // every coordinate composed of 2 values
    type = gl.FLOAT // the data in the buffer is 32 bit float
    normalize = false // don't normalize
    stride = 0 // how many bytes to get from one set to the next
    offset = 0 // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texture)
    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset)
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord)

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index)

    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0)

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0)

    let vertexCount = 36
    type = gl.UNSIGNED_SHORT
    offset = 0
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
}

const getUniformLocation = (gl: WebGLRenderingContext, program: WebGLProgram, name: string): WebGLUniformLocation => {
    const result = gl.getUniformLocation(program, name)
    if (!result) {
        throw new Error(`Unable to get uniform location '${name}' for program`)
    }
    return result
}

const main = async () => {
    try {
        const canvas = document.querySelector('#canvas') as HTMLCanvasElement
        const gl = canvas.getContext('webgl')

        if (!gl) {
            throw new Error('Unable to acquire webgl context')
        }

        const program = createShaderProgram(gl, vsSource, fsSource)
        const programInfo = {
            program,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
                //vertexColor: gl.getAttribLocation(program, 'aVertexColor')
                textureCoord: gl.getAttribLocation(program, 'aTextureCoord')
            },
            uniformLocations: {
                projectionMatrix: getUniformLocation(gl, program, 'uProjectionMatrix'),
                modelViewMatrix: getUniformLocation(gl, program, 'uModelViewMatrix'),
                uSampler: getUniformLocation(gl, program, 'uSampler')
            }
        }
        const buffers = createBuffers(gl)
        const texture = loadTexture(gl, 'cubetexture.png')

        let then = 0
        const render = (now: number) => {
            now *= 0.001
            const deltaTime = now - then
            cubeRotation += deltaTime
            then = now
            renderScene(gl, programInfo, texture, buffers)

            requestAnimationFrame(render)
        }

        requestAnimationFrame(render)
    } catch (e) {
        console.error(e.message)
    }
}

window.onload = main
