// ------------------------------------------------------------------------
// Code written by Felix Lager
// ------------------------------------------------------------------------

var language = 'en';
var dict = {
    'text' : ['one', 'two', 'systemJump', "tellus", 'population', 'colonyAge', 'avgTemp', 'homeButton', 'itinButton', 'helpButton', 'addButton', 'removeButton', 'clearItin', 'planetView'],
    'pics' : ['langPic'],

    'en' : {
        'one': "One",
        'two': "Two",
        'systemJump': "System jump location",
        'tellus': "Planet Earth",
        'population': "Population",
        'avgTemp': "Average temperature",
        'homeButton': "Home",
        'itinButton': 'Itinierary',
        'helpButton': 'Help',
        'addButton': 'Add',
        'removeButton': 'Remove',
        'planetView': '',
        'langPic': "images/eng.png"
    },

    'sv' : {
        'one': "Ett",
        'two': "Två",
        'systemJump': "Stjärnsystemshopp",
        'tellus': "Jorden",
        'population': "Populationsmängd",
        'avgTemp': "Medeltemperatur",
        'homeButton': "Hem",
        'itinButton': "Reseplan",
        'helpButton': "Hjälp",
        'addButton': 'Lägg till',
        'removeButton': 'Ta bort',
        'planetView': '',
        'langPic': "images/se.png"
    }
}

// returns the string for each key 
function get_string(key) {
    return dict[language][key];
}

//handles change of language
function change_lang() {
    if (language == 'en') {
        language = 'sv';
    } 
    else {
        language = 'en'
    };

    update_dict_view();
}

// ------------------------------------------------------------------------
// ska nog lägga denna kod i controllern istället
// ------------------------------------------------------------------------
// updates the view with correct strings - depending on selected language
// using # for divname- and . for classname searching
function update_dict_view() {
    text = dict['text'];
    for (idx in text) {
        key = text[idx];
        $("#" + key).text(get_string(key));
        $("." + key).text(get_string(key));
    };
    pics = dict['pics'];
    for (idx in pics) {
        pic = pics[idx];
        $("#" + pic).attr('src', get_string(pic));
        $("." + pic).attr('src', get_string(pic));
    };
}
// ===========================================================================
// END OF FILE
// ===========================================================================