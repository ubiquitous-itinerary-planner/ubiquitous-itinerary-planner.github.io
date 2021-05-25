/**
 * Javascript for initialising the application.
 */

import {depInit} from "./sideMenu.js";
import {mapDraw, mapInit, sleep} from "./map.js";
import {topBarInit} from "./topBar.js";
import {update_dict_view} from "./databases/dictionaryUIP2.js";


export const START_DATE = new Date();
export let screenMediaSize;

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
$(window).resize(async function(){
    updateSize();
    // Ensure that resizing is done before drawing
    // This does cause flickering if the screen is resized rapidly, there a better solution?
    await sleep(20);
    mapDraw();
});

/**
 * Handles breakpoints.
 * Updates the css, depending on which side of the breakpoint we are.
 */
function updateSize(){

    // https://www.w3schools.com/jsref/met_win_matchmedia.asp
    if(window.matchMedia("screen and (min-device-width: 800px)").matches){
        screenMediaSize = "desktop";
        /* The following code is executed if we are on a desktop-sized screen */
        document.getElementById("mediaSize").href = "css/desktop.css";
        update_dict_view();
    }
    else{
        screenMediaSize = "mobile";
        /* The following code is executed if we are on a mobile-sized screen */
        document.getElementById("mediaSize").href = "css/mobile.css";
        update_dict_view();
    }
}