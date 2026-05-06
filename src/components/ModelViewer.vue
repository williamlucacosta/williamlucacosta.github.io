<template>
  <div class="model-viewer" ref="container">
    <div v-if="isLoading" class="loader-overlay">
      <div class="spinner"></div>
    </div>

    <div class="hud-dock" v-if="!isLoading">
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

      <div class="dock-group controls-group">
        <button class="control-btn" :class="{ active: isWireframe }" @click="toggleWireframe" title="Wireframe">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18" />
          </svg>
        </button>

        <button class="control-btn" :class="{ active: isLightsOn }" @click="toggleLights" title="Studio Lighting">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>

        <button class="control-btn" :class="{ active: isToneOn }" @click="toggleTone" title="Cinematic Tone">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" />
          </svg>
        </button>

        <button class="control-btn" :class="{ active: isRotating }" @click="toggleRotate" title="Auto Rotate">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";

// eslint-disable-next-line no-undef
const props = defineProps<{ modelName: string }>();

const container = ref<HTMLDivElement | null>(null);
const modelData = ref<{ vertices: string; triangles: string }>();

const isLoading = ref(true);
const isWireframe = ref(false);
const isLightsOn = ref(true);
const isRotating = ref(true);
const isToneOn = ref(true);

// Three.js handles
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let composer: EffectComposer;
let bloomPass: UnrealBloomPass;
let pmrem: THREE.PMREMGenerator;

let model: THREE.Group | null = null;
let originalMaterials: Map<string, THREE.Material | THREE.Material[]> = new Map();

// Light handles
let keyLight: THREE.DirectionalLight;
let fillLight: THREE.DirectionalLight;
let rimLight: THREE.DirectionalLight;
let topSpot: THREE.SpotLight;
let hemi: THREE.HemisphereLight;
let groundShadow: THREE.Mesh;

let frameId = 0;
let resizeObserver: ResizeObserver | null = null;
let onResize: (() => void) | null = null;

const BG = 0x070709;

onMounted(() => {
    init();
    setupEnvironment();
    setupLights();
    setupGround();
    if (props.modelName) {
        loadModel(`/models/${props.modelName}/model.glb`);
    }
    animate();
    bindResize();
});

onBeforeUnmount(() => {
    cancelAnimationFrame(frameId);
    if (onResize) window.removeEventListener("resize", onResize);
    if (resizeObserver && container.value) resizeObserver.unobserve(container.value);
    pmrem?.dispose();
    renderer?.dispose();
    composer?.dispose?.();
    scene?.clear();
});

function init() {
    if (!container.value) return;

    const w = container.value.clientWidth;
    const h = container.value.clientHeight;

    scene = new THREE.Scene();
    scene.background = null; // transparent — let CSS radial show through
    scene.fog = new THREE.FogExp2(BG, 0.035);

    camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
    camera.position.set(3.2, 1.8, 5.4);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.value.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 1.5;
    controls.maxDistance = 18;
    controls.target.set(0, 0.6, 0);
    controls.maxPolarAngle = Math.PI * 0.52;
    controls.autoRotate = isRotating.value;
    controls.autoRotateSpeed = 0.6;

    // Post-processing
    composer = new EffectComposer(renderer);
    composer.setSize(w, h);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer.addPass(new RenderPass(scene, camera));

    // Tight bloom — only true highlights, very subtle
    bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.18, 0.5, 0.95);
    composer.addPass(bloomPass);

    composer.addPass(new OutputPass());
}

function setupEnvironment() {
    pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    // Always set RoomEnvironment as fallback first — it's procedural and immediate.
    const envScene = new RoomEnvironment();
    const roomTex = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = roomTex;

    // Try HDR — when it loads, swap in
    new RGBELoader().load(
        "/skybox.hdr",
        (tex) => {
            tex.mapping = THREE.EquirectangularReflectionMapping;
            const hdrEnv = pmrem.fromEquirectangular(tex).texture;
            scene.environment = hdrEnv;
            tex.dispose();
        },
        undefined,
        () => { /* HDR optional — keep RoomEnvironment fallback */ }
    );
}

