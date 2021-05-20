/**
 * Returns the route-object associated with the passed ID.
 * @param id the id to search for
 */
function getRoute(id){
    for(let i = 0; i < RDB.routes.length; i++){
        if(RDB.routes[i].id === id){
            return RDB.routes[i];
        }
    }
}

/**
 * Returns the cheapest route-object between the planets with given IDs.
 * Returns undefined if there is no route-object between those planets.
 */
function getCheapestRoute(start, destination){
    let cheapest = undefined;
    for(let i = 0; i < RDB.routes.length; i++){
        if((RDB.routes[i].start === start && RDB.routes[i].destination === destination) ||
            (RDB.routes[i].destination === start && RDB.routes[i].start === destination)){
            if(cheapest === undefined){
                cheapest = RDB.routes[i];
            }
            else if(RDB.routes[i].price < cheapest.price){
                cheapest = RDB.routes[i];
            }
        }
    }
    return cheapest;
}