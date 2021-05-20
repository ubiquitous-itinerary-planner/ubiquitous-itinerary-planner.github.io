/**
 * Code managing an the side-menu, consisting of the "Departure" selection, and the "Itinerary" information.
 */

/*
 * View/Controller code
 */

import {hyperjump} from "./hyperspace.js";
import {commit} from "./undo.js";
import {START_DATE} from "./init.js";
import {infoUpdate} from "./info.js";
import {mapDraw, mapGetPlanets, mapGetRoutes, mapGetSystems, mapMove} from "./map.js";
import {get_string, language, update_dict_view} from "./databases/dictionaryUIP2.js";

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
export function itInit(start){
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
export function itUpdate(){
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
    editable.innerHTML = "<div id=\"itinerary_body_editable_scrollable\" class=\"hiddenScroll\"></div>";
    let editableScrollable = document.getElementById("itinerary_body_editable_scrollable");
    editableScrollable.innerHTML = "";
    let destinations = document.createElement("div");
    destinations.id = "itinerary_body_editable_destinations";
    //destinations.classList.add("hiddenScroll");
    let footer = document.getElementById("itinerary_footer");
    footer.innerHTML = "";

    /* Available destinations */
    // The "Available destinations:" text
    let availDest = document.createElement("div");
    availDest.id = 'availDest';
    editableScrollable.appendChild(availDest);
    editableScrollable.appendChild(destinations);

    // The "X"
    let xBtn = document.createElement("canvas");
    // 1:1 aspect ratio
    xBtn.width = 32;
    xBtn.height = 32;
    // Add the button to the document
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
        const current = itPeek().id;
        // If there is only one last element, return to departures
        if(itGet().length === 1){
            itClearCommit();
            mapDraw();
            update_dict_view();
            // Toggle visibility of the departure and the itinerary
            $("#departure").css("display", "initial");
            $("#itinerary").css("display", "none");
        }
        // Otherwise remove the last element
        else{
            itPopCommit();
            itUpdate();
            mapDraw();
            update_dict_view();
        }
        // Update the info panel
        infoUpdate(parseInt(current));
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
        /* Add the last planet */
        itAddLastPlanet(editable, editableScrollable, path[path.length-1], dates[path.length-1]);
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
        /* Add the first and last planet */
        itAddFirstPlanet(editable, path[0], dates[0]);
        editable.firstChild.id = "lastPlanetName";
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
        mapDraw();
        update_dict_view();
        // Toggle visibility of the departure and the itinerary
        $("#departure").css("display", "initial");
        $("#itinerary").css("display", "none");
    };
    footer.appendChild(footerText);
    footer.appendChild(clearBtn);

    /* Do some dynamic styling */
    let bodyH = $("#itinerary_body").css("height");
    let itH = $("#itinerary_content").css("height");
    let editableJQ = $("#itinerary_body_editable");
    editableJQ.css("height", "auto");
    let editableH = editableJQ.css("height");
    // See https://stackoverflow.com/questions/6060992/element-with-the-max-height-from-a-set-of-elements
    let destinationOH = Math.max.apply(null, $(".itinerary_destination").map(function (){
        return $(this).outerHeight(true);
    }).get());
    editable.style.height = "calc(min(calc(" + editableH + " + " + destinationOH + "px), calc(" + itH + " - " + bodyH +")) - 6%)";
    body.scrollTo(0, body.scrollHeight);
    let planetNameH = $("#lastPlanetName").css("height");
    editableScrollable.style.height = "calc("+ editableJQ.height() + "px - " + planetNameH + ")";
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
     *    <div title>
     *      <img arrow>
     *      <h3 system></h3>
     *    </div title>
     *    <ul list>
     *       <li planet></li>
     *    </ul list>
     * </div main>
     */
    // main
    let main = document.createElement("div");
    main.classList.add("depMain");
    // title
    let title = document.createElement("div");
    title.style.display = "flex";
    title.style.cursor = "pointer";
    // elements used by title's onclick function
    let list = document.createElement("ul");
    let arrow = document.createElement("img");
    title.onclick = function (){
        if(list.style.display !== "none"){
            list.style.display = "none";
            arrow.style.transform = "rotate(0)";
        }
        else {
            list.style.display = "block";
            arrow.style.transform = "rotate(90deg)";
        }
    };
    // Activate the onclick when selected with tab and enter is pressed
    title.addEventListener("keyup", function(event){
        if(event.code === "Enter"){
            event.preventDefault();
            title.click();
        }
    })
    title.setAttribute("role", "button");
    title.tabIndex = 0;
    main.appendChild(title);
    // img arrow
    arrow.classList.add("departuresArrowPic");
    arrow.setAttribute("alt", get_string("depArrowAltText"));
    title.appendChild(arrow);
    // p system
    let p = document.createElement("h3");
    p.id = system;
    title.appendChild(p);
    // ul list
    list.classList.add("departures_list");
    list.style.display = "none";
    // li planet
    for(p in planets){
        let pid = planets[p];
        let item = document.createElement("li");
        item.id = PDB.planets[pid].name;
        item.classList.add("departures_list");
        // Clicking on the planet switches to itinerary view
        item.onclick = function(){
            mapMove(system);
            itInit(pid);
            infoUpdate(pid);
            update_dict_view();
        };
        // Activate the onclick when selected with tab and enter is pressed
        item.addEventListener("keyup", function(event){
            if(event.code === "Enter"){
                event.preventDefault();
                item.click();
            }
        })
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
        if(getPlanet(route.start).starsystem !== getPlanet(route.destination).starsystem){
            mapMove(getPlanet(destination).starsystem);
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
    div.innerHTML = "<span><b>" + get_string(p.name) +
        "</b><span> (</span>" + get_string(p.starsystem) + ")</span><br>" +
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
    div.innerHTML = "<span class='depFrom'></span><span><b>: " + get_string(p.name) +
        "</b><span> (</span>" + get_string(p.starsystem) + ")</span><br>" +
        "<span class='date'></span><span>: " + new Intl.DateTimeFormat(language).format(date) + "</span>"
    parent.insertBefore(div, parent.firstChild);
}

function itAddLastPlanet(parent, scrollableParent, planet, date){

    let p = getPlanet(planet.id);
    let div = document.createElement("div");
    div.innerHTML = "<span><b>" + get_string(p.name) +
        "</b><span> (</span>" + get_string(p.starsystem) + ")</span><br>";
    div.id = "lastPlanetName";
    let div2 = document.createElement("div");
    div2.innerHTML = "<span class='date'></span><span>: " + new Intl.DateTimeFormat(language).format(date) + "</span><br>" +
        "<span>" + planet.company + "</span><br>" +
        "<span>" + planet.price + " " +"</span>" + "<span class='spaceDollar'></span>";
    // Insert the divs
    parent.insertBefore(div, parent.firstChild);
    scrollableParent.insertBefore(div2, scrollableParent.firstChild);

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
 * Returns the last planet of the itinerary, without popping it
 * @returns {*} the last planet
 */
export function itPeek(){
    return itinerary[itinerary.length-1];
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