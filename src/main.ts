enum ptype {
    Circle = "circle",
    Square = "square",
    Rectangle = "rect",
    Path = "path"
}

enum btype {
    Spawn = "spawn",
    Station = "station"
}

enum rtype {
    Expressway = "expwy",
    Railway = "railway",
    Route = "route"
}

interface pin {
    x: number,
    z: number
}

interface spin extends pin {
    type: ptype,
    long: number,
    long2: number | undefined
}

interface regobj {
    name: string,
    p: spin[],
    description: string,
    editable: boolean
}

interface bldobj {
    name: string,
    p: pin,
    description: string,
    editable: boolean,
    type: btype,
    train: string[] | undefined
}

interface pathobj {
    name: string,
    p: spin[],
    description: string,
    editable: boolean,
    size: number
}

interface terobj {
    p: spin[]
}

interface pathct {
    route: pathobj[],
    expwy: pathobj[],
    railway: pathobj[]
}

interface dbi {
    path: pathct,
    region: regobj[],
    building: bldobj[],
    terrain: terobj[]
}

interface mapstyle {
    pin: string[],
    pcol: string[],
    regionb: string,
    route1b: string,
    expwy1b: string,
    railway1b: string
}

class stat {
    static zoom: number = 1;
    static x: number = -8;
    static y: number = -2007;
    static dragging: boolean = false;
    static msryle: mapstyle = {
        pin: [
            'station',
            'spawn',
            'gov'
        ],
        pcol: [
            '#218ceb',
            '#169152',
            'black'
        ],
        regionb: 'black',
        route1b: '#D8E0E7',
        expwy1b: '#6C9F43',
        railway1b:  '#A0A0A0'
    }
    static q: string | null = null;
}

// Utility Function Define

class util {
    static changeTitle = (s: string) => document.title = s + " | TORO Server Map";
    static nTitle = () => document.title = "TORO Server Map";

    /**
     * getELementById Short
     * @param s Element's ID
     * @returns HTMLElement
     */
    static ge = (s: string) => document.getElementById(s);

    static async getdb(s: string) {
        let res = fetch(`./db/${s}.json`);
        return res.then(res=>res.json());
    }
}

class draw {
    static LOW_newimg = (s: string, ctx: CanvasRenderingContext2D, x:number, y:number, w:number, h:number) => { let tmp = new Image(); tmp.src = s; tmp.onload = () => { ctx.drawImage(tmp, x, y, w, h); } };
    static LOW_xposcalc = (x: number, canvas: HTMLCanvasElement) => (canvas.width) / 2 + (x * stat.zoom) - (stat.x * stat.zoom);
    static LOW_yposcalc = (y: number, canvas: HTMLCanvasElement) => (canvas.height) / 2 + (y * stat.zoom) - (stat.y * stat.zoom);

