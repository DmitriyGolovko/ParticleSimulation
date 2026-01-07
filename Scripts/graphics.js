
//#region WebGL Low End

/*
Getting canvas and webgl contexts.
*/
const canvas = document.getElementById('graphics-canvas');
const gl = canvas.getContext('webgl', {
    alpha: true
});


let shaderURL = `${window.location.href}/Shaders/`;


/*
Website will use 2 programs:
-3D rendering program.
-Post processing program.
*/
let renderProgram = gl.createProgram();
let passProgram = gl.createProgram();

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
Create and compile a shader based on type (vertex/fragment)
*/
function createShader(shaderSource, shaderType) {
    if (shaderType != 'vertex' || shaderType != 'fragment') {
        throw new Error('Wrong shader type specified at shader creation.');
    }

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
Send an HTTP GET request to URL asynchronously to fetch files.
*/
async function getFile(url) {
    await fetch()
}


/*
Initializes entire program.
Asynchronous to fetch shader source code from server.
*/
async function initializeProgram() {
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    vertexShaderSource = await fetch(shaderURL + '3d.vs');
    if (vertexShaderSource) {
        vertexShader = createShader(vertexShaderSource, 'vertex');
    }

    fragmentShaderSource = await fetch(shaderURL + '3d.fs');
    if (fragmentShaderSource) {
        fragmentShader = createShader(fragmentShaderSource, 'fragment');
    }

    gl.attachShader(renderProgram, vertexShader);
    gl.attachShader(renderProgram, fragmentShader);

    gl.linkProgram(renderProgram);
    if (!gl.getProgramParameter(renderProgram, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
    }


    quadVertexShaderSource = await fetch(shaderURL + 'quad.vs');
    passFragmentShaderSource = await fetch(shaderURL + 'pass.fs');
}

//#endregion
