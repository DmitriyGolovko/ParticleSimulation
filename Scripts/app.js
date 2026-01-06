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
let isBrushSphere = true; //Brush can only be sphere or cube shaped.

//Physics simulation variabls
let fps = 60;
let dt = speedValue / fps;

//#endregion

//#region UI Scaling

//Resize event. Adjusts canvas widths and UI sizes for consistenecy.
resize(); //Resize on load.
window.onresize = resize;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

//#endregion

//#region Associated Button Functions

playButtonElement = document.querySelector('.play-button');
playButtonElement.addEventListener('click', playButtonToggle);

function playButtonToggle() {
    isPlaying = !isPlaying;
}


speedSlider = document.getElementById('id-simulation-speed-slider');
speedSlider.addEventListener('input', speedSliderAdjust);

speedValueDisplay = document.querySelector('.speed-value');

function speedSliderAdjust() {
    speedValue = parseFloat(speedSlider.value);
    dt = speedValue / fps;

    //Modify speed value next to slider.
    //Modification is necessary so UI is consistent.
    speedValueDisplay.innerHTML = `x${speedValue}${Number.isInteger(speedValue) ? '.0' : ''}`;
}

function selectionDeleteToggle() {

}

function brushToggle() {

}

function brushSizeAdjust() {

}

function brushShapeToggle() {

}

function brushParametersPressed() {

}

function simulationParametersPressed() {

}

function helpPressed() {

}


//#endregion
