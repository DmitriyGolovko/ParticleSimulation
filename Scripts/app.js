//app.js handles the frontend of the application.
//How UI interacts with user and communicating to the server.


//#region Global Parameters

//Width and height of window. Set in resize() event.
let width;
let height;

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
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    gl.viewport(0, 0, width, height);
}

//#endregion

//#region Associated Button Functions


//Play button event.
playButtonElement = document.querySelector('.play-button');
playButtonElement.addEventListener('click', playButtonToggle);

function playButtonToggle() {
    isPlaying = !isPlaying;
}


//Speed slider event.
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


//Selection delete button event.
deleteButton = document.querySelector('.delete-button');
deleteButton.addEventListener('click', selectionDeleteToggle);

function selectionDeleteToggle() {
    isDeleting = !isDeleting;
}


//Toggle brush button event.
brushButton = document.querySelector('.brush-button');
brushButton.addEventListener('click', brushToggle);

function brushToggle() {
    isBrush = !isBrush;
}


//Brush slider adjust event.
brushSlider = document.getElementById('id-brush-size-slider');
brushSlider.addEventListener('input', brushSizeAdjust);

function brushSizeAdjust() {
    brushSize = parseFloat(brushSlider.value);
}


//Toggling brush shape event. Cube/sphere brush.
cubeBrushButton = document.querySelector('.cube-brush-button');
cubeBrushButton.addEventListener('click', brushShapeToggle);

sphereBrushButton = document.querySelector('.sphere-brush-button');
sphereBrushButton.addEventListener('click', brushShapeToggle);



function brushShapeToggle() {
    isBrushSphere = !isBrushSphere;
}

function brushParametersPressed() {

}

function simulationParametersPressed() {

}

function helpPressed() {

}


//#endregion
