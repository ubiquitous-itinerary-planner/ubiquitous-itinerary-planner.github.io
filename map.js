/*
 * View/Controller code
 */

import {hyperjump, hyperspaceIsAnimated} from "./hyperspace.js";
import "./libraries/graphlib.js";
import {coordinates} from "./databases/coordinatesDB.js";
import {get_string} from "./databases/dictionaryUIP2.js";
import {infoUpdate} from "./info.js";
import {screenMediaSize} from "./init.js";
import {itPeek} from "./sideMenu.js";

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
    // Get the canvas
    const canvas = document.getElementById("map");
    const ctx = canvas.getContext("2d")
    const body = $("body");
    
    // If desktop css
    if(screenMediaSize === "desktop"){
        canvas.width = body.width() * 0.67;
        canvas.height = body.height() * 0.9375;
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";
        // because margin-top, if given as %, is based on the parent's WIDTH and not HEIGHT
        canvas.style.marginTop = "calc(" + body.height() + "px - " + canvas.style.height + ")";
    }
    // If mobile css
    if(screenMediaSize === "mobile"){
        canvas.width = body.width() * 1;
        canvas.height = body.height() * 0.57;
        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";
        // because margin-top, if given as %, is based on the parent's WIDTH and not HEIGHT
        canvas.style.marginTop = "calc(0.0875 * " + body.height() + "px)";
    }

    const canvasOffsetTop = $("#map").css("margin-top");
    // Get the container for the click-boxes
    const clickBoxesContainer = document.getElementById("clickBoxes");
    clickBoxesContainer.innerHTML = ""; // Clear the previous click-boxes
    // Hide all map objects
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Get the planets to display
    const planets = mapGetPlanets(currentSystem)
    let planetImages = [];

    const cWidth = canvas.width;
    const cHeight = canvas.height;
    const coords = coordinates[planets.length];
    const jqJumpPic = $("#systemJumpPic");
    // Checking if we are in the star system view
    if (currentSystem === undefined) {
        const systems = mapGetSystems();
        const sysCoords = coordinates[systems.length];
        // Hide the system jump location
        document.getElementById("systemJumpPic").style.display="none";
        // Insert star system view on canvas
        for (let i = 0; i<systems.length; i++) {
            const img = new Image();
            const system = getSystem(systems[i])
            const p = system.placement;
            img.src = system.img;
            img.onload = function () {
                const args = [img, p[0], p[1], p[2], p[3], sysCoords[i].x * cWidth, sysCoords[i].y * cHeight, p[4], p[5]];
                ctx.drawImage(...args);
            }
            // Add the click-box corresponding to the planet
            const clickBox = document.createElement("div");
            const imLeft = sysCoords[i].x*cWidth;
            const imTop = sysCoords[i].y*cHeight;
            clickBox.style.top = "calc(" + canvasOffsetTop + " + " + imTop.toString() + "px)";
            clickBox.style.left = imLeft.toString() + "px";
            clickBox.style.width = p[4] + "px";
            clickBox.style.height = p[5] + "px";
            clickBox.classList.add("clickBox");
            clickBoxesContainer.appendChild(clickBox);
            // Add the highlight effect
            const lightBox = document.createElement("img");
            lightBox.src = "./images/planetselection.png";
            lightBox.style.top = "calc(-5vh + " + clickBox.style.top  +")";
            lightBox.style.left = "calc(-5vh + " + clickBox.style.left + ")";
            lightBox.style.width = "calc(10vh + " + clickBox.style.width + ")";
            lightBox.style.height = "calc(10vh + " + clickBox.style.height + ")";
            if(itPeek() !== undefined && systems[i] === getPlanet(itPeek().id).starsystem){
                lightBox.style.opacity = "100%";
            }
            lightBox.classList.add("lightBox");
            clickBoxesContainer.appendChild(lightBox);
            // Add click event to the click-box
            clickBox.onclick = function (){
                mapMove(systems[i]);
            };
            const nameDiv = document.createElement("div");
            const names = PDB2.systems[i].name;
            const planetName = document.createTextNode(names);
            nameDiv.style.top = "calc(10vh + " + clickBox.style.top + ")";
            nameDiv.style.left = clickBox.style.left;
            //nameDiv.style.left = "calc(2vh + " + clickBox.style.left + ")";
            nameDiv.style.width = clickBox.style.width;
            nameDiv.style.height = clickBox.style.height;
            nameDiv.classList.add("boxName");
            nameDiv.appendChild(planetName);
            clickBoxesContainer.appendChild(nameDiv);
        }
        //v = start, w = end
        const routes = mapGetRoutes();
        for (let i = 0; i<routes.length; i++) {
            const start = getPlanet(routes[i].v);
            const dest = getPlanet(routes[i].w);
            if (start.starsystem !== dest.starsystem) {
                // Compute offsets and indices
                const sIndex = systems.indexOf(start.starsystem);
                const dIndex = systems.indexOf(dest.starsystem);
                const startOffSetX = getSystem(systems[sIndex]).placement[4]*0.5;
                const startOffSetY = getSystem(systems[sIndex]).placement[5]*0.5;
                const destOffSetX = getSystem(systems[dIndex]).placement[4]*0.5;
                const destOffSetY = getSystem(systems[dIndex]).placement[5]*0.5;
                // Draw the path
                ctx.beginPath();
                ctx.moveTo(startOffSetX + sysCoords[sIndex].x*cWidth, startOffSetY + sysCoords[sIndex].y*cHeight);
                ctx.lineTo(destOffSetX + sysCoords[dIndex].x*cWidth, destOffSetY + sysCoords[dIndex].y*cHeight);
                ctx.strokeStyle = jqJumpPic.css("color");
                ctx.stroke();
            }
        }

        return;
    }
    // Display the system jump location
    const jumpPic = document.getElementById("systemJumpPic");
    jumpPic.style.display="initial";
    // Coordinates of the centre of the jump location
    // Get the current/computed style - see https://stackoverflow.com/questions/14275304/how-to-get-margin-value-of-a-div-in-plain-javascript
    const canvasStyle = canvas.currentStyle || window.getComputedStyle(canvas);
    const jumpLoc = {
        "x": jqJumpPic.position().left + jqJumpPic.outerWidth(true) / 2.0,
        "y": jqJumpPic.position().top + jqJumpPic.outerHeight(true) / 2.0 - parseInt(canvasStyle.marginTop)
    };
    // Add the click-box corresponding to the system jump location
    const jumpBox = document.createElement("div");
    const jumpLocStyle = jumpPic.currentStyle || window.getComputedStyle(jumpPic);
    const jumpLocLeft = jqJumpPic.position().left + parseInt(jumpLocStyle.marginLeft);
    jumpBox.style.top = jqJumpPic.position().top.toString() + "px";
    jumpBox.style.left = jumpLocLeft.toString() + "px";
    jumpBox.style.width = jqJumpPic.outerWidth().toString() + "px";
    jumpBox.style.height = jqJumpPic.outerHeight().toString() + "px";
    jumpBox.classList.add("clickBox");
    clickBoxesContainer.appendChild(jumpBox);
    // Add the box for the highlight effect
    const lightBox = document.createElement("img");
    lightBox.src = "./images/planetselection.png";
    lightBox.style.top = "calc(-5vh + " + jumpBox.style.top  +")";
    lightBox.style.left = "calc(-5vh + " + jumpBox.style.left + ")";
    lightBox.style.width = "calc(10vh + " + jumpBox.style.width + ")";
    lightBox.style.height = "calc(10vh + " + jumpBox.style.height + ")";
    lightBox.classList.add("lightBox");
    clickBoxesContainer.appendChild(lightBox);
    // Add click event to the click-box
    jumpBox.onclick = function (){
        mapMove();
    };

    // Show the map objects corresponding to the current system
    for (let i = 0; i<planets.length; i++) {
        // Draw the planet
        const img = new Image();
        img.src = getPlanet(planets[i]).img;
        planetImages = planetImages + img.src;
        const imLeft = coords[i].x*cWidth;
        const imTop = coords[i].y*cHeight;
        const p = getPlanet(planets[i]).placement;
        img.onload = function() {
            const args = [img, p[0], p[1], p[2], p[3], imLeft, imTop, p[4], p[5]];
            ctx.drawImage(...args);
        }
        // Draw the outgoing routes from the planet
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
                ctx.strokeStyle = jqJumpPic.css("color");
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
                ctx.strokeStyle = jqJumpPic.css("color");
                ctx.stroke();
            }
        }
        // Add the click-box corresponding to the planet
        const clickBox = document.createElement("div");
        clickBox.style.top = "calc(" + canvasOffsetTop + " + " + imTop.toString() + "px)";
        clickBox.style.left = imLeft.toString() + "px";
        clickBox.style.width = p[4] + "px";
        clickBox.style.height = p[5] + "px";
        clickBox.classList.add("clickBox");
        clickBoxesContainer.appendChild(clickBox);
        // Add the highlight effect
        const lightBox = document.createElement("img");
        lightBox.src = "./images/planetselection.png";
        lightBox.style.top = "calc(-5vh + " + clickBox.style.top  +")";
        lightBox.style.left = "calc(-5vh + " + clickBox.style.left + ")";
        lightBox.style.width = "calc(10vh + " + clickBox.style.width + ")";
        lightBox.style.height = "calc(10vh + " + clickBox.style.height + ")";
        if(itPeek() !== undefined && planets[i] === itPeek().id){
            lightBox.style.opacity = "100%";
        }
        lightBox.classList.add("lightBox");
        clickBoxesContainer.appendChild(lightBox);
        // Add click event to the click-box
        clickBox.onclick = function (){
            infoUpdate(planets[i]);
        };
        const nameDiv = document.createElement("div");
        const names = getPlanet(planets[i]).name;
        const planetName = document.createTextNode(names);
        nameDiv.style.top = "calc(10vh + " + clickBox.style.top + ")";
        nameDiv.style.left = "calc(-5vh + " + clickBox.style.left + ")";
        nameDiv.style.width = clickBox.style.width;
        nameDiv.style.height = clickBox.style.height;
        nameDiv.classList.add("boxName");
        nameDiv.appendChild(planetName);
        clickBoxesContainer.appendChild(nameDiv);
    }
}

/**
 * Sleeps for the passed number of ms.
 * See https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
 * @param ms the time to sleep
 * @returns {Promise}
 */
export function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Move the current system to the passed system.
 * @param system id of the system to move to
 */
export async function mapMove(system){
    // No need to do anything if we're already there
    if(currentSystem === system){
        mapDraw(); // Repaint, in case highlights etc have moved
        return;
    }
    // Update model
    currentSystem = system;
    // Play animation
    hyperjump();
    // Wait for the animation to happen
    if(hyperspaceIsAnimated()) {
        await sleep(3000);
    }
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
    for(let i = 0; i < 1000; i++){ // Set an upper bound on the loop.
        path.unshift(target);
        if(target === start){
            break;
        }
        target = dijkstra[target].predecessor;
    }
    return path;
}

