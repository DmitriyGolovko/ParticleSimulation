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



particleList.push({ pos: { x: 0, y: 1, z: 70 }, color: { r: 1.0, g: 0.1, b: 0.3 } });
// particleList.push({ pos: { x: 0, y: 6, z: 50 }, color: { r: 0.7, g: 0.5, b: 0.7 } });

for (let i = 0; i < 500; i++) {
    particleList.push({ pos: {
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        z: Math.random() * 20 + 60
    }, color: {
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
    }})
}



let time = 0;

initializePrograms().then(() => {
    updateParticlesBuffer();
    setInterval(() => {
        time += 1 / 60;
        //gl.uniformMatrix4fv(translationMatrixLoc, false, createTranslationMatrix(Math.cos(time), 0, 10 + Math.sin(2 * time)));
        gl.uniformMatrix4fv(translationMatrixLoc, false, createTranslationMatrix(0, -10 * Math.sin(time), 10));
        drawFrame(particlesVBO, particlesEBO, particleList.length * 12);
    }, 1000 / 60);
})

