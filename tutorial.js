export function helpTutorial () {
    var help = document.createElement('div');
    help.style.position = "absolute";
    help.style.left = "186px";
    help.style.top = "0px";
    help.style.height = "50px";
    help.style.width = "200px";
    help.style.zIndex = "2";
    help.style.backgroundColor = "";
    help.style.opacity = "50%";
    help.style.boxShadow = "0px 0px 1px 2000px black";

    var home = document.createElement('div');
    home.style.position = "absolute";
    home.style.left = "0px";
    home.style.top = "0px";
    home.style.height = "50px";
    home.style.width = "200px";
    home.style.zIndex = "4";
    home.style.backgroundColor = "";
    home.style.opacity = "50%";
    home.style.boxShadow = "0px 0px 1px 2000px black";

    document.getElementsByTagName('body')[0].appendChild(help);
    document.getElementsByTagName('body')[0].appendChild(home);
}