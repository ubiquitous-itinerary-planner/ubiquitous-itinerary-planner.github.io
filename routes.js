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