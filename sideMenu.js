/**
 * Code managing an the side-menu, consisting of the "Departure" selection, and the "Itinerary" information.
 */

/*
 * View/Controller code
 */

/**
 * Initializes the departure element, and its children.
 */
function depInit(){
    let body = document.getElementById("departure_body");
    depCreatePreamble(body);
    let systems = mapGetSystems();
    for(let s in systems){
        depCreateSystem(body, systems[s]);
    }
}

/**
 * Initializes the itinerary element, and its children.
 * @param start the planet which the itinerary starts from
 */
function itInit(start){
    // Toggle visibility of the departure and the itinerary
    $("#departure").css("display", "none");
    $("#itinerary").css("display", "initial");
    itClearCommit(); // Ensure that the itinerary is clear initially
    itPushCommit(start); // Add the starting planet to the itinerary
    itUpdate();
}

/**
 * Re-draws the itinerary
 */
function itUpdate(){
    let path = itGet();
    /* Find the time taken to travel through the itinerary */
    let dates = [];
    dates[0] = START_DATE;
    for(let i = 1; i < path.length; i++){
        dates[i] = new Date(dates[i-1].getTime());
        dates[i].setDate(dates[i].getDate() + parseInt(getRoute(mapGetRoutes(path[i-1], path[i])[0].name).duration));
    }
    /* Elements to write to */
    let body = document.getElementById("itinerary_body");
    body.innerHTML = "";
    let editable = document.getElementById("itinerary_body_editable");
    editable.innerHTML = "";
    let footer = document.getElementById("itinerary_footer");
    footer.innerHTML = "";

    /* The text "Departure from: ... */
    /*let depFrom = document.createElement("div");
    depFrom.innerHTML = "<span id='depFrom'></span><span>: </span><span>" + get_string(getPlanet(path[0]).name) + "</span>" +
        "<br><span id='date'></span><span>: </span><span> " + new Intl.DateTimeFormat(language).format(date) + "</span>";
    body.appendChild(depFrom);*/

    /* Available destinations */
    let outRoutes = mapGetRoutes(path[path.length-1]);
    for(let i = 0; i < outRoutes.length; i++){
        itAddAvailableDestination(editable, getRoute(outRoutes[i].name));
    }
    if(path.length > 1){
        /* Add the last planet to the "editable" element */
        itAddPlanet(editable, path[path.length-1], dates[path.length-1]);
        /* Add the rest of the planets of the path */
        for(let i = path.length-2; i >= 1; i--){
            itAddArrow(body);
            itAddPlanet(body, path[i], dates[i]);
        }
        itAddArrow(body);
        /* Add the first planet */
        itAddPlanet(body, path[0], dates[0]);
    }
    else{
        /* Add the first planet */
        itAddPlanet(editable, path[0], dates[0]);
    }

}

/**
 * Creates and inserts the descriptive text at the top of the departures panel into the parent
 * @param parent the parent object
 */
function depCreatePreamble(parent){
    let text = document.createElement("div");
    text.id = 'departurePreamble';
    parent.appendChild(text);
}

/**
 * Creates an inserts a representation of a system into a parent object. The system is inserted last into the parent.
 * @param parent the parent
 * @param system the name of the system to insert a representation of
 */
function depCreateSystem(parent, system){
    let planets = mapGetPlanets(system);
    /* Overview:
     * <div main>
     *    <p system></p>
     *    <ul list>
     *       <li planet></li>
     *    </ul list>
     * </div main>
     */
    // main
    let main = document.createElement("div");
    // p system
    let p = document.createElement("p");
    p.id = system;
    main.appendChild(p);
    // ul list
    let list = document.createElement("ul");
    // li planet
    for(p in planets){
        let pid = planets[p];
        let item = document.createElement("li");
        item.id = PDB.planets[pid].name;
        // Clicking on the planet switches to itinerary view
        item.onclick = function(){
            itInit(pid);
            update_dict_view();
        };
        item.setAttribute("role", "button");
        item.tabIndex = 0;
        list.appendChild(item);
    }
    main.appendChild(list);
    parent.appendChild(main);
}

