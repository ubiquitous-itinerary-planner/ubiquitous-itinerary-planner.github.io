/**
 * Initializes the info element, and its children.
 * '</td></tr>'+
 * using id or class in the table rows and data rows does not matter thus far,
 * it is used for the dictionary to convert the names in the table.
 * we want an input from the planet clicked upon which works as the index fetching info from database.
 */
import {itInit, itPeek, itPushCommit, itUpdate} from "./sideMenu.js";
import {update_dict_view} from "./databases/dictionaryUIP2.js";
import {mapDraw, mapRouteShortest} from "./map.js";

export function infoUpdate(i){
    let itemsTitle = document.getElementById('info_title');
    itemsTitle.innerHTML = '';
    itemsTitle.innerHTML +=
        '<th id="' + PDB.planets[i].name + '"></th>';
    let itemsTable = document.getElementById('info_table');
    itemsTable.innerHTML = '';
    itemsTable.innerHTML +=
        '<tr class="infoTable"><td id="starsystem">' + '</td><td id="' + PDB.planets[i].starsystem + '">' + '</td></tr>' +
        '<tr class="infoTable"><td id="population">' + '</td><td>' + PDB.planets[i].population + '</td></tr>' +
        '<tr class="infoTable"><td id="climate">' + '</td><td id="' + PDB.planets[i].climate + '">' + '</td></tr>' +
        '<tr class="infoTable"><td id="infrastructure">' + '</td><td id="' + PDB.planets[i].infrastructure + '">' + '</td></tr>' +
        '<tr class="infoTable"><td id="breathable">' + '</td><td id="' + PDB.planets[i].breathable + '">' + '</td></tr>' +
        '<tr class="infoTable"><td id="meantemp">' + '</td><td>' + PDB.planets[i].meantemp + '</td></tr>';

    // The "travel here" - button
    // Remove previous buttons
    $("#info_travel_button").remove();
    $("#info_travel_button_here").remove();
    // Create the new button
    let travelButton = document.createElement("button");
    // Check if we are in the system the button points to
    if(itPeek() === undefined || i !== itPeek().id){
        travelButton.id = "info_travel_button";
        travelButton.disabled = false;
    }
    else{
        travelButton.id = "info_travel_button_here";
        travelButton.disabled = true;
    }
    travelButton.onclick = function (){
        const destination = getPlanet(i);
        if (itPeek() === undefined){
            itInit(i);
            infoUpdate(i);
            mapDraw();
            update_dict_view();
        }
        const start = getPlanet(itPeek().id)
        const route = mapRouteShortest(start.id, destination.id);
        if(route.length < 2){
            return;
        }
        // For each planet to travel to, add the cheapest route
        for(let i = 0; i < route.length-1; i++){
            const current = route[i];
            const next = route[i+1];
            const r = getCheapestRoute(current, next);
            itPushCommit({id: next, price: r.price, duration: r.duration, company: r.company});
        }
        itUpdate();
        infoUpdate(i);
        mapDraw();
        update_dict_view();
    };
    document.getElementById("info").appendChild(travelButton);
    // Show the panel
    document.getElementById('info').style.display = 'flex';
    update_dict_view();

    // Push the sideMenu down, if we are on mobile
    $(".sideMenu").addClass("sideMenu_withInfo");
}

/**
 * ================================== END OF FILE ========================================= *
 */