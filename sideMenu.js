/**
 * Code managing an the side-menu, consisting of the "Departure" selection, and the "Itinerary" information.
 */

/*
 * View/Controller code
 */

import {hyperjump} from "./hyperspace.js";
import {commit} from "./undo.js";
import {START_DATE} from "./init.js";

/**
 * Initializes the departure element, and its children.
 */
export function depInit(){
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
    itPushCommit({id: start, price: 0, duration: 0, company: ""}); // Add the start planet to the itinerary
    itUpdate();
}

/**
 * Re-draws the itinerary
 */
function itUpdate(){
    /* Path = [{id: num, price: num, duration: num, company: string}] */
    let path = itGet();
    /* Find arrival times for the planets of the path */
    let dates = [];
    dates[0] = START_DATE;
    for(let i = 1; i < path.length; i++){
        let d = new Date(dates[i-1]);
        d.setDate(d.getDate() + parseInt(path[i].duration));
        dates.push(d);
    }
    /* Elements to write to */
    let body = document.getElementById("itinerary_body");
    body.innerHTML = "";
    let editable = document.getElementById("itinerary_body_editable");
    editable.innerHTML = "";
    let destinations = document.createElement("div");
    destinations.id = "itinerary_body_editable_destinations";
    destinations.classList.add("hiddenScroll");
    let footer = document.getElementById("itinerary_footer");
    footer.innerHTML = "";

    /* Available destinations */
    // The "Available destinations:" text
    let availDest = document.createElement("div");
    availDest.id = 'availDest';
    editable.appendChild(availDest);
    editable.appendChild(destinations);

    // The "X"
    let xBtn = document.createElement("canvas");
    // 1:1 aspect ratio
    xBtn.width = 32;
    xBtn.height = 32;
    editable.appendChild(xBtn);
    xBtn.id = 'xBtn';
    let ctx = xBtn.getContext("2d");
    ctx.lineWidth = 1;
    // Draw the path
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(xBtn.width, xBtn.height);
    ctx.moveTo(xBtn.width, 0);
    ctx.lineTo(0, xBtn.height);
    // Commit the path
    ctx.strokeStyle = $("#xBtn").css("color");
    ctx.stroke();
    // Add click functionality
    xBtn.onclick = function (){
        // If there is only one last element, return to departures
        if(itGet().length === 1){
            itClearCommit();
            update_dict_view();
            // Toggle visibility of the departure and the itinerary
            $("#departure").css("display", "initial");
            $("#itinerary").css("display", "none");
        }
        // Otherwise remove the last element
        else{
            itPopCommit();
            itUpdate();
            update_dict_view();
        }
    };
    // Accessibility
    xBtn.tabIndex = 0;
    xBtn.setAttribute("role", "button");

    let outRoutes = mapGetRoutes(path[path.length-1].id);
    for(let i = 0; i < outRoutes.length; i++){
        let inReverse;
        let route = getRoute(outRoutes[i].name);
        // Check if the route is taken in reverse direction
        inReverse = path[path.length-1].id === route.destination;
        itAddAvailableDestination(destinations, route, inReverse);
    }
    /* Add planets */
    let sumPrice = 0;
    if(path.length > 1){
        /* Add the last planet to the "editable" element */
        itAddPlanet(editable, path[path.length-1], dates[path.length-1]);
        sumPrice += parseInt(path[path.length-1].price);
        /* Add the rest of the planets of the path */
        for(let i = path.length-2; i >= 1; i--){
            itAddArrow(body);
            itAddPlanet(body, path[i], dates[i]);
            sumPrice += parseInt(path[i].price);
        }
        itAddArrow(body);
        /* Add the first planet */
        itAddFirstPlanet(body, path[0], dates[0]);
        sumPrice += parseInt(path[0].price);
    }
    else{
        /* Add the first planet */
        itAddFirstPlanet(editable, path[0], dates[0]);
        sumPrice += parseInt(path[0].price);
    }

    /* Footer */
    let footerText = document.createElement("div");
    footerText.id = "itinerary_footer_text";
    footerText.classList.add("centered-vertical");
    let sumDays = Math.floor((dates[path.length-1]-dates[0]) / (1000*60*60*24));

    footerText.innerHTML = "<span class='totalTravelTime'></span><span> " + sumDays + " </span><span class='days'></span><br>" +
        "<span class='totalTravelCost'></span><span> " + sumPrice + " </span><span class='spaceDollar'></span>";
    let clearBtn = document.createElement("button");
    clearBtn.id = 'itinClearBtn';
    clearBtn.classList.add("centered-vertical");
    clearBtn.onclick = function (){
        itClearCommit();
        update_dict_view();
        // Toggle visibility of the departure and the itinerary
        $("#departure").css("display", "initial");
        $("#itinerary").css("display", "none");
    };
    footer.appendChild(footerText);
    footer.appendChild(clearBtn);

    /* Do some dynamic styling */
    let bodyH = $("#itinerary_body").css("height");
    document.getElementById("itinerary_body_editable").style.maxHeight = "calc(95% - " + bodyH +")";
    body.scrollTo(0, body.scrollHeight);
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
    let p = document.createElement("h3");
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
            hyperjump();
            itInit(pid);
            infoUpdate(pid);
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
 * @param inReverse true iff the route is traversed in the reverse direction
 */
function itAddAvailableDestination(parent, route, inReverse){
    let destination = route.destination;
    if(inReverse){
        destination = route.start;
    }
    /* Text box with info */
    let text = document.createElement("div");
    text.innerHTML = "<span class='to'></span><span>: </span>" + get_string(getPlanet(destination).name) + "<span> (</span>" + get_string(getPlanet(destination).starsystem) + "<span>)</span>" + "<br>" +
        "<span class='spaceline'></span><span>: " + route.company + "</span><br>" +
        "<span class='duration'></span><span>: " + route.duration + " " + "<span class='days'></span></span><br>" +
        "<span class='price'></span><span>: " + route.price + " " + "<span class='spaceDollar'></span></span>";

    /* Button to add the route */
    let btn = document.createElement("button");
    btn.classList.add("addButton");
    btn.onclick = function (){
        // Do a jump if we jump between systems
        // TODO: Move the responsibility of calling this animation to the map function which moves between views
        if(getPlanet(route.start).starsystem !== getPlanet(route.destination).starsystem){
            hyperjump();
        }
        itPush({id: destination, price: route.price, duration: route.duration, company: route.company});
        itUpdate();
        infoUpdate(getPlanet(destination).id);
        update_dict_view();
    };
    /* Div containing the above */
    let div = document.createElement("div");
    div.classList.add("itinerary_destination");
    div.classList.add("centered-horizontal");
    div.appendChild(text);
    div.appendChild(btn);
    /* Append to parent */
    parent.appendChild(div);
}

/**
 * Adds the planet with passed id into the first position of the passed parent object
 * @param parent the object where to insert the planet
 * @param planet the planet to insert
 * @param date the date of arrival
 */
function itAddPlanet(parent, planet, date){
    let p = getPlanet(planet.id);
    let div = document.createElement("div");
    div.innerHTML = "<span>" + get_string(p.name) + "</span><br>" +
        "<span class='date'></span><span>: " + new Intl.DateTimeFormat(language).format(date) + "</span><br>" +
        "<span>" + planet.company + "</span><br>" +
        "<span>" + planet.price + " " +"</span>" + "<span class='spaceDollar'></span>";
    parent.insertBefore(div, parent.firstChild);
}

/**
 * Adds the planet with passed id into the first position of the passed parent object.
 * The output is formatted as though the planet is the first planet of the itinerary.
 * @param parent
 * @param planet
 * @param date
 */
function itAddFirstPlanet(parent, planet, date){
    let p = getPlanet(planet.id);
    let div = document.createElement("div");
    div.innerHTML = "<span class='depFrom'></span><span>: " + get_string(p.name) +
        "<span> (</span>" + get_string(p.starsystem) + ")</span><br>" +
        "<span class='date'></span><span>: " + new Intl.DateTimeFormat(language).format(date) + "</span>"
    parent.insertBefore(div, parent.firstChild);
}

/**
 * Adds a downwards arrow into the first position of the passed parent object
 * @param parent the parent object
 */
function itAddArrow(parent){
    let arrow = document.createElement("img");
    arrow.setAttribute("alt", "arrowAltText");
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
export function itPushCommit(planet){
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
export function itPopCommit(){
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
export function itClearCommit(){
    commit();
    itClear();
}

/**
 * Returns a (deep) copy of the itinerary.
 * That is, the itinerary will be a copy of the itinerary at this point in time, and future changes to the itinerary
 * will not be seen in the copy returned by this function.
 * @returns {any} a copy of the itinerary
 */
export function itGet(){
    return JSON.parse(JSON.stringify(itinerary));
}

/**
 * Sets the itinerary to the passed value.
 * @param itin the itinerary to change the current itinerary to
 */
export function itSet(itin){
    itinerary = itin;
}