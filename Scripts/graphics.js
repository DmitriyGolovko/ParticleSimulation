
//#region WebGL Low End

/*
Getting canvas and webgl contexts.
*/
const canvas = document.getElementById('graphics-canvas');
const gl = canvas.getContext('webgl', {
    alpha: true
});

/*
Shader URL base folder for fetching shaders.
*/
let shaderURL = `${window.location.href}/Shaders/`;


/*
Website will use 2 programs:
-3D rendering program.
-Post processing program.
*/
let renderProgram = gl.createProgram();
let passProgram = gl.createProgram();

/*
Attributes for renderProgram vertex shader.
Gets created in initializePrograms function.
*/
let aPositionAttribute;
let colorAttribute;

/*
Perspective matrix parameters and location in renderProgram.
*/
let perspectiveMatrixLoc;
let FOV = Math.PI / 3 //60 degrees
let zNear = 1;
let zFar = 10000;

/*
Uniforms for the renderProgram vertex shader, set in initializePrograms function.
*/
let translationMatrixLoc;
let xRotationMatrixLoc;
let zRotationMatrixLoc;

/*
Set of shaders for standard 3D rendering.
Will draw to framebuffer object.
*/
let vertexShader;
let fragmentShader;


/*
Set of shaders for post-processing effects.
Input will be framebuffer object of 3D scene.
Will be drawn to the screen.
*/
let quadVertexShader
let passFragmentShader;

/*
Buffer objects for pass program.
*/
let quadBuffer; //VBO that contains basic rectangle.
let textureBuffer; //Texture buffer to render scene to.
let frameBuffer; //Frame buffer object.

/*
Create and compile a shader based on type (vertex/fragment)
*/
function createShader(shaderSource, shaderType) {
    if (shaderType != 'vertex' && shaderType != 'fragment') {
        throw new Error('Wrong shader type specified at shader creation.');
    }

    shaderType = shaderType == 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;

    let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    //Throw error if shader source code contains errors according to GLSL compiler.
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
    }

    return shader;
}

/*
Attach vertex and fragment shader to existing program.
Displays any errors with linking.
vertexFile, fragmentFile reference the fullname of the file in /Shaders directory.
*/
async function programShaders(program, vertexFileURL, fragmentFileURL) {
    try {
        vertexFile = await fetch(shaderURL + vertexFileURL);
    } catch (err) {
        console.err(err, 'Could not fetch vertex shader source code from server.');
    }

    vertexShaderSource = await vertexFile.text();
    vertexShader = createShader(vertexShaderSource, 'vertex');

    gl.attachShader(program, vertexShader);

    try {
        fragmentFile = await fetch(shaderURL + fragmentFileURL);
    } catch (err) {
        console.err(err, 'Could not fetch fragment shader source code from server.');
    }

    fragmentShaderSource = await fragmentFile.text();
    fragmentShader = createShader(fragmentShaderSource, 'fragment');

    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
    }
}

/*
Initializes programs.
Asynchronous to fetch shader source code from server.
*/
async function initializePrograms() {
    //Color that will be set when calling gl.clear.
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    //Stops triangle meshes from overlapping when behind another triangle from the camera.
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    //Attach shaders for 3d rendering and passthrough programs.
    await programShaders(renderProgram, 'vrender.vs', 'frender.fs');
    await programShaders(passProgram, 'quad.vs', 'pass.fs');



    /*
    Render program uniforms and attributes setup.
    */

    gl.useProgram(renderProgram);

    //Setting location of perspective uniform.
    perspectiveMatrixLoc = gl.getUniformLocation(renderProgram, 'u_perspectiveMatrix');

    //Setting location of translation uniform.
    translationMatrixLoc = gl.getUniformLocation(renderProgram, 'u_translationMatrix');

    //Setting location of viewZUp uniform.
    viewZUpLoc = gl.getUniformLocation(renderProgram, 'u_viewZUp');

    //Setting location of x-rotation and z-rotation uniforms.
    xRotationMatrixLoc = gl.getUniformLocation(renderProgram, 'u_xRotationMatrix');
    zRotationMatrixLoc = gl.getUniformLocation(renderProgram, 'u_zRotationMatrix');

    //Setting default position and angle of camera.
    gl.uniformMatrix4fv(translationMatrixLoc, false, createTranslationMatrix(0, 0, 0));
    gl.uniformMatrix4fv(xRotationMatrixLoc, false, createXRotationMatrix(0));
    gl.uniformMatrix4fv(zRotationMatrixLoc, false, createZRotationMatrix(0));

    //Setting perspective matrix, this should not change.
    gl.uniformMatrix4fv(perspectiveMatrixLoc, false, createPerspectiveMatrix(width / height, FOV, zNear, zFar));

    //This is 4x4 matrix will swap the y and z coordinates in the vertex shader.
    //Such that X crossproduct Y results in Z.
    //positive-z is up and positive-y is inward towards the screen at the default camera position.
    const viewZUp = new Float32Array([
        1, 0, 0, 0,
        0, 0, 1, 0,
        0, 1, 0, 0,
        0, 0, 0, 1
    ]);

    gl.uniformMatrix4fv(viewZUpLoc, false, viewZUp);



    /*
    Pass program uniforms and attributes setup.
    */

    //Rectangle for quad.vs shader.
    quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
        [//   position       UV
            -1.0, -1.0,   0.0, 0.0,
             1.0, -1.0,   1.0, 0.0,
             1.0,  1.0,   1.0, 1.0,
            -1.0, -1.0,   0.0, 0.0,
             1.0,  1.0,   1.0, 1.0,
            -1.0,  1.0,   0.0, 1.0
        ]), gl.STATIC_DRAW);

    textureBuffer = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    frameBuffer = gl.createFramebuffer();
}