/**
 * Adds the destination of the passed route as an available destination into the parent object
 * @param parent the object where to insert the available destination
 * @param route the route object
 */
function itAddAvailableDestination(parent, route){
    /* Text box with info */
    let text = document.createElement("div");
    text.innerHTML = "<span class='to'></span><span>: </span>" + get_string(getPlanet(route.destination).name) + "<span> (</span>" + get_string(getPlanet(route.destination).starsystem) + "<span>)</span>" + "<br>" +
        "<span class='spaceline'></span><span>: " + route.company + "</span><br>" +
        "<span class='duration'></span><span>: " + route.duration + "</span><br>" +
        "<span class='price'></span><span>: " + route.price + "</span>";

    /* Button to add the route */
    let btn = document.createElement("button");
    btn.classList.add("addButton");
    /* Div containing the above */
    let div = document.createElement("div");
    div.appendChild(text);
    div.appendChild(btn);
    /* Append to parent */
    parent.appendChild(div);
}

/**
 * Adds the planet with passed id into the first position of the passed parent object
 * @param parent the object where to insert the planet
 * @param id the id of the planet to insert
 * @param date the date of arrival to the planet
 */
function itAddPlanet(parent, id, date){
    let planet = getPlanet(id);
    let div = document.createElement("div");
    div.innerHTML = "<span>" + get_string(planet.name) + "</span><br>" +
        "<span class='date'></span><span>: " + new Intl.DateTimeFormat(language).format(date) + "</span><br>" +
        "<span>" + "PLACEHOLDER: SPACELINE" + "</span><br>" +
        "<span>" + "PLACEHOLDER: PRICE" + "</span>";
    parent.insertBefore(div, parent.firstChild);
}

/**
 * Adds a downwards arrow into the first position of the passed parent object
 * @param parent the parent object
 */
function itAddArrow(parent){
    let arrow = document.createElement("img");
    arrow.setAttribute("alt", "Arrow pointing down");
    arrow.setAttribute("src", "images/arrow.png");
    parent.insertBefore(arrow, parent.firstChild);
}

/*
 * Model code
 */

let itinerary = [];

/**
 * Pushes the passed planet to the itinerary, placing it last.
 * @param planet the planet to add
 */
function itPush(planet){
    itinerary.push(planet);
}

/**
 * Pushes the passed planet to the itinerary, placing it last.
 * Also commits the action to the Undo-Redo manager.
 * @param planet the planet to add
 */
function itPushCommit(planet){
    commit();
    itPush(planet);
}

/**
 * Pops the most recently added planet from the itinerary, and returns the planet. Returns undefined if the itinerary
 * is already empty.
 * @returns {*} the most recently added planet
 */
function itPop(){
    return itinerary.pop();
}

/**
 * Pops the most recently added planet from the itinerary, and returns the planet. Returns undefined if the itinerary
 * is already empty.
 * Also commits the action to the Undo-Redo manager.
 * @returns {*} the most recently added planet
 */
function itPopCommit(){
    commit();
    return itPop();
}

/**
 * Removes all planets from the itinerary.
 */
function itClear(){
    itinerary = [];
}

/**
 * Removes all planets from the itinerary.
 * Also commits the action to the Undo-Redo manager.
 */
function itClearCommit(){
    commit();
    itClear();
}

/**
 * Returns a (deep) copy of the itinerary.
 * That is, the itinerary will be a copy of the itinerary at this point in time, and future changes to the itinerary
 * will not be seen in the copy returned by this function.
 * @returns {any} a copy of the itinerary
 */
function itGet(){
    return JSON.parse(JSON.stringify(itinerary));
}

/**
 * Sets the itinerary to the passed value.
 * @param itin the itinerary to change the current itinerary to
 */
function itSet(itin){
    itinerary = itin;
}