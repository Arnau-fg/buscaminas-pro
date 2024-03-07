import Joc from "./joc";

export interface Game {
    canvas: HTMLCanvasElement;
    files: number;
    columnes: number;
    mines: number;
    colorFons: string;
    colorTauler: string;
    colorCaixa: string;
    tamanyTauler: number;
}

let canvas = <HTMLCanvasElement>document.getElementById('canvas');

const files = 30;
const columnes = 30;
const mines = 150;

const colorFons = "#232323";
const colorTauler = "#dadada";
const colorCaixa = "#ffffff";

const tamanyTauler = 1;

let configuracio: Game = {
    canvas,
    files,
    columnes,
    mines,
    colorFons,
    colorTauler,
    colorCaixa,
    tamanyTauler
}


new Joc(configuracio);




console.log('Hello World');



