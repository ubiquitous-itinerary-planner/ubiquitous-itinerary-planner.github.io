/**
 * Javascript for initialising the application.
 */

import {infoInit} from "./info.js";
import {itInit} from "./itinerary.js";
import {mapInit} from "./map.js";
import {topBarInit} from "./topBar.js";
import {update_dict_view} from "./dictionaryUIP2.js";

$("document").ready(function() {

    /* Set CSS depending on screen size */
    updateSize();

    /* Initialize elements */
    infoInit();
    itInit();
    mapInit();
    topBarInit();
    update_dict_view();
});


// This is called whenever the screen is resized.
$(window).resize(function(){
    updateSize();
});

/**
 * Handles breakpoints.
 * Updates the css, depending on which side of the breakpoint we are.
 */
function updateSize(){
    // https://www.w3schools.com/jsref/met_win_matchmedia.asp
    if(window.matchMedia("screen and (min-width: 800px)").matches){
        /* The following code is executed if we are on a desktop-sized screen */
        document.getElementById("mediaSize").href = "css/desktop.css";
    }
    else{
        /* The following code is executed if we are on a mobile-sized screen */
        document.getElementById("mediaSize").href = "css/mobile.css";
    }
}