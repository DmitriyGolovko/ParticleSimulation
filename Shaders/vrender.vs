precision mediump float;

attribute vec3 aPosition;
attribute vec3 color;

uniform mat4 u_perspectiveTranformationMatrix;
uniform mat4 u_translationTransformationMatrix;

varying lowp vec3 vColor;

void main() {
    gl_Position = u_perspectiveTranformationMatrix * u_translationTransformationMatrix * vec4(aPosition, 1.0);
    vColor = color;
}