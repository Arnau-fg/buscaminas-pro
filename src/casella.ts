import * as THREE from 'three';
import Grafics from './grafics';
import Tauler from './Tauler';

export interface infoRevelar {
    posicioX: number,
    posicioY: number,
    tauler: Tauler,
    iteracio2: boolean,
    revelades: number
}

class Casella {
    public esMina: boolean;        // Indica si la casella és una mina
    public revelada: boolean;      // Indica si la casella està revelada
    public marcada: boolean;       // Indica si la casella està marcada
    public nVoltant: number = 0;   // Indica el nombre de mines al voltant
    public caixa: THREE.Mesh;      // Objecte 3D de la casella

    constructor(esMina: boolean, revelada: boolean, marcada: boolean, files: number, columnes: number, escena: THREE.Scene, posicioX: number, posicioY: number, colorCaixa: string, tamanyTauler: number) {
        this.esMina = esMina;
        this.revelada = revelada;
        this.marcada = marcada;

        this.caixa = Grafics.crearCaixa(files, columnes, escena, posicioX, posicioY, colorCaixa, tamanyTauler);
    }

    // // Getter i Setter per a esMina
    // getEsMina(): boolean {
    //     return this.esMina;
    // }

    // setEsMina(value: boolean) {
    //     this.esMina = value;
    // }

    // // Getter i Setter per a revelada
    // getRevelada(): boolean {
    //     return this.revelada;
    // }

    // setRevelada(value: boolean) {
    //     this.revelada = value;
    // }

    // // Getter i Setter per a marcada
    // getMarcada(): boolean {
    //     return this.marcada;
    // }

    // setMarcada(value: boolean) {
    //     this.marcada = value;
    // }

    // // Getter i Setter per a nVoltant
    // getnVoltant(): number {
    //     return this.nVoltant;
    // }

    augmentarnVoltant() {
        this.nVoltant++;
    }

    revelar(canvas: HTMLCanvasElement, infoRevelar: infoRevelar): number {
        let totalRevelades = infoRevelar.revelades;
        if (!this.marcada) {


            if (this.esMina) {
                this.revelada = true;
                Grafics.mina(this);
                return -1;
            } else {
                totalRevelades = this.revelarNoBomba(canvas, infoRevelar);
            }
        }
        return totalRevelades;

    }

    revelarNoBomba(canvas: HTMLCanvasElement, infoRevelar: infoRevelar) {
        Grafics.revelar(this);
        const neighbors = [
            [infoRevelar.posicioX - 1, infoRevelar.posicioY - 1], [infoRevelar.posicioX, infoRevelar.posicioY - 1], [infoRevelar.posicioX + 1, infoRevelar.posicioY - 1],
            [infoRevelar.posicioX - 1, infoRevelar.posicioY], [infoRevelar.posicioX + 1, infoRevelar.posicioY],
            [infoRevelar.posicioX - 1, infoRevelar.posicioY + 1], [infoRevelar.posicioX, infoRevelar.posicioY + 1], [infoRevelar.posicioX + 1, infoRevelar.posicioY + 1]
        ];
        if (!this.revelada) {
            infoRevelar.revelades++;
            infoRevelar.iteracio2 = true;
        }
        this.revelada = true;


        if (this.nVoltant == 0) {
            for (const [x, y] of neighbors) {
                if (x >= 0 && x < infoRevelar.tauler.files && y >= 0 && y < infoRevelar.tauler.columnes && !infoRevelar.tauler.tauler[x][y].revelada) {
                    infoRevelar.posicioX = x;
                    infoRevelar.posicioY = y;
                    infoRevelar.iteracio2 = true;
                    infoRevelar.revelades = infoRevelar.tauler.tauler[x][y].revelar(canvas, infoRevelar);
                }
            }
        } else if (!infoRevelar.iteracio2) {
            let marcadaNeighbors = 0;

            for (const [x, y] of neighbors) {
                if (x >= 0 && x < infoRevelar.tauler.files && y >= 0 && y < infoRevelar.tauler.columnes) {
                    if (infoRevelar.tauler.tauler[x][y].marcada) {
                        marcadaNeighbors++;
                    }
                }
            }

            if (marcadaNeighbors >= this.nVoltant) {
                for (const [x, y] of neighbors) {
                    if (x >= 0 && x < infoRevelar.tauler.files && y >= 0 && y < infoRevelar.tauler.columnes && !infoRevelar.tauler.tauler[x][y].revelada && !infoRevelar.tauler.tauler[x][y].marcada) {
                        infoRevelar.posicioX = x;
                        infoRevelar.posicioY = y;
                        infoRevelar.iteracio2 = true;
                        infoRevelar.revelades = infoRevelar.tauler.tauler[x][y].revelar(canvas, infoRevelar);
                    }
                }
            }
        }
        return infoRevelar.revelades;
    }

    posarBandera() {
        if (this.marcada) {
            this.marcada = false;
            Grafics.treureBandera(this.caixa);
        } else {
            this.marcada = true;
            Grafics.posarBandera(this.caixa);
        }
    }
}

export default Casella;