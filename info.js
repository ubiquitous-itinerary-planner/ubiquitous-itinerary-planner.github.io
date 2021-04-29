/**
 * Initializes the info element, and its children.
 * '</td></tr>'+
 * using id or class in the table rows and data rows does not matter thus far,
 * it is used for the dictionary to convert the names in the table.
 * we want an input from the planet clicked upon which works as the index fetching info from database.
 */

function infoInit(){
    items_table = document.getElementById('info_table');
    items_table.innerHTML = '';
    items_table.innerHTML += '<th id="' + PDB.planets[1].name + '">' + '</th>' +  
    '<tr><td id="population">' + '</td><td>' + PDB.planets[1].population + '</td></tr>' +
    '<tr><td id="starsystem">' + '</td><td id="' + PDB.planets[1].starsystem + '">' + '</td></tr>' +
    '<tr><td id="infrastructure">' + '</td><td id="' + PDB.planets[1].infrastructure + '">' + '</td></tr>' +
    '<tr><td id="meantemp">' + '</td><td>' + PDB.planets[1].meantemp + '</td></tr>' +
    '<tr><td id="breathable">' + '</td><td id="' + PDB.planets[1].breathable + '">' + '</td></tr>' +
    '<tr><td id="climate">' + '</td><td id="' + PDB.planets[1].climate + '">' + '</td></tr>';
}

/**
 * ================================== END OF FILE ========================================= *
 */