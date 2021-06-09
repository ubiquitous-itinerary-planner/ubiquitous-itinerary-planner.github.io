/**
 * Create div over help button with a box shadow that darken the entire rest of the screen and starts tutorial mode.
 */
import {itPeek} from "./sideMenu.js";
import {get_string, update_dict_view} from "./databases/dictionaryUIP2.js";

let helpClass;
let textDiv;

/**
 * Changes the class name of the text div to the passed class name.
 * @param newClass
 */
function setHelpClass(newClass){
    textDiv.classList.remove(helpClass);
    helpClass=newClass;
    textDiv.classList.add(helpClass);
    update_dict_view();
    textDiv.innerHTML += "<div>" + get_string("exitDivText" ) + "</div>";
}

/**
 * Creates the tutorial view/overlay
 */
export function helpTutorial () {
    const parent = document.getElementById("tutorial");
    // Create individual divs and applies non-general style
    createTutorialDiv(parent, "helpDiv", "helpButton");
    createTutorialDiv(parent, "homeDiv", "homeButton");
    createTutorialDiv(parent, "languageDiv", "languageButton");
    createTutorialDiv(parent, "animationDiv", "animationButton");
    createTutorialDiv(parent, "soundDiv", "soundButton");
    createTutorialDiv(parent, "mapDiv", "map");

    if (itPeek()!== undefined){
        createTutorialDiv(parent, "itineraryDiv", "itinerary");
    }
    else {
        createTutorialDiv(parent, "departureDiv", "departure");
    }

    // Add the click event to the home div, in order to exit the tutorial
    document.getElementById("helpDiv").onclick = function () {
        parent.innerHTML = "";
    };

    // Create the div showing the help text
    textDiv = document.createElement('div');
    textDiv.id = "helpText";
    parent.appendChild(textDiv); // Add the div before setting its class, to update its text properly
    setHelpClass("helpDivText");
}

/**
 * Creates tutorial divs based on style values from helpTutorial
 * @param parent - Where we place the div
 * @param id - The individual ids of tutorial "areas"
 * @param templateId - The id of the element to overlap with the tutorial element
 */
function createTutorialDiv (parent, id, templateId){
    // Create div element
    const tutorialDiv = document.createElement('div');
    // Assign id and class to div
    tutorialDiv.id = id;
    tutorialDiv.classList.add("help");
    // Style div based on template
    const jqTemplate = $("#" + templateId);
    const pos = jqTemplate.position();
    tutorialDiv.style.left = pos.left + "px";
    tutorialDiv.style.top = pos.top + "px";
    tutorialDiv.style.marginTop = jqTemplate.css('marginTop');
    tutorialDiv.style.height = jqTemplate.outerHeight() + "px";
    tutorialDiv.style.width = jqTemplate.outerWidth() + "px";
    tutorialDiv.tabIndex = 0;
    // Change the explanatory text showing when focus is changed
    tutorialDiv.onfocus = function(){
        setHelpClass(id + "Text");
    }

    // Add div to parent
    parent.appendChild(tutorialDiv);
}