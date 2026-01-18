precision mediump float;

uniform sampler2D u_image;
uniform float u_time;
varying vec2 v_texCoord;

void main() {
    vec2 uv = v_texCoord;
    
    //CRT TV effect
    float value = clamp(0.955 + sin(4000.0 * uv.y + u_time), 0.0, 1.0);

    float dist = 0.002;

    vec4 left = texture2D(u_image, vec2(uv.x - dist, uv.y));
    vec4 up = texture2D(u_image, vec2(uv.x, uv.y + dist));
    vec4 right = texture2D(u_image, vec2(uv.x + dist, uv.y));
    vec4 down = texture2D(u_image, vec2(uv.x, uv.y - dist));

    vec4 blend = (left + up + right + down) / 4.0;

    vec4 vignette = 0.035 * (1.2 - length(2.0 * uv - 1.0)) * vec4(1.0, 1.0, 1.0, 1.0);

    gl_FragColor = value * (texture2D(u_image, uv) + blend) + vignette;
}
