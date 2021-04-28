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
    let systems = mapGetSystems();
    for(let s in systems){
        createSystem(body, systems[s]);
    }
}

/**
 * Creates an inserts a representation of a system into a parent object. The system is inserted last into the parent.
 * @param parent the parent
 * @param system the name of the system to insert a representation of
 */
function createSystem(parent, system){
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
        list.appendChild(item);
    }
    main.appendChild(list);
    parent.appendChild(main);
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