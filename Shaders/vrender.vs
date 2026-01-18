precision mediump float;

attribute vec3 a_position;
attribute vec3 a_color;

uniform mat4 u_perspectiveMatrix;
uniform mat4 u_translationMatrix;
uniform mat4 u_viewZUp; //This matrix orientates the axiis properly.
uniform mat4 u_xRotationMatrix;
uniform mat4 u_zRotationMatrix;

varying lowp vec3 vColor;

void main() {
    gl_Position = u_perspectiveMatrix * u_viewZUp * u_xRotationMatrix * u_zRotationMatrix * u_translationMatrix * vec4(a_position, 1.0);

    vColor = a_color;
}