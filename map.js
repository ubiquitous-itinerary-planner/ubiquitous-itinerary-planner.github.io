/*
 * View/Controller code
 */

import {hyperjump} from "./hyperspace.js";
import "./libraries/graphlib.js";
import {coordinates} from "./databases/coordinatesDB.js";
import {get_string} from "./databases/dictionaryUIP2.js";


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
    const systemJump = document.getElementById("systemJumpPic");
    systemJump.setAttribute("alt", get_string("systemJumpAltText"));
    mapDraw();
}

/**
 * Draws the map of the currently selected system.
 */
export function mapDraw(){

    // https://www.nashvail.me/blog/canvas-image
    // https://www.samanthaming.com/tidbits/48-passing-arrays-as-function-arguments/
    const canvas = document.getElementById("map");
    const ctx = canvas.getContext("2d")
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    // Hide all map objects
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const planets = mapGetPlanets(currentSystem)
    let planetImages = [];
    const cWidth = canvas.width;
    const cHeight = canvas.height;
    const coords = coordinates[planets.length];

    // Checking if we are in the starsystem view
    if (currentSystem === undefined) {
        // Hide the system jump location
        document.getElementById("systemJumpPic").style.display="none";
        // TODO: Insert star system view on canvas
        return;
    }
    // Display the system jump location
    const jumpPic = document.getElementById("systemJumpPic");
    jumpPic.style.display="initial";
    const jqJumpPic = $("#systemJumpPic");
    // Coordinates of the centre of the jump location
    // Get the current/computed style - see https://stackoverflow.com/questions/14275304/how-to-get-margin-value-of-a-div-in-plain-javascript
    let canvasStyle = canvas.currentStyle || window.getComputedStyle(canvas);
    const jumpLoc = {
        "x": jqJumpPic.position().left + jqJumpPic.outerWidth(true) / 2.0,
        "y": jqJumpPic.position().top + jqJumpPic.outerHeight(true) / 2.0 - parseInt(canvasStyle.marginTop)
    };
    // Show the map objects corresponding to the current system
    for (let i = 0; i<planets.length; i++) {
        const img = new Image();
        img.src = getPlanet(planets[i]).img;
        planetImages = planetImages + img.src;
        img.onload = function() {
            const p = getPlanet(planets[i]).placement;
            const args = [img, p[0], p[1], p[2], p[3], coords[i].x*cWidth, coords[i].y*cHeight, p[4], p[5]];
            ctx.drawImage(...args);
        }
        let routes = mapGetRoutes(planets[i]);
        // Using canvas to draw lines between planets where routes exist
        for (let j = 0; j<routes.length; j++) {
            const start = getPlanet(getRoute(routes[j].name).start);
            const destination = getPlanet(getRoute(routes[j].name).destination);
            // Checking whether a planet is in the system or not
            if (destination.starsystem === start.starsystem) {
                // Compute offsets and indices
                const startOffSetX = start.placement[4]*0.5;
                const startOffSetY = start.placement[5]*0.5;
                const destOffSetX = destination.placement[4]*0.5;
                const destOffSetY = destination.placement[5]*0.5;
                const sIndex = planets.indexOf(start.id);
                const dIndex = planets.indexOf(destination.id);
                // Draw the path
                ctx.beginPath();
                ctx.moveTo(startOffSetX + coords[sIndex].x*cWidth, startOffSetY + coords[sIndex].y*cHeight);
                ctx.lineTo(destOffSetX + coords[dIndex].x*cWidth, destOffSetY + coords[dIndex].y*cHeight);
                ctx.strokeStyle = $("#systemJumpPic").css("color");
                ctx.stroke();
            }
            else{
                // If the route is to another system, draw the edge to the jump location
                // Compute offsets and indices
                const p = getPlanet(planets[i]).placement;
                const startOffSetX = p[4]*0.5;
                const startOffSetY = p[5]*0.5;
                // Draw the path
                ctx.beginPath();
                ctx.moveTo(startOffSetX + coords[i].x*cWidth, startOffSetY + coords[i].y*cHeight);
                ctx.lineTo(jumpLoc.x, jumpLoc.y);
                ctx.strokeStyle = $("#systemJumpPic").css("color");
                ctx.stroke();
            }
        }
    }

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
 * @returns {[string]} array of the route-objects
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

