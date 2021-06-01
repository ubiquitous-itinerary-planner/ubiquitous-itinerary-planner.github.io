export function helpTutorial () {
    //create help div for Help button + box shadow over entire screen
    var help = document.createElement('div');
    help.id = "helpDiv";
    help.style.position = "absolute";
    help.style.left = "186px";
    help.style.top = "0px";
    help.style.height = "50px";
    help.style.width = "200px";
    help.style.zIndex = "2";
    help.style.backgroundColor = "black";
    help.style.opacity = "25%";
    help.style.boxShadow = "0px 0px 1px 2000px black";

    help.addEventListener("mouseover", mouseOver, false);
    help.addEventListener("mouseout", mouseOut, false);
    document.body.appendChild(help);
    function mouseOver()
    {
        help.style.backgroundColor = "white";
        help.style.opacity = "25%";
        help.style.boxShadow = "";
    }
    function mouseOut()
    {
        help.style.backgroundColor = "";
        help.style.opacity = "25%";
    }

    //Create home div (for star system button)
    var home = document.createElement('div');
    home.id = "homeDiv";
    home.style.position = "absolute";
    home.style.left = "0px";
    home.style.top = "0px";
    home.style.height = "50px";
    home.style.width = "200px";
    home.style.zIndex = "5";
    //Hover function that lightens up home button. TO DO: Tooltip on hover
    home.addEventListener("mouseover", mouseOver, false);
    home.addEventListener("mouseout", mouseOut, false);
    document.body.appendChild(home);
    function mouseOver()
    {
        home.style.backgroundColor = "white";
        home.style.opacity = "25%";
        home.style.boxShadow = "";
    }
    function mouseOut()
    {
        home.style.backgroundColor = "";
        home.style.opacity = "25%";
        //home.style.boxShadow = "0px 0px 1px 2000px black";
    }


    document.getElementsByTagName('body')[0].appendChild(help);
    document.getElementsByTagName('body')[0].appendChild(home);
}