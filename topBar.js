/**
 * Initializes the topBar element, and its children.
 */
import {mapMove} from "./map.js";
import {change_lang, get_string} from "./databases/dictionaryUIP2.js";

export function topBarInit(){
    // Initialize children:
    let p = document.getElementById("topBar");
    p.textContent = "";
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
    homeBtn.onclick = function (){
        mapMove();
    }
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
    // Create the text part
    let language = document.createElement("div");
    language.id = "activeLanguageButton";
    // Create the flag part
    let flag = document.createElement("img");
    flag.id = 'langPic';
    flag.setAttribute("alt", get_string("flagAltText"));
    languageBtn.classList.add("topBarButton");
    languageBtn.onclick=change_lang;
    // Add the parts to the button, and add the button to the parent
    languageBtn.appendChild(flag);
    languageBtn.appendChild(language);
    parent.appendChild(languageBtn);
}