import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export class ModelView {
    container: HTMLDivElement;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    model: null | THREE.Group;
    // modelData: {vertices: string, triangles: string} = {vertices: "", triangles: ""};
    lights: Array<THREE.Light>;
    onModelLoaded: ((data: {vertices: string, triangles: string}) => void) | null = null; 

    constructor(container: HTMLDivElement)
    {
        this.container = container;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.controls.enableDamping = true;

        this.renderer.setSize(width, height);
        this.container.appendChild(this.renderer.domElement);

        this.model = null;


        this.lights = [];
    }

    

    Animate()
    {
        requestAnimationFrame(() => this.Animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    LoadLights()
    {
        this.lights.forEach((light) => this.scene.remove(light));
        this.lights = [];
        const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
        const spotLight = new THREE.SpotLight(0xffa95c, 0.4);
        spotLight.castShadow = true;
        this.lights.push(hemiLight, spotLight);
        this.scene.add(hemiLight, spotLight);
    }

    LoadSkybox(hdrPath: string)
    {
        const hdrLoader = new RGBELoader();
        hdrLoader.load(
            hdrPath,
            (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.background = texture;
                this.scene.environment = texture;
                //loading a 50
            },
            (xhr) => {
                // if (xhr.lengthComputable) {
                //     this.loadingProgress = (xhr.loaded / xhr.total) * 50;
                // }
                console.log("CARICAMENTO");
            },
            (error) => console.error("Errore nel caricamento dell'HDR", error)
        );
    }

    LoadModel(modelPath: string)
    {
        const loader = new GLTFLoader();
        loader.load(
            modelPath,
            (gltf) => {
                this.model = gltf.scene;
                const box = new THREE.Box3().setFromObject(this.model);
                const size = new THREE.Vector3();
                box.getSize(size);
                const center = new THREE.Vector3();
                box.getCenter(center);
                this.model.position.sub(center);

                let verticesCount = 0;
                let trianglesCount = 0;

                // Cicla su ogni tipo Object3D (Mesh, Group, Light, Camera)
                this.model.traverse((child) => {
                    // Agiamo solo su un tipo Mesh
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = (child as THREE.Mesh);
                        verticesCount += mesh.geometry.attributes.position.count;
                        trianglesCount += mesh.geometry.index 
                            ? mesh.geometry.index.count / 3 
                            : mesh.geometry.attributes.position.count / 3;
                    }
                });

                const modelData = {
                    vertices: verticesCount.toLocaleString("it-IT"),
                    triangles: trianglesCount.toLocaleString("it-IT"),
                };

                this.scene.add(this.model);
                this.camera.position.set(0, 0, size.length() * 0.6);
                this.camera.lookAt(center);
                
                console.log(this.onModelLoaded)
                // Se la callback onModelLoaded è stata impostata, chiamiamola con i dati
                if (this.onModelLoaded) {
                    
                    this.onModelLoaded(modelData);
                }
            },
            (xhr) => {
                console.log("CARICAMENTO MODELLO");
            },
            (error) => console.error("Errore nel caricamento del modello", error)
        );
    }

    HandleResize() 
    {
        window.addEventListener("resize", () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }

    ToggleWireframe = (isWireframe: {value: boolean}) => {
        if (!this.model) return;
        isWireframe.value = !isWireframe.value;
        this.model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = (child as THREE.Mesh);
                const material = (mesh.material as THREE.MeshBasicMaterial);

                material.wireframe = isWireframe.value;
            }
        });
    };

    ToggleLights = (lightsEnabled: {value: boolean}) => {
        lightsEnabled.value = !lightsEnabled.value;
        this.lights.forEach((light) => (light.visible = lightsEnabled.value));
    };


}