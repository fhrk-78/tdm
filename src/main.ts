
// Utility Function Define

class util {
    static changeTitle = (s: string) => document.title = s + " | TORO Server Map";

    /**
     * getELementById Short
     * @param s Element's ID
     * @returns null | HTMLElement
     */
    static ge = (s: string) => document.getElementById(s);
}

// Initialise Method

function init() {
    util.changeTitle("Loading...");

    /*let c_bef = <HTMLCanvasElement> util.ge("cv");
    var ctx = c_bef.getContext('2d')!;

    ctx.clearRect(0, 0, c_bef.width, c_bef.height);*/

    let ifr = <HTMLIFrameElement> util.ge("ifr");
    ifr.contentDocument!.getElementsByTagName("head").item(0)!.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="https://fhrk-78.github.io/tdm/ifm.css" type="text/css">');

    util.changeTitle("Embed");
}