function setupLights() {
    // KEY — neutral-warm 5000K-ish, top-front-right, casts shadows
    keyLight = new THREE.DirectionalLight(0xffeed8, 1.6);
    keyLight.position.set(4.5, 6.5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.radius = 6;
    scene.add(keyLight);

    // FILL — cool soft, opposite side
    fillLight = new THREE.DirectionalLight(0xc6d8ff, 0.55);
    fillLight.position.set(-4, 2.2, 3);
    scene.add(fillLight);

    // RIM — restrained sapphire from behind, shapes the silhouette
    rimLight = new THREE.DirectionalLight(0x6aa6ff, 1.2);
    rimLight.position.set(-1.5, 3.5, -5);
    scene.add(rimLight);

    // Top SpotLight — focused beam, much softer
    topSpot = new THREE.SpotLight(0xffffff, 14, 18, Math.PI * 0.22, 0.7, 1.6);
    topSpot.position.set(0, 8, 1.5);
    topSpot.target.position.set(0, 0, 0);
    topSpot.castShadow = true;
    topSpot.shadow.mapSize.set(1024, 1024);
    topSpot.shadow.bias = -0.0006;
    topSpot.shadow.radius = 8;
    scene.add(topSpot);
    scene.add(topSpot.target);

    // Hemisphere — soft global ambient
    hemi = new THREE.HemisphereLight(0x4060a0, 0x1a1006, 0.18);
    scene.add(hemi);
}

function setupGround() {
    // Invisible ground that only catches shadows — keeps subject floating with contact shadow
    const geo = new THREE.PlaneGeometry(30, 30);
    const mat = new THREE.ShadowMaterial({ opacity: 0.55 });
    groundShadow = new THREE.Mesh(geo, mat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -0.001;
    groundShadow.receiveShadow = true;
    scene.add(groundShadow);
}

function loadModel(path: string) {
    const loader = new GLTFLoader();
    loader.load(
        path,
        (gltf) => {
            model = gltf.scene;

            // Center on origin, lift to y=0 so it sits on the ground plane
            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            // Translate so feet touch y=0
            model.position.x -= center.x;
            model.position.z -= center.z;
            model.position.y -= box.min.y;

            // Normalize scale so largest dim ~= 2.4
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetSize = 2.4;
            if (maxDim > 0) model.scale.setScalar(targetSize / maxDim);

            // Stats + shadow casting + material capture
            let verts = 0;
            let tris = 0;

            model.traverse((child) => {
                const m = child as THREE.Mesh;
                if (m.isMesh) {
                    m.castShadow = true;
                    m.receiveShadow = true;
                    verts += m.geometry.attributes.position.count;
                    if (m.geometry.index) tris += m.geometry.index.count / 3;
                    else tris += m.geometry.attributes.position.count / 3;
                    if (m.material) originalMaterials.set(m.uuid, m.material);

                    // Restrained env reflection — keeps the model looking like a model, not chrome
                    const mat = m.material as THREE.MeshStandardMaterial;
                    if (mat && 'envMapIntensity' in mat) {
                        mat.envMapIntensity = 0.55;
                    }
                }
            });

            modelData.value = {
                vertices: verts.toLocaleString("en-US"),
                triangles: Math.floor(tris).toLocaleString("en-US"),
            };

            scene.add(model);

            // Re-aim camera with proper framing now that model is positioned
            const targetY = (size.y * (targetSize / Math.max(size.x, size.y, size.z, 1))) * 0.55;
            controls.target.set(0, targetY, 0);
            const dist = targetSize * 2.6;
            camera.position.set(dist * 0.6, targetY + targetSize * 0.55, dist * 0.95);
            controls.update();

            // Aim spotlight at the subject's chest height
            topSpot.target.position.set(0, targetY, 0);

            isLoading.value = false;
        },
        undefined,
        (err) => {
            console.error("Error loading model", err);
            isLoading.value = false;
        }
    );
}

function animate() {
    frameId = requestAnimationFrame(animate);
    controls.update();

    // Smoothly drive parameters from current toggles (no hard cuts)
    const lerp = 0.08;

    // Tone palettes
    const cineKey = new THREE.Color(0xfff4d6);
    const cineFill = new THREE.Color(0xb6cdff);
    const cineRim = new THREE.Color(0x6aa6ff);
    const flatKey = new THREE.Color(0xffffff);
    const flatFill = new THREE.Color(0xffffff);
    const flatRim = new THREE.Color(0xeeeeee);

    keyLight.color.lerp(isToneOn.value ? cineKey : flatKey, lerp);
    fillLight.color.lerp(isToneOn.value ? cineFill : flatFill, lerp);
    rimLight.color.lerp(isToneOn.value ? cineRim : flatRim, lerp);

    let tKey = 0, tFill = 0, tRim = 0, tHemi = 0, tSpot = 0;
    if (isLightsOn.value) {
        if (isToneOn.value) {
            // Cinematic: a touch of contrast, restrained
            tKey = 1.6; tFill = 0.45; tRim = 1.4; tHemi = 0.18; tSpot = 14;
        } else {
            // Neutral studio: more even fill, less rim
            tKey = 1.4; tFill = 0.9; tRim = 0.4; tHemi = 0.35; tSpot = 8;
        }
    } else {
        tHemi = 0.45;
    }

    keyLight.intensity += (tKey - keyLight.intensity) * lerp;
    fillLight.intensity += (tFill - fillLight.intensity) * lerp;
    rimLight.intensity += (tRim - rimLight.intensity) * lerp;
    hemi.intensity += (tHemi - hemi.intensity) * lerp;
    topSpot.intensity += (tSpot - topSpot.intensity) * lerp;

    // Bloom + exposure: very small differences between modes
    const targetBloom = isToneOn.value ? 0.20 : 0.10;
    const targetExposure = isToneOn.value ? 0.95 : 1.0;
    bloomPass.strength += (targetBloom - bloomPass.strength) * lerp;
    renderer.toneMappingExposure += (targetExposure - renderer.toneMappingExposure) * lerp;

    // Shadow opacity dims when lights off
    const shadowOpacity = isLightsOn.value ? 0.55 : 0.15;
    const sm = groundShadow.material as THREE.ShadowMaterial;
    sm.opacity += (shadowOpacity - sm.opacity) * lerp;

    composer.render();
}

function bindResize() {
    onResize = () => {
        if (!container.value) return;
        const w = container.value.clientWidth;
        const h = container.value.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h);
        bloomPass.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    if (typeof ResizeObserver !== "undefined" && container.value) {
        resizeObserver = new ResizeObserver(() => onResize?.());
        resizeObserver.observe(container.value);
    }
}

// Toggles
function toggleWireframe() {
    if (!model) return;
    isWireframe.value = !isWireframe.value;
    model.traverse((child) => {
        const m = child as THREE.Mesh;
        if (!m.isMesh) return;
        const original = originalMaterials.get(m.uuid);
        if (isWireframe.value) {
            if (Array.isArray(original)) {
                m.material = original.map((x) => {
                    const c = x.clone() as THREE.Material & { wireframe?: boolean };
                    c.wireframe = true;
                    return c;
                });
            } else if (original) {
                const c = original.clone() as THREE.Material & { wireframe?: boolean };
                c.wireframe = true;
                m.material = c;
            }
        } else if (original) {
            m.material = original;
        }
    });
}

function toggleLights() { isLightsOn.value = !isLightsOn.value; }
function toggleTone()  { isToneOn.value = !isToneOn.value; }
function toggleRotate(){ isRotating.value = !isRotating.value; controls.autoRotate = isRotating.value; }
</script>

<style scoped>
.model-viewer {
    position: relative;
    width: 100%;
    height: 100%;
    background: transparent;
}

.model-viewer :deep(canvas) {
    display: block;
}

/* Loader */
.loader-overlay {
    position: absolute;
    inset: 0;
    background: var(--bg);
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
}

.spinner {
    width: 36px;
    height: 36px;
    border: 2px solid var(--border-h);
    border-radius: 50%;
    border-top-color: var(--accent);
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* HUD */
.hud-dock {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: stretch;
    gap: 4px;
    z-index: 10;
    padding: 6px;
    background: rgba(7, 7, 9, 0.78);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid var(--border-h);
    border-radius: 999px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(61, 139, 255, 0.06) inset;
}

.dock-group {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
}

.stats-group {
    border-right: 1px solid var(--border);
    padding: 6px 14px 6px 10px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.1;
}

.stat-label {
    font-family: var(--fm);
    font-size: 8.5px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--text-3);
}

.stat-value {
    font-family: var(--fm);
    font-size: 11px;
    color: var(--text-2);
    margin-top: 2px;
}

.stat-divider {
    width: 1px;
    height: 18px;
    background: var(--border);
    margin: 0 4px;
}

.controls-group {
    padding: 0 4px;
}

.control-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--text-3);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
    padding: 0;
}

.control-btn:hover {
    color: var(--text);
    background: var(--surface-h);
}

.control-btn.active {
    background: rgba(61, 139, 255, 0.12);
    color: var(--accent-2);
    box-shadow: 0 0 0 1px var(--accent-b) inset, 0 0 12px rgba(61, 139, 255, 0.25);
}
</style>