    static cvClear = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => ctx.clearRect(0, 0, canvas.width, canvas.height);
    static cvPin = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, x:number, y:number, icon: string, color: string, text: string) => {
        let cx: number, cy: number;
        cx = this.LOW_xposcalc(x, canvas);
        cy = this.LOW_yposcalc(y, canvas);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        if (icon != '') {
            this.LOW_newimg     (`./../asset/icon/${icon}.svg`, ctx, cx - 10, cy - 40, 20, 20)
        }
        ctx.beginPath       ();
        ctx.moveTo          (cx + 15, cy - 30);
        ctx.quadraticCurveTo(cx + 15, cy - 45, cx     , cy - 45);
        ctx.quadraticCurveTo(cx - 15, cy - 45, cx - 15, cy - 30);
        ctx.quadraticCurveTo(cx - 15, cy - 15, cx     , cy     );
        ctx.quadraticCurveTo(cx + 15, cy - 15, cx + 15, cy - 30);
        ctx.closePath       ();
        ctx.fill            ();
        this.cvText         (ctx, "24px mplus", cx + 23, cy - 20, text)
    };
    static cvText = (ctx: CanvasRenderingContext2D, font: string, x:number, y:number, s: string) => {
        ctx.font = font;
        ctx.fillText(s, x, y);
    }
    static cvCircleS = (ctx: CanvasRenderingContext2D, cx:number, cy:number, long: number, color: string, weight: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = weight;
        ctx.moveTo      (this.LOW_xposcalc(cx, canvas) + (long / 2), this.LOW_yposcalc(cy, canvas));
        ctx.beginPath   ();
        ctx.arc         (this.LOW_xposcalc(cx, canvas), this.LOW_yposcalc(cy, canvas), Math.abs((long / 2) * stat.zoom), 0, 2 * Math.PI);
        ctx.stroke      ();
        ctx.closePath   ();
    };
    static cvRectS = (ctx: CanvasRenderingContext2D, cx:number, cy:number, long: number, long2: number, color: string, weight: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = weight;
        ctx.moveTo      (this.LOW_xposcalc(cx, canvas) - (long / 2), this.LOW_yposcalc(cy, canvas) - (long2 / 2));
        ctx.strokeRect  (this.LOW_xposcalc(cx, canvas) - (long / 2), this.LOW_yposcalc(cy, canvas) - (long / 2), long * stat.zoom, long2 * stat.zoom);
    }
    // Wrapper
    static cvSquareS = (ctx: CanvasRenderingContext2D, cx:number, cy:number, long: number, color: string, weight: number) => this.cvRectS(ctx, cx, cy, long, long, color, weight);
    static cvPath = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, fx:number, fy:number, tx:number, ty:number, color :string, weight: number) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = weight;
        ctx.beginPath   ();
        ctx.moveTo      (this.LOW_xposcalc(fx, canvas), this.LOW_yposcalc(fy, canvas));
        ctx.lineTo      (this.LOW_xposcalc(tx, canvas), this.LOW_yposcalc(ty, canvas));
        ctx.closePath   ();
        ctx.stroke      ();
    }
}

function terrain(db: terobj[]) {
    // Nothing now ;D
}

function region(db: regobj[]) {
    for (let i of db) {
        for (let j of i.p) {
            switch (j.type) {
                case 'circle':
                    draw.cvCircleS(ctx, j.x, j.z, j.long, stat.msryle.regionb, 1);
                    break;
                case 'square':
                    draw.cvSquareS(ctx, j.x, j.z, j.long, stat.msryle.regionb, 1)
                    break;
                case 'rect':
                    draw.cvRectS(ctx, j.x, j.z, j.long, j.long2!, stat.msryle.regionb, 1);
                    break;

                default:
                    break;
            }
        }
    }
}

function route (db: pathobj[]) {
    let color: string = '';
    let weight: number = 0;

    for (let i of db) {
        if (i.size == 1) {
            color = stat.msryle.route1b;
            weight = 5;
        }
        for (let j of i.p) {
            switch (j.type) {
                case 'circle':
                    draw.cvCircleS(ctx, j.x, j.z, j.long, color, weight);
                    break;
                case 'square':
                    draw.cvSquareS(ctx, j.x, j.z, j.long, color, weight)
                    break;
                case 'rect':
                    draw.cvRectS(ctx, j.x, j.z, j.long, j.long2!, color, weight);
                    break;
                case 'path':
                    draw.cvPath(ctx, canvas, j.x, j.z, j.long, j.long2!, color, weight);
                    break;
    
                default:
                    break;
             }
        }
    }
}

function expwy (db: pathobj[]) {
    let color: string = '';
    let weight: number = 0;

    for (let i of db) {
        if (i.size == 1) {
            color = stat.msryle.expwy1b;
            weight = 10;
        }
        for (let j of i.p) {
            switch (j.type) {
                case 'circle':
                    draw.cvCircleS(ctx, j.x, j.z, j.long, color, weight);
                    break;
                case 'square':
                    draw.cvSquareS(ctx, j.x, j.z, j.long, color, weight)
                    break;
                case 'rect':
                    draw.cvRectS(ctx, j.x, j.z, j.long, j.long2!, color, weight);
                    break;
    
                default:
                    break;
             }
        }
    }
}

