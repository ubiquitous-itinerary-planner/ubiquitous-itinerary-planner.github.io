// ------------------------------------------------------------------------
// Code written by Felix Lager
// ------------------------------------------------------------------------
let language = 'en';
let dict = {

    //menu and common word translations
    'text' : ['homeButton', 'helpButton', 'activeLanguage', 'departure_title', 'itinButton', 'addButton', 'removeButton', 'clearItin', 'planetView', 'systemJump',
    'yes', 'no',
    //Planet database variable translations
    'name', 'starsystem', 'size', 'population', 'climate', 'infrastructure', 'breathable', 'usp', 'meantemp', 'animalspecies', 'government', 'gravity', 
    'culturalusp', 'hoursperday', 'currency', 'language', 'domesticanimals', 'percentualwatersurface', 'standardmealcost', 
    // Planet name translations
    'earth', 'mars', 'theRestaurantAtTheEndOfTheUniverse', 'frogstarWorldA', 'frogstarWorldB', 'frogstarWorldC', 'naboo', 'coruscant', 'kamino', 
    'mustafar', 'tatooine', 'shire', 'gondor', 'rohan', 'mordor',
    // Starsystem name translations
    'solarSystem', 'frogstarSystem', 'warstarSystem', 'ringlordSystem',
    // Climate translations
    'earthBalanced', 'frozenDesert', 'restaurantclimate', 'frogstarAclim', 'frogBclim', 'frogCclim', 'earthSummerBalanced', 'duskyAndChilly', 'rainyAndStormy', 
    'volcanicLavaStreams', 'hotDaysFrozenNightsDesert', 'dry', 'flourishing', 'dryAndHot',
    // Infrastructure translations
    'earthLike', 'thirdWorld', 'marsLike', 'futuristic',
    // Unique selling point (USP) and Cultural USP translations
    'startOfCivilisation', 'skansen',
    // Government translations
    'selfcontrolled',
    // Currency translations
    'spaceDollar',
    // Language translations
    'english', 'marsianAndEnglish'],
    
    //Pictures
    'pics' : ['langPic'],

    // English translations visible on the applications view.
    'en' : {
        //menu and common word translations
        'homeButton' : "Star system view",
        'helpButton': "Help",
        'activeLanguage': "English",
        'departure_title' : "Itinerary planner",
        'itinButton': "Itinierary",
        'addButton': "Add",
        'removeButton': "Remove",
        'clearItin': "Clear Itinerary",
        'planetView': "Planet view",
        'systemJump': "System jump location",
        'yes': "Yes",
        'no': "No",
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
        // Planet name translations
        'earth': "Planet Earth", 
        'mars': "Mars", 
        'theRestaurantAtTheEndOfTheUniverse': "The Restaurant at the End of the Universe", 
        'frogstarWorldA': "Frogstar World A", 
        'frogstarWorldB': "Frogstar World B", 
        'frogstarWorldC': "Frogstar World C", 
        'naboo': "Naboo", 
        'coruscant': "Coruscant", 
        'kamino': "Kamino", 
        'mustafar': "Mustafar", 
        'tatooine': "Tatooine", 
        'shire': "Shire", 
        'gondor': "Gondor", 
        'rohan': "Rohan", 
        'mordor': "Mordor",
        // Starsystem names
        'solarSystem': "Solar System", 
        'frogstarSystem': "Frogstar System", 
        'warstarSystem': "Warstar System", 
        'ringlordSystem': "Ringlord System",
        // Climate translations
        'earthBalanced': "Earth balanced", 
        'frozenDesert': "Frozen desert", 
        'indoors': "Indoors", 
        'soft': "Soft", 
        'ruinsAndDirtyShoes': "Ruins and dirty shoes", 
        'beautifulForFishing': "Beautiful for fishing", 
        'earthSummerBalanced': "Earth summer balanced", 
        'duskyAndChilly': "Dusky and chilly", 
        'rainyAndStormy': "Rainy and stormy", 
        'volcanicLavaStreams': "Volcanic lavastreams", 
        'hotDaysFrozenNightsDesert': "Hot days and frozen nights desert", 
        'dry': "Dry", 
        'flourishing': "Flourishing", 
        'dryAndHot': "Dry and hot",
        // Infrastructure translations
        'earthLike': "Earth-like", 
        'thirdWorld': "Third world", 
        'marsLike': "Mars-like", 
        'futuristic': "Futuristic",
        // Unique selling point (USP) and Cultural USP translations
        'startOfCivilisation': "Start of civilisation", 
        'skansen': "Skansen",
        // Government translations
        'selfcontrolled': "Self-controlled",
        // Currency translations
        'spaceDollar': "Space Dollar",
        // Language translations
        'english': "English", 
        'marsianAndEnglish': "Marsian and English",
        //Pictures
        'langPic': "images/eng.png"
    },

    'sv' : {
        //top bar menu
        'homeButton' : "Stjärnsystemsvy",
        'helpButton': "Hjälp",
        'activeLanguage': "Svenska",
        'departure_title' : "Resvägsplanerare",
        'itinButton': "Reseplan",
        'addButton': "Lägg till",
        'removeButton': "Ta bort",
        'clearItin': "Rensa reseplan",
        'planetView': "Planetvy",
        'systemJump': "Stjärnsystemshopp",
        'yes': "Ja",
        'no': "Nej",
        //Planet database variable translations
        'name': "Namn:",
        'starsystem': "Stjärnsystem:",
        'size': "Storlek:",
        'population': "Population:",
        'climate': "Klimat:",
        'infrastructure': "Infrastruktur",
        'breathable': "Andningsbar luft:",
        'usp': "Unique selling point:",
        'meantemp': "Medeltemperatur:",
        'animalspecies': "Djurarter:",
        'government': "Världsstyre:",
        'gravity': "Gravitation:",
        'culturalusp': "Cultural unique selling point:",
        'hoursperday': "Antal timmar per dag:",
        'currency': "Valuta:",
        'language': "Språk:",
        'domesticanimals': "Inhemska djur:",
        'percentualwatersurface': "Procentuell vattenyta:",
        'standardmealcost': "Kostnad av generell måltid:",
        // Planet name translations
        'earth': "Jorden", 
        'mars': "Mars", 
        'theRestaurantAtTheEndOfTheUniverse': "Restaurangen i slutet av Universum", 
        'frogstarWorldA': "Frogstar Värld A", 
        'frogstarWorldB': "Frogstar Värld B", 
        'frogstarWorldC': "Frogstar Värld C", 
        'naboo': "Naboo", 
        'coruscant': "Coruscant", 
        'kamino': "Kamino", 
        'mustafar': "Mustafar", 
        'tatooine': "Tatooine", 
        'shire': "Shire", 
        'gondor': "Gondor", 
        'rohan': "Rohan", 
        'mordor': "Mordor",
        // Starsystem names
        'solarSystem': "Solsystemet", 
        'frogstarSystem': "Frogstarsystemet", 
        'warstarSystem': "Warstarsystemet", 
        'ringlordSystem': "Ringlordsystemet",
        // Climate translations
        'earthBalanced': "Jorden-balanserat", 
        'frozenDesert': "Fryst öken", 
        'indoors': "Inomhus", 
        'soft': "Mjukt", 
        'ruinsAndDirtyShoes': "Ruiner och trasiga skor", 
        'beautifulForFishing': "Vackert för fiske", 
        'earthSummerBalanced': "Jorden-sommar-balanserat", 
        'duskyAndChilly': "Dunkelt och svalt", 
        'rainyAndStormy': "Regnigt och stormigt", 
        'volcanicLavaStreams': "Vulkaniska lavaströmmar", 
        'hotDaysFrozenNightsDesert': "Heta dagar och frusna nätter-öken", 
        'dry': "Torrt", 
        'flourishing': "Blomstrande", 
        'dryAndHot': "Torrt och hett",
        // Infrastructure translations
        'earthLike': "Jordlikt", 
        'thirdWorld': "Tredje världen", 
        'marsLike': "Marslikt", 
        'futuristic': "Futuristiskt",
        // Unique selling point (USP) and Cultural USP translations
        'startOfCivilisation': "Början av civilisationen", 
        'skansen': "Skansen",
        // Government translations
        'selfcontrolled': "Självstyrt",
        // Currency translations
        'spaceDollar': "Rymddollar",
        // Language translations
        'english': "Engelska", 
        'marsianAndEnglish': "Marsianska och engelska",
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
        //$("." + key).text(get_string(key));
    }
    let pics = dict['pics'];
    for (let idx in pics) {
        let pic = pics[idx];
        $("#" + pic).attr('src', get_string(pic));
        //$("." + pic).attr('src', get_string(pic));
    }
    // Update page title
    $(document).attr("title", get_string("title"));
}
// ===========================================================================
// END OF FILE
// ===========================================================================