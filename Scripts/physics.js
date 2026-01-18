/*
---------------------
This file contains the code for the actual physics simulation.
How particles interact with eachother.
The system used for containing the particles.
---------------------
*/


/*
List of all particles in the simulation.
Each particle is a javascript objects in the list.
Properties:
pos   vel   mass   charge   color

pos (position) has x y z properties.
vel (velocity) has x y z properties.
color has r g b properties
*/
particleList = [];

/*
Buffer objects for all particles in the scene.
Storing the buffer means the buffer can be deleted.
These buffers will be updated every frame with all the particle positions.
*/
particlesVBO = gl.createBuffer(); //Vertex buffer object.
particlesEBO = gl.createBuffer(); //Element buffer object.

/*
Will update the particlesVBO and particlesEBO buffer with the new particles position data.
*/
function updateParticlesBuffer() {
    let totalVA = [];
    let totalEA = [];

    let ea = [0, 1, 2, 0, 1, 3, 0, 2, 3, 1, 2, 3];

    for (let i = 0; i < particleList.length; i++) {
        totalVA.push(...createTetrahedronVA(particleList[i].pos, particleList[i].color));

        for (let e of ea) {
            totalEA.push(e + 4 * i);
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, particlesVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(totalVA), gl.STREAM_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, particlesEBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(totalEA), gl.STREAM_DRAW);
}

/*
Returns the vertex positions of a tetrahedron centered on a given coordinate and with a color.
Parameters: pos {x, y, z}, color {r, g, b} all float values.
*/
function createTetrahedronVA(pos, color) {
    let va = [];

    //Tetrahedron with centroid at origin. 1 vertice is above the origin.
    va.push(pos.x, pos.y, 0.81 + pos.z); //v1
    va.push(color.r, color.g, color.b);

    va.push(0.71 + pos.x, pos.y, -0.41 + pos.z); //v2
    va.push(color.r , color.g, color.b);

    va.push(-0.35 + pos.x, 0.61 + pos.y, -0.41 + pos.z); //v3
    va.push(color.r, color.g, color.b);

    va.push(-0.31 + pos.x, -0.61 + pos.y, -0.41 + pos.z); //v4
    va.push(color.r, color.g, color.b);

    return va;
}

let G = 10;

let spread = 200;
let dist = 300;
let h = 100;
let xangle = 0.3;
let delta = 1 / 30;

for (let i = 0; i < 1000; i++) {
    particleList.push({ pos: {
        x: Math.random() * spread - spread / 2,
        y: Math.random() * spread - spread / 2,
        z: Math.random() * spread - spread / 2
    }, color: {
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
    }, vel: {
        x: 0,
        y: 0,
        z: 0
    }});

    particleList[i].vel.x = -1 * particleList[i].pos.y / Math.sqrt(particleList[i].pos.x**2 + particleList[i].pos.y**2);
    particleList[i].vel.y = 1 * particleList[i].pos.x / Math.sqrt(particleList[i].pos.x**2 + particleList[i].pos.y**2);
}

function magnitude32(pos1, pos2) {
    return Math.pow((pos1.x - pos2.x)**2 + (pos1.y - pos2.y)**2 + (pos1.z - pos2.z)**2, 3 / 2);
}

function magnitude2(pos1, pos2) {
    return (pos1.x - pos2.x)**2 + (pos1.y - pos2.y)**2 + (pos1.z - pos2.z)**2
}

function updateParticlePositions() {
    for(let p1 of particleList) {
        let a = { x: 0, y: 0, z: 0 };

        for (let p2 of particleList) {
            if (p1 === p2) continue;

            mag2 = magnitude2(p1.pos, p2.pos)

            if (mag2 < 1.0 || mag2 > 500.0) continue;

            let mag = magnitude32(p2.pos, p1.pos);
            
            a.x += G * (p2.pos.x - p1.pos.x) / mag;
            a.y += G * (p2.pos.y - p1.pos.y) / mag;
            a.z += G * (p2.pos.z - p1.pos.z) / mag;

            
        }

        p1.pos.x += delta * p1.vel.x;
        p1.pos.y += delta * p1.vel.y;
        p1.pos.z += delta * p1.vel.z;

        p1.vel.x += delta * a.x;
        p1.vel.y += delta * a.y;
        p1.vel.z += delta * a.z;
    }
}

function updateParticlePositionsOptimized() {
    for(let i = 0; i < particleList.length; i++) {
        let a = { x: 0, y: 0, z: 0 };
        let p1 = particleList[i];

        for (let j = i + 1; j < particleList.length; j++) {
            let p2 = particleList[j];

            mag2 = magnitude2(p1.pos, p2.pos)

            if (mag2 < 1.0 || mag2 > 500.0) continue;

            let mag = magnitude32(p2.pos, p1.pos);
            
            a.x += G * (p2.pos.x - p1.pos.x) / mag;
            a.y += G * (p2.pos.y - p1.pos.y) / mag;
            a.z += G * (p2.pos.z - p1.pos.z) / mag;

            p1.vel.x += delta * a.x;
            p1.vel.y += delta * a.y;
            p1.vel.z += delta * a.z;

            p2.vel.x -= delta * a.x;
            p2.vel.y -= delta * a.y;
            p2.vel.z -= delta * a.z;   
        }
    }

    for (let p of particleList) {
        p.pos.x += delta * p.vel.x;
        p.pos.y += delta * p.vel.y;
        p.pos.z += delta * p.vel.z;
    }
}

let time = 0;

initializePrograms().then(() => {    
    setInterval(() => {
        time += 1 / 30;
        updateParticlePositions();
        updateParticlesBuffer();

        //updateCameraUniforms(dist * Math.cos(time / 4), dist * Math.sin(time / 4), h, xangle, - Math.PI / 2 - time / 4);
        updateCameraUniforms(dist, 0, h, xangle, -Math.PI / 2);

        drawFrame(particlesVBO, particlesEBO, particleList.length * 12, width, height, time);
    }, 1000 / 30);
});

