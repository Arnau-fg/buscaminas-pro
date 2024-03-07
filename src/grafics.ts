import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { principal } from './joc';
import Tauler from './Tauler';
import Casella from './casella';

class Grafics {
    public static colors: THREE.Texture[] = [];
    public static bomba: THREE.Texture;
    public static cover: THREE.Texture;
    public static bandera: THREE.Texture;
    public static raycaster: THREE.Raycaster;

    static crearBasic(canvas: HTMLCanvasElement, color: string, tamanyTauler: number, files: number, columnes: number): principal {
        const colorFons: string = color;
        const escena: THREE.Scene = new THREE.Scene();
        escena.background = new THREE.Color(colorFons);
        const camara: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const bigger = files > columnes ? files : columnes;

        camara.position.z = tamanyTauler * bigger * 0.8;
        escena.add(camara);
        const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(2);
        const controls: OrbitControls = new OrbitControls(camara, canvas);
        controls.enableDamping = true;
        controls.enableRotate = false;
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE
        }
        this.colors = Grafics.loadNumberTextures();

        this.bomba = Grafics.loadBombTexture();

        this.cover = Grafics.loadCoverTexture();

        this.bandera = Grafics.loadBanderaTexture();

        return { canvas, escena, camara, renderer, colorFons, controls };
    }

    static crearTauler(files: number, columnes: number, colorTauler: string, escena: THREE.Scene, tamanyTauler: number): THREE.Mesh {
        const geometriaTauler: THREE.BoxGeometry = new THREE.BoxGeometry(files * tamanyTauler, columnes * tamanyTauler, tamanyTauler * 0.1);
        const materialTauler: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: colorTauler });
        const tauler: THREE.Mesh = new THREE.Mesh(geometriaTauler, materialTauler);
        escena.add(tauler);

        return tauler;
    }

    static crearCaixa(files: number, columnes: number, escena: THREE.Scene, posicioX: number, posicioY: number, colorCaixa: string, tamanyTauler: number): THREE.Mesh {
        const geometriaCaixa: THREE.BoxGeometry = new THREE.BoxGeometry(tamanyTauler * 0.9, tamanyTauler * 0.9, tamanyTauler * 0.3);

        // const texture = new THREE.TextureLoader().load('../img/square.gif');

        const materialCaixa: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ map: this.cover });

        materialCaixa.needsUpdate = true

        const caixa: THREE.Mesh = new THREE.Mesh(geometriaCaixa, materialCaixa);

        caixa.position.x = posicioX * tamanyTauler - (files * tamanyTauler / 2) + tamanyTauler / 2;
        caixa.position.y = posicioY * tamanyTauler - (columnes * tamanyTauler / 2) + tamanyTauler / 2;
        caixa.position.z = tamanyTauler * 0.05;

        escena.add(caixa);

        return caixa;
    }

    static reSize(grafics: principal, width: number, height: number) {
        grafics.camara.aspect = width / height;
        grafics.camara.updateProjectionMatrix();
        grafics.renderer.setSize(width, height);

        grafics.renderer.render(grafics.escena, grafics.camara);
    }

    static render(grafics: principal) {
        grafics.controls.update();

        grafics.renderer.render(grafics.escena, grafics.camara);
    }

    static initRaycaster(grafics: principal, tauler: Tauler) {
        this.raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        let pressed: boolean = false;

        grafics.canvas.addEventListener("mousedown", (e: MouseEvent) => {
            pressed = true;
            setTimeout(() => {
                pressed = false;
            }, 200);
        })

        grafics.canvas.addEventListener("mouseup", (event) => {
            if (tauler.acabat || !pressed) return;
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(pointer, grafics.camara);

            const intersects = this.raycaster.intersectObjects(grafics.escena.children);

            if (intersects.length > 0) {
                const intersect = intersects[0];

                
                    if (event.button === 2) {
                        tauler.posarBandera(intersect.object.uuid);
                    } else {
                        tauler.activarCasella(grafics.canvas, intersect.object.uuid);
                    }

                

                // tauler.activarCasella(intersect.object.uuid);

            }
        });
    }

    static treureRaycaster(canvas: HTMLCanvasElement) {
        this.raycaster = null
        canvas.removeEventListener("mousedown", () => { });
        canvas.removeEventListener("mouseup", () => { });
    }

    static animacioRevelar(caixa: THREE.Mesh) {
        gsap.to(caixa.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.1, yoyo: true, repeat: 1 });
    }

    static mina(casella: Casella) {
        casella.caixa.material.map = this.bomba;
    }

    static revelar(casella: Casella) {
        // const texture = new THREE.TextureLoader().load('../fnaf-meme.gif');
        casella.caixa.material.map = this.colors[casella.nVoltant];
        if (!casella.revelada) {
            this.animacioRevelar(casella.caixa);

        }
        // casella.caixa.material.color.setHex();
    }

    static loadNumberTextures() {
        const textures: THREE.Texture[] = [];
        for (let i = 0; i < 9; i++) {
            textures.push(new THREE.TextureLoader().load(`../img/Minesweeper_${i}.gif`));
        }
        return textures;
    }

    static loadBombTexture() {
        return new THREE.TextureLoader().load('./img/bomb.png');
    }

    static loadCoverTexture() {
        // return new THREE.TextureLoader().load('../img/square.gif');
        return new THREE.TextureLoader().load('../baixa.jfif');

    }

    static loadBanderaTexture() {
        return new THREE.TextureLoader().load('../img/flag.png');
    }

    static treureBandera(caixa: THREE.Mesh) {
        caixa.material.map = this.cover;
    }

    static posarBandera(caixa: THREE.Mesh) {
        caixa.material.map = this.bandera;
    }


}

export default Grafics;