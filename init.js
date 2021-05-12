/**
 * Javascript for initialising the application.
 */

import {depInit} from "./sideMenu.js";

export const START_DATE = new Date();

$("document").ready(function() {

    /* Set CSS depending on screen size */
    updateSize();

    /* Initialize elements */
    mapInit();
    depInit();
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