/**
 * Create div over help button with a box shadow that darken the entire rest of the screen and starts tutorial mode.
 */
export function helpTutorial () {
    //Create individual divs and applies non-general style
    const parent = document.getElementById("tutorial");
    createTutorialDiv(parent, "helpDiv", "186px", "0px", "50px", "200px");
    createTutorialDiv(parent, "homeDiv", "0px", "0px", "50px", "200px");
}

/**
 * Creates tutorial divs based on style values from helpTutorial
 * @param parent - Where we place the div
 * @param id - The individual ids of tutorial "areas"
 * @param left - div position left
 * @param top - div position top
 * @param height - div height
 * @param width - div width
 */
function createTutorialDiv (parent, id, left, top, height, width){
    //Create div element
    const tutorialDiv = document.createElement('div');
    //Assign id and class to div
    tutorialDiv.id = id;
    tutorialDiv.classList.add("help");
    //Style div
    tutorialDiv.style.left = left;
    tutorialDiv.style.top = top;
    tutorialDiv.style.height = height;
    tutorialDiv.style.width = width;
    //Add div to parent
    parent.appendChild(tutorialDiv);
}