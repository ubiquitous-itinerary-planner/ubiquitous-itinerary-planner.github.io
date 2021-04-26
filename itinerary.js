/**
 * Code managing an itinerary.
 */

/*
 * View/Controller code
 */

/**
 * Initializes the itinerary element, and its children.
 */
function itInit(){

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