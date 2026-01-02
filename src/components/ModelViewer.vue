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
                title="Studio Lighting"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
            </button>

            <!-- Filter/Tone Toggle -->
            <button 
                class="control-btn" 
                :class="{ active: isToneOn }" 
                @click="ToggleTone" 
                title="Cinematic Filter"
            >
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v8"/>
                    <path d="M8 12h8"/>
                </svg>
            </button>

            <!-- Auto Rotate Toggle -->
            <button 
                class="control-btn" 
                :class="{ active: isRotating }" 
                @click="ToggleRotate" 
                title="Auto Rotate"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                    <path d="M3 21v-5h5"/>
                </svg>
            </button>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps, onBeforeUnmount } from "vue";
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
let animationId: number;

let model: THREE.Group | null = null;
let modelData = ref<{vertices: string, triangles: string}>();
let lights: Array<THREE.Light> = [];
let originalMaterials: Map<string, THREE.Material | THREE.Material[]> = new Map();

let isLoading = ref(true);
let isWireframe = ref<boolean>(false);
let isLightsOn = ref<boolean>(true); // Default to lights ON for better first impression
let isRotating = ref<boolean>(false);
let isToneOn = ref<boolean>(true);

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

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    scene.clear();
});

function Init()
{
    if(!container.value) return;

    const width = container.value?.clientWidth ?? window.innerWidth;
    const height = container.value?.clientHeight ?? window.innerHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100); 
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); 
    controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotateSpeed = 2.0;

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio); 
    renderer.toneMapping = USED_TONE_MAPPING;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Modern color management
    
    container.value?.appendChild(renderer.domElement);
}

function LoadLights()
{
    lights.forEach((light) => scene.remove(light));
    lights = [];
    
    // Professional Studio Setup
    const mainLight = new THREE.DirectionalLight(0xffffff, 0); 
    mainLight.position.set(5, 5, 5);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 0);
    fillLight.position.set(-5, 0, 5);
    
    const rimLight = new THREE.DirectionalLight(0xffffff, 0);
    rimLight.position.set(0, 5, -5);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); 

    lights.push(mainLight, fillLight, rimLight, ambientLight);
    scene.add(...lights);
}

function LoadSkybox(hdrPath: string)
{
    new RGBELoader().load(hdrPath, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
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
            
            model.position.sub(center);

            const maxDim = Math.max(size.x, size.y, size.z);
            let fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            cameraZ *= 1.5;

            camera.position.set(0, maxDim * 0.2, cameraZ); 
            camera.lookAt(0, 0, 0);
            controls.target.set(0, 0, 0);
            controls.update();

            // Stats
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
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                    
                    // Store original material for wireframe toggle
                    if(mesh.material) {
                         originalMaterials.set(mesh.uuid, mesh.material);
                    }
                }
            });

            modelData.value = {
                vertices: verticesCount.toLocaleString("en-US"),
                triangles: Math.floor(trianglesCount).toLocaleString("en-US"),
            };

            scene.add(model);
            
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
    animationId = requestAnimationFrame(Animate);
    controls.update();
    
    // --- Cinematic Grade Logic ---
    const lerpSpeed = 0.05;

    // Define "Cinematic" (Tone On) vs "Neutral" (Tone Off) states
    
    // Colors: Warm/Cool contrast vs Pure White
    const colorKey = isToneOn.value ? new THREE.Color(0xffeebb) : new THREE.Color(0xffffff); // Warm Key
    const colorFill = isToneOn.value ? new THREE.Color(0xccddff) : new THREE.Color(0xffffff); // Cool Fill
    const colorRim = isToneOn.value ? new THREE.Color(0xffaa66) : new THREE.Color(0xffffff); // Warm Rim

    // Intensities: Higher Contrast vs Flat
    // If Lights OFF, everything 0 except Ambient
    // If Lights ON + Tone ON: High Contrast (Strong Key, Dim Fill)
    // If Lights ON + Tone OFF: Flat Balanced
    
    let tKey = 0, tFill = 0, tRim = 0, tAmb = 0;

    if (isLightsOn.value) {
        if (isToneOn.value) {
            // Cinematic Contrast
            tKey = 3.5;
            tFill = 0.5; // Darker shadows
            tRim = 3.0;  // Pop the edges
            tAmb = 0.1;  // Deep blacks
        } else {
            // Standard/Neutral
            tKey = 2.0;
            tFill = 1.0;
            tRim = 1.0;
            tAmb = 0.5;
        }
    } else {
        // Lights OFF (Silhouette / Natural)
        tAmb = 1.0; // Just environmental
    }

    // Apply values
    if(lights.length >= 4) {
        // Colors
        (lights[0] as THREE.DirectionalLight).color.lerp(colorKey, lerpSpeed);
        (lights[1] as THREE.DirectionalLight).color.lerp(colorFill, lerpSpeed);
        (lights[2] as THREE.DirectionalLight).color.lerp(colorRim, lerpSpeed);

        // Intensities
        lights[0].intensity += (tKey - lights[0].intensity) * lerpSpeed;
        lights[1].intensity += (tFill - lights[1].intensity) * lerpSpeed;
        lights[2].intensity += (tRim - lights[2].intensity) * lerpSpeed;
        lights[3].intensity += (tAmb - lights[3].intensity) * lerpSpeed;
    }
    
    // Smooth Exposure (Slightly lower for cinematic to protect highlights)
    const targetExposure = isToneOn.value ? 0.9 : 1.0;
    renderer.toneMappingExposure += (targetExposure - renderer.toneMappingExposure) * lerpSpeed;

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
            const original = originalMaterials.get(mesh.uuid);
            
            if (isWireframe.value) {
                // Apply a clone with wireframe true to see polygons clearly
                // Note: We use the original material type but force wireframe
                // This keeps skinning/morphs working if using same shader
                if(Array.isArray(original)) {
                     // Handle multi-material if needed, usually just first for simple toggle
                     mesh.material = original.map(m => {
                         const clone = m.clone();
                         clone.wireframe = true;
                         return clone;
                     });
                } else if (original) {
                    const clone = original.clone();
                    clone.wireframe = true;
                    mesh.material = clone;
                }
            } else {
                // Restore original (Shaded)
                if(original) {
                    mesh.material = original;
                }
            }
        }
    });
}

function ToggleLights() {
    isLightsOn.value = !isLightsOn.value;
}

function ToggleTone() {
    isToneOn.value = !isToneOn.value;
}

function ToggleRotate() {
    isRotating.value = !isRotating.value;
    controls.autoRotate = isRotating.value;
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