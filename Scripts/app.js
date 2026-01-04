//app.js handles the frontend of the application.
//How UI interacts with user and communicating to the server.


//#region Global Parameters

//Getting canvas and webgl contexts.
const canvas = document.getElementById('graphics-canvas');
const gl = canvas.getContext('webgl');

//Left associated UI variables.
let isPlaying = true;
let speedValue = 1.0;
let isDeleting = false;
let isBrush = false;
let brushSize = 50;
let isBrushCube = false;
let isBrushSphere = false;

//#endregion


//Resize event. Adjusts canvas widths and UI sizes for consistenecy.
resize(); //Resize on load.
window.onresize = resize;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