/*
Draw an individual frame.
Complete with fragment shader post processing.
initializePrograms() needs to be called first before calling this function.
*/
function drawFrame(vbo, ebo, elementsLength, time) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    /*
    Render program step.
    */
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textureBuffer, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);

    //Creating position attribute for vrender.vs
    aPositionAttribute = gl.getAttribLocation(renderProgram, "a_position");
    gl.vertexAttribPointer(aPositionAttribute, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPositionAttribute);

    //Creating color attribute for vrender.vs
    colorAttribute = gl.getAttribLocation(renderProgram, 'a_color');
    gl.vertexAttribPointer(colorAttribute, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(colorAttribute);

    gl.drawElements(gl.TRIANGLES, elementsLength, gl.UNSIGNED_SHORT, 0);



    /*
    Pass program step.
    */
    gl.useProgram(passProgram);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureBuffer);

    let timeLoc = gl.getUniformLocation(passProgram, 'time');
    gl.uniform1f(timeLoc, time);

    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    aQuadPositionAttribute = gl.getAttribLocation(passProgram, 'a_position');
    gl.vertexAttribPointer(aQuadPositionAttribute, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aQuadPositionAttribute);

    const aQuadUVAttribute = gl.getAttribLocation(passProgram, "a_texCoord");
    gl.vertexAttribPointer(aQuadUVAttribute, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aQuadUVAttribute);

    gl.drawArrays(gl.TRIANGLES, 0, 6);


    gl.useProgram(renderProgram);
}

//#endregion

//#region Camera

/*
Updates the uniforms in the vertex shader for the camera.
Give the position of the camera and the respective angles of the axiis.
xAngle: Rotation around x-axis (looking up and down)
zAngle: Rotation around z-axis (looking left and right)
*/
function updateCameraUniforms(cameraX, cameraY, cameraZ, xAngle, zAngle) {
    gl.uniformMatrix4fv(translationMatrixLoc, false, createTranslationMatrix(-cameraX, -cameraY, -cameraZ));
    gl.uniformMatrix4fv(xRotationMatrixLoc, false, createXRotationMatrix(xAngle));
    gl.uniformMatrix4fv(zRotationMatrixLoc, false, createZRotationMatrix(zAngle));
}

//#endregion

//#region Tranformation Matrices

/*
Creates a perspective matrix and returns a Float32Array object of 16 elements representing a 4x4 matrix.
*/
function createPerspectiveMatrix(aspectRatio, fov, nearZ, farZ) {
    let element0 = 1 / (aspectRatio * Math.tan(fov / 2));
    let element5 = 1 / Math.tan(fov / 2);
    let element10 = (-nearZ - farZ) / (nearZ - farZ);
    let element11 = 2 * farZ * nearZ / (nearZ - farZ);

    return new Float32Array([
        element0, 0, 0, 0,
        0, element5, 0, 0,
        0, 0, element10, 1,
        0, 0, element11, 0]);
}

/*
Creates a rotation matrix around the x-axis.
*/
function createXRotationMatrix(angle) {
    return new Float32Array([
        1, 0, 0, 0,
        0, Math.cos(angle), Math.sin(angle), 0,
        0, -Math.sin(angle), Math.cos(angle), 0,
        0, 0, 0, 1
    ]);
}

/*
Creates a rotation matrix around the z-axis.
*/
function createZRotationMatrix(angle) {
    return new Float32Array([
        Math.cos(angle), Math.sin(angle), 0, 0,
        -Math.sin(angle), Math.cos(angle), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}

/*
Create a translation matrix by x, y, z.
Returns a Float32Array 1-D array object representing a 4x4 matrix.
*/
function createTranslationMatrix(x, y, z) {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1]);
}

//#endregion
