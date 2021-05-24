/**
 * Returns the planet-object associated with the passed ID.
 * @param id the id to search for
 */
function getPlanet(id){
    for(let i = 0; i < PDB.planets.length; i++){
        if(PDB.planets[i].id === id){
            return PDB.planets[i];
        }
    }
}

function getSystem(name){
    for(let i = 0; i < PDB2.systems.length; i++){
        if(PDB2.systems[i].name === name){
            return PDB2.systems[i];
        }
    }
}