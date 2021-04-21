/*
 * View code
 */

/**
 * Initializes the map element, and its children.
 */
function mapInit(){

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
 * @param planet
 */
function mapAddPlanet(planet){
    let id = planet.id;
    map.setNode(id);
    map.setParent(id, planet.starsystem);
}

/**
 * Adds a route to the map.
 * @param route
 */
function mapAddRoute(route){
    let source = route.start;
    let target = route.destination;
    let label = undefined;
    let name = route.id;
    // The case where the route is in the same star system
    if(map.parent(source) === map.parent(target)){
        map.setEdge(source, target, label, name);
    }
    // The case where a jump is needed
    else{
        map.setEdge(source, map.parent(source), label, name);
        map.setEdge(map.parent(source), map.parent(target), label, name);
        map.setEdge(map.parent(target), target, label, name);
    }
}

/**
 * Returns an array containing the names of all star systems in the map.
 * @returns {*}
 */
function mapGetSystems(){
    return map.children();
}

/**
 * Returns the ids of all planets in the passed system. If the passed system is null or undefined, return the ids of
 * all planets in the map.
 * @param system
 * @returns {*}
 */
function mapGetPlanets(system){
    if(system === undefined){
        return map.nodes();
    }
    else {
        return map.children(system);
    }
}

/**
 * Returns a route from the start to the destination, using Dijkstra's algorithm.
 * This function optimises for number of jumps.
 *
 * @param start
 * @param destination
 * @returns {[]}
 */
function mapRouteShortest(start, destination){
    let dijkstra = graphlib.alg.dijkstra(map, start);
    return findPath(dijkstra, start, destination);
}

/**
 * Returns a route from the start to the destination, using Dijkstra's algorithm.
 * This function optimises for lowest travel price.
 * @param start
 * @param destination
 * @returns {[]}
 */
function mapRouteCheapest(start, destination){
    function weight(e) {
        return getRoute(e.name).price;
    }
    let dijkstra = graphlib.alg.dijkstra(map, start, weight);
    return findPath(dijkstra, start, destination);
}

/**
 * Function enumerating the path from start to destination, using the output from graphlib.alg.dijkstra.
 * @param dijkstra
 * @param start
 * @param destination
 * @returns {[]}
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