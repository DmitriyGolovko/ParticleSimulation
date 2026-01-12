precision mediump float;

attribute vec3 aPosition;
attribute vec3 color;

uniform mat4 u_perspectiveTransformationMatrix;
uniform mat4 u_translationTransformationMatrix;

varying lowp vec3 vColor;

void main() {
    gl_Position = u_perspectiveTransformationMatrix * u_translationTransformationMatrix * vec4(aPosition, 1.0);
    //gl_Position = u_translationTransformationMatrix * vec4(aPosition, 1.0);
    //gl_Position = vec4(aPosition, 1.0);

    vColor = color;
}