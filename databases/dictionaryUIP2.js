// ------------------------------------------------------------------------
// Code written by Felix Lager
// ------------------------------------------------------------------------
let language = 'en';
let dict = {
    //top bar menu
    'text' : ['homeButton', 'helpButton', 'activeLanguage', 'title', 'itinButton', 'addButton', 'removeButton', 'clearItin', 'planetView', 'systemJump', 
    //Planet database variable translations
    'name', 'starsystem', 'size', 'population', 'climate', 'infrastructure', 'breathable', 'usp', 'meantemp', 'animalspecies', 'government', 'gravity', 
    'culturalusp', 'hoursperday', 'currency', 'language', 'domesticanimals', 'percentualwatersurface', 'standardmealcost', 
    //Planet database answer translations
    'earth', 'solarSystem', 'earthSummerBalanced', 'earthLike', 'yes', 'startOfCivilisation', 'selfcontrolled', 'skansen', 'spaceDollar', 'english', 
    'mars', 'frozenDesert', 'marsLike', 'no', 'marsianAndEnglish', 'duskyAndChill', 'futuristic', 'rainAndStormy', 'volcanicLavaStreams', 'hotDaysFrozenNightsDesert', 'thirdWorld', 
    'dry', 'flourishing', 'dryAndHot'],
    //Pictures
    'pics' : ['langPic'],

    'en' : {
        //top bar menu
        'homeButton' : "Star system view",
        'helpButton': "Help",
        'activeLanguage': "English",
        'title' : "Itinerary Planner",
        'itinButton': "Itinierary",
        'addButton': "Add",
        'removeButton': "Remove",
        'clearItin': "Clear Itinerary",
        'planetView': "Planet view",
        'systemJump': "System jump location",
        //Planet database variable translations
        'name': "Name:",
        'starsystem': "Star system:",
        'size': "Size:",
        'population': "Population:",
        'climate': "Climate:",
        'infrastructure': "Infrastructure:",
        'breathable': "Breathable air:",
        'usp': "Unique selling point:",
        'meantemp': "Average temperature:",
        'animalspecies': "Animal species:",
        'government': "Government:",
        'gravity': "Gravity:",
        'culturalusp': "Cultural unique selling point:",
        'hoursperday': "Number of hours per day:",
        'currency': "Currency:",
        'language': "Language:",
        'domesticanimals': "Domestican animals:",
        'percentualwatersurface': "Percentual water surface:",
        'standardmealcost': "Standard cost of a meal:",
        //Planet database answer translations
        'earth': "Planet Earth",
        'solarSystem': "Solar System", 
        'earthSummerBalanced': "Earth summer balanced",
        'earthLike': "Earth-like",
        'yes': "Yes",
        'startOfCivilisation': "Start of civilisation", 
        'selfcontrolled': "Self controlled", 
        'skansen': "Skansen", 
        'spaceDollar': "Space dollar", 
        'english': "English",
        'mars': "Mars",
        'frozenDesert': "Frozen desert",
        'marsLike': "Mars-like",
        'no': "No",
        'marsianAndEnglish': "Marsian and English",
        'duskyAndChilly': "Dusky and chilly",
        'futuristic': "Futuristic",
        'rainAndStormy': "Rain and stormy",
        'volcanicLavaStreams': "Volcanic lava streams",
        'hotDaysFrozenNightsDesert': "Hot days and frozen nights desert",
        'thirdWorld': "Third world",
        'dry': "Dry",
        'flourishing': "Flourishing",
        'dryAndHot': "Dry and hot",
        //Pictures
        'langPic': "images/eng.png"
    },

    'sv' : {
        //top bar menu
        'homeButton' : "Stjärnsystemsvy",
        'helpButton': "Hjälp",
        'activeLanguage': "Svenska",
        'title' : "Resvägsplanerare",
        'itinButton': "Reseplan",
        'addButton': "Lägg till",
        'removeButton': "Ta bort",
        'clearItin': "Rensa reseplan",
        'planetView': "Planetvy",
        'systemJump': "Stjärnsystemshopp",
        //Planet database variable translations
        'name': "Namn:",
        'starsystem': "Stjärnsystem:",
        'size': "Size:",
        'population': "Populationsmängd:",
        'climate': "Climate:",
        'infrastructure': "Infrastruktur:",
        'breathable': "Andningsbar luft:",
        'usp': "Unique selling point:",
        'meantemp': "Medeltemperatur:",
        'animalspecies': "Animal species:",
        'government': "Government:",
        'gravity': "Gravity:",
        'culturalusp': "Cultural unique selling point:",
        'hoursperday': "Number of hours per day:",
        'currency': "Currency:",
        'language': "Language:",
        'domesticanimals': "Domestican animals:",
        'percentualwatersurface': "Percentual water surface:",
        'standardmealcost': "Standard cost of a meal:",
        //Planet database answer translations
        'earth': "Jorden",
        'solarSystem': "Solsystemet",
        'mars': "Mars",
        //Bilder
        'langPic': "images/se.png"
    }
}

// returns the string for each key 
function get_string(key) {
    return dict[language][key];
}

//handles change of language
function change_lang() {
    if (language === 'en') {
        language = 'sv';
    } 
    else {
        language = 'en'
    }

    update_dict_view();
}

// ------------------------------------------------------------------------
// ska nog lägga denna kod i controllern istället
// ------------------------------------------------------------------------
// updates the view with correct strings - depending on selected language
// using # for divname- and . for classname searching
function update_dict_view() {
    let text = dict['text'];
    for (let idx in text) {
        let key = text[idx];
        $("#" + key).text(get_string(key));
        $("." + key).text(get_string(key));
    }
    let pics = dict['pics'];
    for (let idx in pics) {
        let pic = pics[idx];
        $("#" + pic).attr('src', get_string(pic));
        $("." + pic).attr('src', get_string(pic));
    }
    // Update page title
    $(document).attr("title", get_string("title"));
}
// ===========================================================================
// END OF FILE
// ===========================================================================