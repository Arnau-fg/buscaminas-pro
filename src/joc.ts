import Tauler from "./Tauler";
import Grafics from "./grafics";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Game } from "./main";

export interface principal {
  canvas: HTMLCanvasElement;
  escena: THREE.Scene;
  camara: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  colorFons: string;
  controls: OrbitControls;
}

class Joc {
  private tauler: Tauler;
  private grafics: principal;

  constructor(
    configuracio: Game
  ) {
    this.grafics = Grafics.crearBasic(configuracio.canvas, configuracio.colorFons, configuracio.tamanyTauler, configuracio.files, configuracio.columnes);

    this.tauler = new Tauler(configuracio.files, configuracio.columnes, configuracio.mines, this.grafics.escena, configuracio.colorTauler, configuracio.colorCaixa, configuracio.tamanyTauler);

    this.init();
  }

  public getTauler(): Tauler {
    return this.tauler;
  }

  public getGrafics(): principal {
    return this.grafics;
  }

  private init() {
    window.addEventListener("resize", () => {
      Grafics.reSize(this.grafics, window.innerWidth, window.innerHeight);
    });

    Grafics.initRaycaster(this.grafics, this.tauler);

    this.loop();
  }

  private loop() {
    Grafics.render(this.grafics);

    window.requestAnimationFrame(() => this.loop());
  }

}

export default Joc;
