/**
 * Initializes the topBar element, and its children.
 */
export function topBarInit(){
    // Initialize children:
    let p = document.getElementById("topBar");
    homeBtnInit(p);
    helpBtnInit(p);
    languageBtnInit(p);
}

/**
 * Initializes the button which returns the user to the most zoomed-out view of the map.
 */
function homeBtnInit(parent){
    let homeBtn = document.createElement("button");
    homeBtn.innerHTML = "Home Button"
    homeBtn.id = "homeButton";
    parent.appendChild(homeBtn);
}

/**
 * Initializes the help button.
 */
function helpBtnInit(parent){

}

/**
 * Initializes the language button.
 */
function languageBtnInit(parent){

}