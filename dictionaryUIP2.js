// ------------------------------------------------------------------------
// Code written by Felix Lager
// ------------------------------------------------------------------------

let language = 'en';
let dict = {
    'text' : ['one', 'two'],
    'pics' : ['langPic'],

    'en' : {
        'title' : "Itinerary Planner",
        'one': "One",
        'two': "Two",
        'langPic': "images/eng.png"
    },

    'sv' : {
        'title' : "Resvägsplanerare",
        'one': "Ett",
        'two': "Två",
        'langPic': "images/se.png"
    }
}

// returns the string for each key 
function get_string(key) {
    return dict[language][key];
}

//handles change of language
export function change_lang() {
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
export function update_dict_view() {
    let text = dict['text'];
    for (let key in text) {
        $("#" + key).text(get_string(key));
        $("." + key).text(get_string(key));
    }
    let pics = dict['pics'];
    for (let pic in pics) {
        $("#" + pic).attr('src', get_string(pic));
        $("." + pic).attr('src', get_string(pic));
    }
    // Update page title
    $(document).attr("title", get_string("title"));
}
// ===========================================================================
// END OF FILE
// ===========================================================================
