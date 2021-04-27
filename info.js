/**
 * Initializes the info element, and its children.
 * '</td></tr>'+
 * using id or class in the table rows and data rows does not matter thus far,
 * it is used for the dictionary to convert the names in the table.
 * we want an input from the planet clicked upon which works as the index fetching info from database.
 */

function infoUpdate(i){
    let itemsTable = document.getElementById('info_table');
    itemsTable.innerHTML = '';
    itemsTable.innerHTML += '<th id="tellus"></th>' +
    '<tr><td id="population">' + '</td><td>' + PDB.planets[i].population + '</td></tr>' +
    '<tr><td id="starsystem">' + '</td><td id="' + PDB.planets[i].starsystem + '">' + '</td></tr>' +
    '<tr><td id="infrastructure">' + '</td><td>' + PDB.planets[i].infrastructure + '</td></tr>' +
    '<tr><td id="avgTemp">' + '</td><td>' + PDB.planets[i].meantemp + '</td></tr>' +
    '<tr><td id="breathableAir">' + '</td><td>' + PDB.planets[i].breathable + '</td></tr>';
    // Show the pane
    document.getElementById('info').style.visibility = "visible";
    update_dict_view();
}

/**
 * ================================== END OF FILE ========================================= *
 */