function railway (db: pathobj[]) {
    let color: string = '';
    let weight: number = 0;

    for (let i of db) {
        if (i.size == 1) {
            color = stat.msryle.railway1b;
            weight = 3;
        }
        for (let j of i.p) {
            switch (j.type) {
                case 'circle':
                    draw.cvCircleS(ctx, j.x, j.z, j.long, color, weight);
                    break;
                case 'square':
                    draw.cvSquareS(ctx, j.x, j.z, j.long, color, weight)
                    break;
                case 'rect':
                    draw.cvRectS(ctx, j.x, j.z, j.long, j.long2!, color, weight);
                    break;
    
                default:
                    break;
             }
        }
    }
}

function building(db: bldobj[]) {
    for (let i of db) {
        draw.cvPin(ctx, canvas, i.p.x, i.p.z, i.type, stat.msryle.pcol[stat.msryle.pin.indexOf(i.type)], i.name);
    }
}

let fx: number, fy: number, tx: number, ty: number;

function onMDown(e: MouseEvent) {
    stat.dragging = true;
    fx = e.clientX - canvas.getBoundingClientRect().left;
    fy = e.clientY - canvas.getBoundingClientRect().top;
}

function onMMove(e: MouseEvent) {
    tx = e.clientX - canvas.getBoundingClientRect().left;
    ty = e.clientY - canvas.getBoundingClientRect().top;
  
    if (stat.dragging) {
      stat.x += (fx - tx) * 1;
      stat.y += (fy - ty) * 1;
      update();
    }

    fx = e.clientX - canvas.getBoundingClientRect().left;
    fy = e.clientY - canvas.getBoundingClientRect().top;
}
  
function onMUp(e: MouseEvent) {
    tx = e.clientX - canvas.getBoundingClientRect().left;
    ty = e.clientY - canvas.getBoundingClientRect().top;
  
    if (stat.dragging) {
      stat.x += (fx - tx) * 1;
      stat.y += (fy - ty) * 1;
      update();
    }

    stat.dragging = false;
}

function onWheel(e: WheelEvent) {
    if (-1 != Math.sign(stat.zoom + (e.deltaY * -0.001))) {
        stat.zoom += e.deltaY * -0.001;
    }
    update();
}

function qupd(db: dbi) {
    //
}
  

// Initialise Method

let canvas = <HTMLCanvasElement> util.ge("cv");
let ctx = canvas.getContext('2d')!;

let params = new URL(window.location.href).searchParams;

function init() {
    canvas.width = (window.devicePixelRatio || 2) * window.innerWidth;
    canvas.height = (window.devicePixelRatio || 2) * window.innerHeight;
    ctx.scale((window.devicePixelRatio || 2), (window.devicePixelRatio || 2));

    util.changeTitle("Loading...");
    draw.cvClear(ctx, canvas);

    let mplus = new FontFace("mplus", "url(./../asset/MPLUSRounded1c-Medium.ttf)");
    (async()=>{
        await mplus.load();
    })();

    if (params.get('x') != null) {
        stat.x = parseFloat(params.get('x')!);
    }

    if (params.get('y') != null) {
        stat.x = parseFloat(params.get('y')!);
    }

    if (params.get('z') != null) {
        stat.zoom = parseFloat(params.get('z')!);
    }

    stat.q = params.get('q');

    util.nTitle();

    canvas.addEventListener('mousedown', onMDown, false);
    canvas.addEventListener('mousemove', onMMove, false);
    canvas.addEventListener('mouseup', onMUp, false);
    canvas.addEventListener('wheel', onWheel, false);

    update();
}

async function update() {
    let dbs: dbi = await util.getdb('main');
    qupd(dbs);
    draw.cvClear(ctx, canvas);
    terrain(dbs.terrain);
    region(dbs.region);
    route(dbs.path.route);
    expwy(dbs.path.expwy);
    railway(dbs.path.railway);
    building(dbs.building);
}
