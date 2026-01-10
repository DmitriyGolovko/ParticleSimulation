
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
Attach vertex and fragment shader to existing program.
Displays any errors with linking.
vertexFile, fragmentFile reference the fullname of a the file in /Shaders directory
*/
async function programShaders(program, vertexFileURL, fragmentFileURL) {

    vertexFile = await fetch(shaderURL + vertexFileURL);
    vertexShaderSource = await vertexFile.text();
    vertexShader = createShader(vertexShaderSource, 'vertex');

    fragmentFile = await fetch(shaderURL + fragmentFileURL);
    fragmentShaderSource = await fragmentFile.text();
    fragmentShader = createShader(fragmentShaderSource, 'fragment');

    gl.attachShader(program, vertexShader);
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
async function initializeProgram() {
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    //Attach shaders for 3d rendering and passthrough programs.
    programShaders(renderProgram, 'vrender.vs', 'frender.fs');
    programShaders(passProgram, 'quad.vs', 'pass.fs');
}

/*
Draw an individual frame.
Complete with fragment shader post processing.
*/
function drawFrame() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

//#endregion
