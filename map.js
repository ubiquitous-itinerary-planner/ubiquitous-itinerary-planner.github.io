/*
 * View/Controller code
 */

import {hyperjump} from "./hyperspace.js";
import "./libraries/graphlib.js";
import {coordinates} from "./databases/coordinatesDB.js";

let currentSystem; // Which system we are browsing. undefined iff we are in the starsystem view.

/**
 * Initializes the map element, and its children.
 */
export function mapInit(){
    // Initialize the model
    for(let i = 0; i < PDB.planets.length; i++){
        mapAddPlanet(PDB.planets[i]);
    }
    for(let i = 0; i < RDB.routes.length; i++){
        mapAddRoute(RDB.routes[i]);
    }

    // Initialize the view
    // Create the html-objects for showing all systems
    // Draw only the current system
    mapDraw();
}

/**
 * Draws the map of the currently selected system.
 */
function mapDraw(){


    // https://www.nashvail.me/blog/canvas-image
    // https://www.samanthaming.com/tidbits/48-passing-arrays-as-function-arguments/
    let canvas = document.getElementById("map");
    let ctx = canvas.getContext("2d")
    // Hide all map objects
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let planets = mapGetPlanets(currentSystem)
    let planetImages = [];
    const cWidth = canvas.width;
    const cHeight = canvas.height;
    const coords = coordinates[planets.length];

    // Checking if we are in the starsystem view
    if (currentSystem === undefined) {
        // TODO: Insert star system view on canvas
        return;
    }
    // Show the map objects corresponding to the current system
    for (let i = 0; i<planets.length; i++) {
        let img = new Image();
        img.src = getPlanet(planets[i]).img;
        planetImages = planetImages + img.src;
        img.onload = function() {
            let p = getPlanet(planets[i]).placement;
            let args = [img, p[0], p[1], p[2], p[3], coords[i].x*cWidth, coords[i].y*cHeight, p[4], p[5]];
            ctx.drawImage(...args);
        }
        let routes = mapGetRoutes(planets[i]);
        // Using canvas to draw lines between planets where routes exist
        for (let j = 0; j<routes.length; j++) {
            let start = getPlanet(getRoute(routes[j].name).start);
            let startOffSetX = start.placement[4]*0.5;
            let startOffSetY = start.placement[5]*0.5;
            let destination = getPlanet(getRoute(routes[j].name).destination);
            let destOffSetX = destination.placement[4]*0.5;
            let destOffSetY = destination.placement[5]*0.5;
            // Checking whether a planet is in the system or not
            if (destination.starsystem === currentSystem) {
                ctx.beginPath();
                ctx.moveTo(startOffSetX + coords[i].x*cWidth, startOffSetY + coords[i].y*cHeight);
                let dIndex = planets.indexOf(destination.id);
                ctx.lineTo(destOffSetX + coords[dIndex].x*cWidth, destOffSetY + coords[dIndex].y*cHeight);
                ctx.stroke();
            }
        }
    }

    console.log(planetImages);
}

/**
 * Sleeps for the passed number of ms.
 * See https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
 * @param ms the time to sleep
 * @returns {Promise}
 */
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * Move the current system to the passed system.
 * @param system id of the system to move to
 */
export async function mapMove(system){
    // No need to do anything if we're already there
    if(currentSystem === system){
        return;
    }
    // Update model
    currentSystem = system;
    // Play animation
    hyperjump();
    // Wait for the animation to happen
    await sleep(3000);
    // After moving, redraw the screen:
    mapDraw();
}

/*
 * Model code
 */

/*
 * The map is a graphlib Graph object, where each node corresponds to a planet.
 * The node's id is the same as the planet's id.
 *
 * Each edge in the Graph is a route which can be travelled. The edge's label is the id of the route.
 */
let map = new graphlib.Graph({directed: true, compound: true, multigraph: true});

