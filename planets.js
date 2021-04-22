/**
 * Returns the planet-object associated with the passed ID.
 * @param id
 */
function getPlanet(id){
    for(let i = 0; i < PDB.planets.length; i++){
        if(PDB.planets[i].id === id){
            return PDB.planets[i];
        }
    }
}