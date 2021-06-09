/**
 * Initializes the topBar element, and its children.
 */
import {mapMove} from "./map.js";
import {change_lang, get_string, update_dict_view} from "./databases/dictionaryUIP2.js";
import {hyperspaceToggleAnimate, hyperspaceToggleMute} from "./hyperspace.js";
import {helpTutorial} from "./tutorial.js";
import {screenMediaSize} from "./init.js";

let animation;
let sound;
sound = true;
animation = true;
export function topBarInit(){
    // Initialize children:
    let p = document.getElementById("topBar");
    p.textContent = "";
    homeBtnInit(p);
    helpBtnInit(p);
    languageBtnInit(p);
    animationBtnInit(p);
    soundBtnInit(p);
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
    helpBtn.onclick=helpTutorial;
    parent.appendChild(helpBtn);
}

/**
 * Initializes the language button.
 * @param parent the parent into which to add the button
 */
function languageBtnInit(parent){
    let languageBtn = document.createElement("button");
    languageBtn.id = "languageButton";
    // Create the text part
    let language = document.createElement("div");
    if(screenMediaSize === "mobile") {
        language.id = "activeLanguageButtonShort";
    }
    else{
        language.id = "activeLanguageButton";
    }
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

/**
 * Initializing the animation on and animation off button.
 * @param parent the parent into which to add the button
 */
function animationBtnInit(parent){
    let animationBtn = document.createElement("button");
    animationBtn.id = "animationButton";
    // creating the picture of animation on and setting id, alt-text for dictionary if variable
    // animation is on, otherwise creating all above for animation off.
    if (animation) {
        let animationOnPic = document.createElement("img");
        animationOnPic.id = 'animationOnPic';
        animationOnPic.setAttribute("alt", get_string("animationOnAltText"));
        animationBtn.appendChild(animationOnPic);
    } else {
        let animationOffPic = document.createElement("img");
        animationOffPic.id = 'animationOffPic';
        animationOffPic.setAttribute("alt", get_string("animationOffAltText"));
        animationBtn.appendChild(animationOffPic);
    }
    // Assigning the whole button a class for css
    animationBtn.classList.add("topBarButton");
    // TODO onclick=start/stop animation
    animationBtn.onclick=animationOnOff;
    // Add the animation on or off picture to the button, and add the button to the top bar.
    parent.appendChild(animationBtn);
}

/**
 * Checking if animation is on or off and switching.
 */
function animationOnOff(){
    animation = !animation;
    hyperspaceToggleAnimate();
    update_dict_view();
}

/**
 * Initializing the sound on and sound off button.
 * @param parent the parent into which to add the button
 */
function soundBtnInit(parent){
    let soundBtn = document.createElement("button");
    soundBtn.id = "soundButton";
    // creating the picture of sound on and setting id, alt-text for dictionary if variable
    // sound is on, otherwise creating all above for sound off.
    if (sound) {
        let soundOnPic = document.createElement("img");
        soundOnPic.id = "soundOnPic";
        soundOnPic.setAttribute("alt", get_string("soundOnAltText"));
        soundBtn.appendChild(soundOnPic);
    } else {
        let soundOffPic = document.createElement("img");
        soundOffPic.id = "soundOffPic";
        soundOffPic.setAttribute("alt", get_string("soundOffAltText"));
        soundBtn.appendChild(soundOffPic);
    }
    // Assigning the whole button a class for css
    soundBtn.classList.add("topBarButton");
    // TODO onclick= turning on/off sound
    soundBtn.onclick=soundOnOff;
    // Add the sound on or off picture to the button, and add the button to the top bar.
    parent.appendChild(soundBtn);
}

/**
 * Checking if sound is on or off and switching.
 */
function soundOnOff(){
    sound = !sound;
    hyperspaceToggleMute();
    update_dict_view();
}

// ===========================================================================
// END OF FILE
// ===========================================================================