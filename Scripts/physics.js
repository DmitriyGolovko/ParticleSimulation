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
pos   vel   mass   charge

pos (position) has x y z properties.
vel (velocity) has x y z properties.
*/
particleList = [];