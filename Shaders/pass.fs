precision mediump float;

uniform sampler2D u_image;
uniform float u_time;
varying vec2 v_texCoord;

void main() {
    vec2 uv = v_texCoord;
    
    float value = clamp(0.955 + sin(3000.0 * uv.y + u_time), 0.0, 1.0);
    gl_FragColor = value * texture2D(u_image, uv) / 0.80;
}
