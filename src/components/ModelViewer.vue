<template>
  <div class="model-viewer flex-center relative w-full" ref="container">
    <!-- Loader -->
    <div v-if="isLoading" class="loader-overlay flex-center">
        <div class="spinner"></div>
    </div>

    <!-- Professional HUD (Floating Dock) -->
    <div class="hud-dock" v-if="!isLoading">
        
        <!-- Stats Group -->
        <div class="dock-group stats-group">
            <div class="stat-item">
                <span class="stat-label">TRIS</span>
                <span class="stat-value">{{ modelData?.triangles || '0' }}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <span class="stat-label">VERTS</span>
                <span class="stat-value">{{ modelData?.vertices || '0' }}</span>
            </div>
        </div>

        <!-- Toggles Group -->
        <div class="dock-group controls-group">
            <!-- Wireframe Toggle -->
            <button 
                class="control-btn" 
                :class="{ active: isWireframe }" 
                @click="ToggleWireframe" 
                title="Wireframe Mode"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/>
                </svg>
            </button>

            <!-- Lights Toggle -->
            <button 
                class="control-btn" 
                :class="{ active: isLightsOn }" 
                @click="ToggleLights" 
                title="Scene Lights"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
            </button>

            <!-- Tone Mapping Toggle -->
            <button 
                v-if="debugging" 
                class="control-btn" 
                :class="{ active: isToneOn }" 
                @click="ToggleTone" 
                title="Tone Config"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20z" opacity="0.5"/>
                    <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/>
                </svg>
            </button>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

// eslint-disable-next-line no-undef
const props = defineProps<{
    modelName: string
}>();

let container = ref<HTMLDivElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;

let model: THREE.Group | null = null;
let modelData = ref<{vertices: string, triangles: string}>();
let lights: Array<THREE.Light> = [];

let isLoading = ref(true);
let isWireframe = ref<boolean>(false);
let isLightsOn = ref<boolean>(false);
let isToneOn = ref<boolean>(true);

// Debug variables
const debugging = true;
const USED_TONE_MAPPING = THREE.ACESFilmicToneMapping;


onMounted(() => {
    Init();

    LoadSkybox("./skybox.hdr");
    LoadLights();
    if(props.modelName) {
        LoadModel("models" + "/" + props.modelName + "/" + "model.glb");
    }

    Animate();
    HandleResize();
});

function Init()
{
    if(!container.value) return;

    const width = container.value?.clientWidth ?? window.innerWidth;
    const height = container.value?.clientHeight ?? window.innerHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100); // Improved FOV for studio look
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Antialias on
    controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio); // Sharp rendering
    renderer.toneMapping = USED_TONE_MAPPING;
    renderer.toneMappingExposure = 1.0;
    
    container.value?.appendChild(renderer.domElement);
}

function LoadLights()
{
    lights.forEach((light) => scene.remove(light));
    lights = [];
    
    // Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const mainLight = new THREE.DirectionalLight(0xffffff, 2);
    mainLight.position.set(5, 5, 5);
    
    const fillLight = new THREE.DirectionalLight(0xbadfff, 1); // Slight blue fill
    fillLight.position.set(-5, 0, 5);
    
    const rimLight = new THREE.DirectionalLight(0xffaa00, 1); // Warm rim
    rimLight.position.set(0, 5, -5);

    lights.push(ambientLight, mainLight, fillLight, rimLight);
    scene.add(...lights);
    
    // Toggle system
    lights.forEach((light) => (light.visible = isLightsOn.value));
}

function LoadSkybox(hdrPath: string)
{
    new RGBELoader().load(hdrPath, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        // Keep background transparent or simple, environment is for lighting only
    });
}

function LoadModel(modelPath: string)
{
    const loader = new GLTFLoader();
    loader.load(
        modelPath,
        (gltf) => {
            model = gltf.scene;
            
            // Auto-center and Scale
            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            box.getSize(size);
            const center = new THREE.Vector3();
            box.getCenter(center);
            
            // Reposition model so its center is at (0,0,0) world space
            model.position.sub(center);

            // Fit to View Calculation
            // We want the object to fit within the FOV
            const maxDim = Math.max(size.x, size.y, size.z);
            let fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            
            // Add some padding factor (1.5x) so it doesn't touch edges
            cameraZ *= 1.5;

            camera.position.set(0, maxDim * 0.2, cameraZ); // Slight elevation
            camera.lookAt(0, 0, 0);

            // Important: Update controls target to center
            controls.target.set(0, 0, 0);
            controls.update();

            // Calculate exact stats
            let verticesCount = 0;
            let trianglesCount = 0;

            model.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = (child as THREE.Mesh);
                    verticesCount += mesh.geometry.attributes.position.count;
                    if(mesh.geometry.index) {
                        trianglesCount += mesh.geometry.index.count / 3;
                    } else {
                        trianglesCount += mesh.geometry.attributes.position.count / 3;
                    }
                    
                    // Shadow setup
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                }
            });

            modelData.value = {
                vertices: verticesCount.toLocaleString("en-US"),
                triangles: Math.floor(trianglesCount).toLocaleString("en-US"),
            };

            scene.add(model);
            
            // Nice camera angle
            camera.position.set(3, 2, 5);
            camera.lookAt(0, 0, 0);
            
            isLoading.value = false;
        },
        undefined,
        (error) => console.error("Error loading model", error)
    );
}

function Animate()
{
    requestAnimationFrame(Animate);
    controls.update();
    renderer.render(scene, camera);
}

function HandleResize() 
{
    window.addEventListener("resize", () => {
        if(!container.value) return;
        const width = container.value.clientWidth;
        const height = container.value.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}

function ToggleWireframe(){
    if (!model) return;
    isWireframe.value = !isWireframe.value;
    model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = (child as THREE.Mesh);
            // We use materials array or single depending on structure.
            // Simple toggle for now:
            const mat = mesh.material as THREE.Material;
            if (mat) {
                (mat as any).wireframe = isWireframe.value;
            }
        }
    });
}

function ToggleLights() {
    isLightsOn.value = !isLightsOn.value;
    lights.forEach((light) => (light.visible = isLightsOn.value));
}

function ToggleTone() {
    renderer.toneMapping = isToneOn.value ? THREE.NoToneMapping : USED_TONE_MAPPING;
    isToneOn.value = !isToneOn.value;
}
</script>

<style scoped>
.model-viewer {
    width: 100%;
    height: 100%;
    position: relative;
    background: transparent;
}

/* Loader */
.loader-overlay {
    position: absolute;
    inset: 0;
    background: #000;
    z-index: 20;
}
.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255,255,255,0.1);
    border-radius: 50%;
    border-top-color: var(--accent-blue, #3B82F6);
    animation: spin 1s ease-in-out infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Floating HUD Dock */
.hud-dock {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 10;
    padding: 8px;
    background: rgba(10, 10, 10, 0.8);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 99px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}

.dock-group {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 12px;
}

/* Stats */
.stats-group {
    border-right: 1px solid rgba(255,255,255,0.1);
    padding-right: 16px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.stat-label {
    font-size: 0.6rem;
    color: #666;
    letter-spacing: 0.05em;
    font-weight: 700;
}

.stat-value {
    font-size: 0.85rem;
    color: #AAA;
    font-family: var(--font-mono);
}

/* Controls */
.controls-group {
    padding-left: 4px;
}

.control-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: #888;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
}

.control-btn:hover {
    color: #FFF;
    background: rgba(255, 255, 255, 0.1);
}

.control-btn.active {
    background: var(--accent-blue, #3B82F6);
    color: #FFF;
    box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
}
</style>