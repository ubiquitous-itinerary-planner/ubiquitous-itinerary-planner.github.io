/**
 * Initializes the topBar element, and its children.
 */
function topBarInit(){
    // Initialize children:
    let p = document.getElementById("topBar");
    homeBtnInit(p);
    helpBtnInit(p);
    languageBtnInit(p);
}

/**
 * Initializes the button which returns the user to the most zoomed-out view of the map.
 * @param parent the parent into which to add the button
 */
function homeBtnInit(parent){
    let homeBtn = document.createElement("button");
    homeBtn.innerHTML = "Home Button"
    homeBtn.id = "homeButton";
    homeBtn.classList.add("topBarButton");
    parent.appendChild(homeBtn);
    /* TODO: Add click event */
}

/**
 * Initializes the help button.
 * @param parent the parent into which to add the button
 */
function helpBtnInit(parent){
    let helpBtn = document.createElement("button");
    helpBtn.innerHTML = "Help Button"
    helpBtn.id = "helpButton";
    helpBtn.classList.add("topBarButton");
    //helpBtn.onclick=helpTutorial;
    parent.appendChild(helpBtn);
}

/**
 * Initializes the language button.
 * @param parent the parent into which to add the button
 */
function languageBtnInit(parent){
    let languageBtn = document.createElement("button");
    languageBtn.innerHTML = "Language Button"
    languageBtn.id = "activeLanguageButton";
    languageBtn.classList.add("topBarButton");
    languageBtn.onclick=change_lang; 
    parent.appendChild(languageBtn);
}