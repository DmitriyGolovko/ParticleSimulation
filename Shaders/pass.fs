precision mediump float;

uniform sampler2D u_image;
uniform float u_time;
varying vec2 v_texCoord;

void main() {
    vec2 uv = v_texCoord;
    
    // Heat haze distortion (rises from bottom)
    float heat = sin((uv.y + u_time * 0.5) * 20.0) * 0.02;
    heat += sin((uv.y * 3.0 + u_time) * 30.0) * 0.01;
    
    // Distort UVs horizontally based on heat
    vec2 distortedUV = uv + vec2(heat * (1.0 - uv.y), 0.0);
    
    // Sample with chromatic aberration
    vec4 colorR = texture2D(u_image, distortedUV + vec2(0.003, 0.0));
    vec4 colorG = texture2D(u_image, distortedUV);
    vec4 colorB = texture2D(u_image, distortedUV - vec2(0.003, 0.0));
    
    vec3 color = vec3(colorR.r, colorG.g, colorB.b);
    
    // Heat glow overlay
    float glow = sin(uv.y * 10.0 + u_time * 2.0) * 0.3 + 0.7;
    color += vec3(1.0, 0.3, 0.1) * glow * 0.2;
    
    // Fade transparency at edges
    float vignette = 1.0 - length(uv - 0.5) * 0.4;
    
    gl_FragColor = vec4(color * vignette, 1.0);
}