/**
 * Adds a planet to the map.
 * @param planet struct of the planet to add
 */
function mapAddPlanet(planet){
    let id = planet.id;
    map.setNode(id);
    map.setParent(id, planet.starsystem);
}

/**
 * Adds a route to the map.
 * @param route struct of the route to add
 */
function mapAddRoute(route){
    let source = route.start;
    let target = route.destination;
    let label = undefined;
    let name = route.id;
    map.setEdge(source, target, label, name);
    map.setEdge(target, source, label, name);
}

/**
 * Gets the routes of the map.
 * @param planet (optional) if given, only routes from planet will be returned
 * @param target (optional) if given, only routes from planet to target will be returned
 * @returns {[string]} array of the ids of all routes
 */
export function mapGetRoutes(planet, target){
    if(planet === undefined){
        return map.edges();
    }
    else{
        return map.outEdges(planet, target);
    }
}

/**
 * Gets the names of all star systems in the map.
 * @returns {[string]} array of the names of all star systems
 */
export function mapGetSystems(){
    return map.children();
}

/**
 * Gets the ids of all planets in the map.
 * @param system (optional) if given, only planets of this system will be returned
 * @returns {[string]} an array of the ids of all planets
 */
export function mapGetPlanets(system){
    if(system === undefined){
        let allNodes = map.nodes();
        // Only return the planets, so filter out the systems:
        return allNodes.filter(function(currentValue){
            return !(mapGetSystems().includes(currentValue));
        });
    }
    else {
        return map.children(system);
    }
}

/**
 * Finds a route from the start to the destination, using Dijkstra's algorithm.
 * This function optimises for number of jumps.
 * @param start the id of the planet from which to start the route
 * @param destination the id of the planet at which to end the route
 * @returns {[string]} an array of ids of planets visited, in order of visit, starting at the start planet,
 * and ending at the destination planet
 */
export function mapRouteShortest(start, destination){
    let dijkstra = graphlib.alg.dijkstra(map, start);
    return findPath(dijkstra, start, destination);
}

/**
 * Returns a route from the start to the destination, using Dijkstra's algorithm.
 * This function optimises for lowest travel price.
 * @param start the id of the planet from which to start the route
 * @param destination the id of the planet at which to end the route
 * @returns {[string]} an array of ids of planets visited, in order of visit, starting at the start planet,
 * and ending at the destination planet
 */
export function mapRouteCheapest(start, destination){
    function weight(e) {
        return getRoute(e.name).price;
    }
    let dijkstra = graphlib.alg.dijkstra(map, start, weight);
    return findPath(dijkstra, start, destination);
}

/**
 * Returns a route from the start to the destination, using Dijkstra's algorithm.
 * This function optimises for travel time.
 * @param start the id of the planet from which to start the route
 * @param destination the id of the planet at which to end the route
 * @returns {[string]} an array of ids of planets visited, in order of visit, starting at the start planet,
 * and ending at the destination planet
 */
export function mapRouteFastest(start, destination){
    function weight(e) {
        return getRoute(e.name).duration;
    }
    let dijkstra = graphlib.alg.dijkstra(map, start, weight);
    return findPath(dijkstra, start, destination);
}

/**
 * Function enumerating the path from start to destination, using the output from graphlib.alg.dijkstra.
 * @param dijkstra the output from graphlib.alg.dijkstra
 * @param start the id of the planet from which to start the route
 * @param destination the id of the planet at which to end the route
 * @returns {[string]} an array of ids of planets visited, in order of visit, starting at the start planet,
 * and ending at the destination planet
 */
function findPath(dijkstra, start, destination){
    // Find the path
    let path = [];
    let target = destination;
    let systems = mapGetSystems();
    for(let i = 0; i < 1000; i++){ // Set an upper bound on the loop.
        path.unshift(target);
        if(target === start){
            break;
        }
        target = dijkstra[target].predecessor;
    }
    return path;
}

