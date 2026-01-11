precision mediump float;

attribute vec3 aPosition;
attribute vec3 color;

varying lowp vec3 vColor;

void main() {
    gl_Position = vec4(aPosition, 1.0);
    vColor = color;
}