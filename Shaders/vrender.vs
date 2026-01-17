precision mediump float;

attribute vec3 aPosition;
attribute vec3 color;

uniform mat4 u_perspectiveMatrix;
uniform mat4 u_translationMatrix;
uniform mat4 u_viewZUp; //This matrix orientates the axii's properly.
uniform mat4 u_xRotationMatrix;
uniform mat4 u_zRotationMatrix;

varying lowp vec3 vColor;

void main() {
    gl_Position = u_perspectiveMatrix * u_viewZUp * u_xRotationMatrix * u_zRotationMatrix * u_translationMatrix * vec4(aPosition, 1.0);

    vColor = color;
}