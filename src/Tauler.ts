import Casella from "./casella.ts";
import * as THREE from "three";
import Grafics from "./grafics.ts";
import { infoRevelar } from "./casella.ts";

class Tauler {
  public tauler: Casella[][];
  public files: number;
  public columnes: number;
  public mines: number;
  public graficsTauler: THREE.Mesh;
  public revelades: number = 0;
  public totalRevelar: number;
  public acabat: boolean = false;

  constructor(
    files: number,
    columnes: number,
    mines: number,
    escena: THREE.Scene,
    colorTauler: string,
    colorCaixa: string,
    tamanyTauler: number
  ) {
    this.files = files;
    this.columnes = columnes;
    this.mines = mines;

    this.graficsTauler = Grafics.crearTauler(
      files, columnes, colorTauler, escena, tamanyTauler);

    this.tauler = new Array(files);
    for (let i = 0; i < files; i++) {
      this.tauler[i] = new Array(columnes);
      for (let j = 0; j < columnes; j++) {
        this.tauler[i][j] = new Casella(false, false, false, files, columnes, escena, i, j, colorCaixa, tamanyTauler);
      }
    }
    this.posarMines();

    this.totalRevelar = files * columnes - mines;
  }

  private posarMines() {
    let minesPosades = 0;
    while (minesPosades < this.mines) {
      let fila = Math.floor(Math.random() * this.files);
      let columna = Math.floor(Math.random() * this.columnes);
      if (!this.tauler[fila][columna].esMina) {
        this.tauler[fila][columna].esMina = true;
        this.sumarVoltant(fila, columna);
        minesPosades++;
      }
    }
    console.table(this.tauler);
  }

  sumarVoltant(fila: number, columna: number) {
    for (let i = fila - 1; i <= fila + 1; i++) {
      for (let j = columna - 1; j <= columna + 1; j++) {
        if (i >= 0 && i < this.files && j >= 0 && j < this.columnes) {
          this.tauler[i][j].augmentarnVoltant();
        }
      }
    }
  }

  activarCasella(canvas: HTMLCanvasElement, uuid: string) {
    //crear aqui la funció de revelar casella

    this.tauler.forEach((fila, x) => {
      fila.forEach((casella, y) => {
        if (casella.caixa.uuid === uuid) {
          if (!casella.marcada) {
            const infoRevelar: infoRevelar = {
              posicioX: x,
              posicioY: y,
              tauler: this,
              iteracio2: false,
              revelades: 0,
            };
            let revelades = casella.revelar(canvas, infoRevelar);
            if (revelades === -1) {
              console.log("Has perdut");
              this.acabat = true;
            }

            this.revelades += revelades;

            if (this.revelades === this.totalRevelar) {
              console.log("Has guanyat");
              this.acabat = true;
            }
          }
        }
      });
    });
  }

  posarBandera(uuid: string) {
    this.tauler.forEach((fila) => {
      fila.forEach((casella) => {
        if (casella.caixa.uuid === uuid) {
          if (!casella.revelada) {
            casella.posarBandera();
          }
        }
      });
    });
  }

  public getTauler(): Casella[][] {
    return this.tauler;
  }
}

export default Tauler;
