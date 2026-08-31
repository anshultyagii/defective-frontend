/* ============================================================================
   LAYER 2 — Interactive 3D Space Shuttle Controller
   ----------------------------------------------------------------------------
   Self-contained ES module. No build step required — loaded via <script
   type="module"> with an import map pointing "three" at a CDN build.

   WHAT THIS FILE DOES
   - Mounts a transparent WebGL canvas into #shuttle-canvas (Layer 2, sits
     between the background glass wash (Layer 1) and the foreground glass UI
     / content (Layers 3-4), per the z-index architecture already in index.html.
   - Loads a .glb/.gltf shuttle model. If it fails (wrong path, not uploaded
     yet, network error), falls back to a procedural low-poly shuttle built
     from primitives, so you can test scroll behavior immediately.
   - Drives shuttle rotation (bank + pitch) from scroll progress across the
     3 page-sections, with lerped/damped interpolation for smoothness.
   - Adds a subtle mouse-parallax tilt layered on top of the scroll rotation.
   - Respects prefers-reduced-motion (disables easing/parallax, jumps to
     target state directly instead of animating every frame).

   >>> GLTF MODEL <<<
   CONFIG.GLTF_MODEL_URL below is set to NASA's official Space Shuttle (D)
   model, loaded directly from science.nasa.gov. Swap it for a different
   asset (or a locally hosted copy) at any time — nothing else changes.
   ============================================================================ */

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------
const CONFIG = {
  // NASA's official Space Shuttle (D) model (Johnson Space Center),
  // loaded directly from science.nasa.gov's asset CDN — 2.36 MB .glb.
  // Source page: https://science.nasa.gov/3d-resources/space-shuttle-d/
  // If cross-origin loading is ever blocked (CORS) or you want the app
  // to work offline, download this file and point GLTF_MODEL_URL at a
  // locally hosted copy instead — nothing else in this module needs to
  // change.
  GLTF_MODEL_URL:
    "https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/space-shuttle-(d)/Space%20Shuttle%20(D).glb",

  // If your .glb is Draco-compressed, this CDN decoder path covers it.
  // Harmless to leave enabled even for non-compressed models.
  DRACO_DECODER_PATH: "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",

  // Mount point — must match the Layer 2 placeholder div id in index.html.
  MOUNT_ID: "shuttle-canvas",

  // Base scale/orientation. The shuttle should read as HORIZONTAL at rest
  // (nose to one side, belly down), per the design spec.
  BASE_SCALE: 1,
  BASE_ROTATION: { x: 0, y: Math.PI / 2, z: 0 }, // yawed 90° => reads horizontal

  // Extra rotation applied ONLY to the loaded GLTF model, on top of
  // BASE_ROTATION — real-world assets don't always share the procedural
  // fallback's axis assumptions. If the NASA model loads facing the wrong
  // way (e.g. nose-up instead of horizontal), tweak these values first;
  // everything else in the file can stay untouched.
  GLTF_ROTATION_OFFSET: { x: 0, y: 0, z: 0 },

  // Scroll-driven rotation range (radians) applied ON TOP of base rotation
  // as the user scrolls from page 1 -> page 3 (progress 0 -> 1).
  SCROLL_BANK_Z: Math.PI * 0.18,   // roll/bank around its long axis
  SCROLL_PITCH_X: Math.PI * 0.10, // nose up/down pitch
  SCROLL_YAW_Y: Math.PI * 0.12,    // slight yaw drift

  // Subtle vertical drift + scale breathing across scroll, so it doesn't
  // feel like a static object merely rotating in place.
  SCROLL_Y_TRAVEL: 0.6,     // world units of vertical drift, top to bottom
  SCROLL_SCALE_RANGE: 0.08, // +/- fractional scale change across scroll

  // Mouse parallax tilt (radians), applied on top of scroll rotation.
  POINTER_TILT_X: 0.12,
  POINTER_TILT_Y: 0.16,

  // Damping factors (0-1). Lower = smoother/laggier, higher = snappier.
  SCROLL_DAMPING: 0.06,
  POINTER_DAMPING: 0.045,
};

// ---------------------------------------------------------------------------
// REDUCED MOTION
// ---------------------------------------------------------------------------
const prefersReducedMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------------------------------------------------------------------------
// SMALL MATH HELPERS
// ---------------------------------------------------------------------------
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => Math.min(1, Math.max(0, v));

// ---------------------------------------------------------------------------
// MAIN CONTROLLER CLASS
// ---------------------------------------------------------------------------
class ShuttleController {
  constructor(mountId = CONFIG.MOUNT_ID) {
    this.mount = document.getElementById(mountId);
    if (!this.mount) {
      console.warn(`[ShuttleController] mount #${mountId} not found.`);
      return;
    }

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // -- Renderer: transparent, sits visually between L1 (glass wash) and
    //    L3/L4 (foreground glass + content) thanks to the CSS z-index
    //    already applied to #shuttle-canvas in index.html.
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // transparent background — space photo shows through
      powerPreference: "high-performance",
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.style.pointerEvents = "none"; // never block UI clicks
    this.renderer.domElement.setAttribute("aria-hidden", "true");

    // Clear any placeholder markup (the dashed-border div from index.html)
    // and mount the real canvas.
    this.mount.innerHTML = "";
    this.mount.appendChild(this.renderer.domElement);

    // -- Scene / Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 8);

    this._setupLights();
    this.isGltfModel = false; // flips true once the real NASA model swaps in
    this._setupFallbackImmediately(); // shows instantly, swapped out if GLTF loads
    this._loadModel();

    // -- Scroll state
    this.scrollTargetT = 0; // 0..1 target progress
    this.scrollCurrentT = 0; // eased/damped progress actually used to render

    // -- Pointer state (normalized -1..1)
    this.pointerTarget = { x: 0, y: 0 };
    this.pointerCurrent = { x: 0, y: 0 };

    this._bindEvents();
    this._tick = this._tick.bind(this);
    requestAnimationFrame(this._tick);
  }

  // -------------------------------------------------------------------------
  _setupLights() {
    const key = new THREE.DirectionalLight(0xbcd4ff, 2.2);
    key.position.set(4, 5, 6);
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0x6f9dff, 1.4);
    rim.position.set(-6, -2, -4);
    this.scene.add(rim);

    const ambient = new THREE.AmbientLight(0x223355, 0.9);
    this.scene.add(ambient);
  }

  // -------------------------------------------------------------------------
  // PROCEDURAL FALLBACK SHUTTLE
  // Low-poly primitives standing in for a real .glb until one is provided,
  // or if the GLTF fails to load. Oriented so it reads horizontal at rest.
  // -------------------------------------------------------------------------
  _buildProceduralShuttle() {
    const group = new THREE.Group();
    group.name = "procedural-shuttle";

    const hullMat = new THREE.MeshStandardMaterial({
      color: 0xd8dee8,
      metalness: 0.65,
      roughness: 0.32,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x1c2230,
      metalness: 0.4,
      roughness: 0.5,
    });
    const glowMat = new THREE.MeshStandardMaterial({
      color: 0xff8a3d,
      emissive: 0xff6a1a,
      emissiveIntensity: 1.4,
      roughness: 0.4,
    });

    // Fuselage — long capsule along local X so BASE_ROTATION.y yaw reads
    // "horizontal" once applied to the group.
    const fuselage = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.42, 2.4, 4, 12),
      hullMat
    );
    fuselage.rotation.z = Math.PI / 2; // lay capsule along X
    group.add(fuselage);

    // Nose cone accent
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.6, 12), darkMat);
    nose.rotation.z = -Math.PI / 2;
    nose.position.x = 1.75;
    group.add(nose);

    // Delta wings
    const wingGeo = new THREE.ConeGeometry(1.1, 0.18, 3);
    const wingL = new THREE.Mesh(wingGeo, darkMat);
    wingL.rotation.x = Math.PI / 2;
    wingL.rotation.z = Math.PI / 2;
    wingL.position.set(-0.3, 0, 0.55);
    wingL.scale.set(1, 1.6, 1);
    group.add(wingL);

    const wingR = wingL.clone();
    wingR.position.z = -0.55;
    wingR.rotation.z = -Math.PI / 2;
    group.add(wingR);

    // Tail fin
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.16, 3), darkMat);
    tail.rotation.x = Math.PI / 2;
    tail.position.set(-1.0, 0.5, 0);
    tail.rotation.z = Math.PI;
    group.add(tail);

    // Engine glow (this doubles as a stand-in for RocketFlame-style accent)
    const engine = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), glowMat);
    engine.position.set(-1.35, 0, 0);
    group.add(engine);
    this._engineGlow = engine;

    const enginePointLight = new THREE.PointLight(0xff7a2e, 3, 4, 2);
    enginePointLight.position.copy(engine.position);
    group.add(enginePointLight);
    this._engineLight = enginePointLight;

    return group;
  }

  _setupFallbackImmediately() {
    this.shuttle = this._buildProceduralShuttle();
    this._applyBaseTransform(this.shuttle);
    this.scene.add(this.shuttle);
  }

  _applyBaseTransform(obj) {
    obj.rotation.set(
      CONFIG.BASE_ROTATION.x,
      CONFIG.BASE_ROTATION.y,
      CONFIG.BASE_ROTATION.z
    );
    obj.scale.setScalar(CONFIG.BASE_SCALE);
  }

  // -------------------------------------------------------------------------
  // GLTF LOADING — swaps the procedural fallback for the real model on
  // success. On failure (404, bad path, offline), the fallback just stays.
  // -------------------------------------------------------------------------
  _loadModel() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(CONFIG.DRACO_DECODER_PATH);

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      CONFIG.GLTF_MODEL_URL, // <<< set in CONFIG.GLTF_MODEL_URL above
      (gltf) => {
        const model = gltf.scene;

        // Normalize scale so any real-world-sized model fits the same
        // framing the procedural fallback used.
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const normalizedScale = (2.6 / maxDim) * CONFIG.BASE_SCALE;
        model.scale.setScalar(normalizedScale);

        // Recenter on its own origin.
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center.multiplyScalar(normalizedScale));

        model.rotation.set(
          CONFIG.BASE_ROTATION.x + CONFIG.GLTF_ROTATION_OFFSET.x,
          CONFIG.BASE_ROTATION.y + CONFIG.GLTF_ROTATION_OFFSET.y,
          CONFIG.BASE_ROTATION.z + CONFIG.GLTF_ROTATION_OFFSET.z
        );

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
          }
        });

        // Swap: remove procedural fallback, add real model.
        this.scene.remove(this.shuttle);
        this.shuttle = model;
        this.scene.add(this.shuttle);
        this._engineGlow = null; // real model has no procedural engine glow ref
        this._engineLight = null;
        this.isGltfModel = true; // per-frame motion adds GLTF_ROTATION_OFFSET on top of base
        console.info("[ShuttleController] GLTF model loaded — replaced fallback.");
      },
      undefined, // onProgress (unused)
      (err) => {
        console.warn(
          "[ShuttleController] GLTF load failed — keeping procedural fallback.",
          "Set CONFIG.GLTF_MODEL_URL to your .glb/.gltf path to load a real model.",
          err
        );
      }
    );
  }

  // -------------------------------------------------------------------------
  _bindEvents() {
    window.addEventListener("resize", () => this._onResize());

    // Pure scroll-event listener (no GSAP dependency) — computes 0..1
    // progress across total scrollable page height.
    window.addEventListener(
      "scroll",
      () => {
        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop;
        const scrollHeight = doc.scrollHeight - doc.clientHeight;
        this.scrollTargetT = clamp01(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
      },
      { passive: true }
    );

    // Pointer parallax — normalized -1..1 from viewport center.
    window.addEventListener(
      "pointermove",
      (e) => {
        this.pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.pointerTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
      },
      { passive: true }
    );

    // Reset parallax when the pointer leaves the window (e.g. touch device).
    window.addEventListener("pointerleave", () => {
      this.pointerTarget.x = 0;
      this.pointerTarget.y = 0;
    });
  }

  _onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  // -------------------------------------------------------------------------
  // PER-FRAME UPDATE
  // -------------------------------------------------------------------------
  _tick() {
    requestAnimationFrame(this._tick);

    if (prefersReducedMotion) {
      // Snap directly to targets, skip easing + skip parallax entirely.
      this.scrollCurrentT = this.scrollTargetT;
      this.pointerCurrent.x = 0;
      this.pointerCurrent.y = 0;
    } else {
      this.scrollCurrentT = lerp(this.scrollCurrentT, this.scrollTargetT, CONFIG.SCROLL_DAMPING);
      this.pointerCurrent.x = lerp(this.pointerCurrent.x, this.pointerTarget.x, CONFIG.POINTER_DAMPING);
      this.pointerCurrent.y = lerp(this.pointerCurrent.y, this.pointerTarget.y, CONFIG.POINTER_DAMPING);
    }

    this._applyMotion(this.scrollCurrentT, this.pointerCurrent);

    // Simple animated engine glow on the procedural fallback only.
    if (this._engineGlow) {
      const pulse = 1 + Math.sin(performance.now() * 0.006) * 0.15;
      this._engineGlow.scale.setScalar(pulse);
      if (this._engineLight) {
        this._engineLight.intensity = 2.4 + Math.sin(performance.now() * 0.006) * 0.8;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  // t: eased scroll progress 0..1
  // pointer: eased pointer {x,y} in -1..1
  _applyMotion(t, pointer) {
    if (!this.shuttle) return;

    // Ease the raw t with a smoothstep so motion isn't perfectly linear.
    const eased = t * t * (3 - 2 * t);

    // Real GLTF gets its extra orientation offset baked into the base;
    // the procedural fallback ignores it (offset defaults to zero anyway).
    const offset = this.isGltfModel
      ? CONFIG.GLTF_ROTATION_OFFSET
      : { x: 0, y: 0, z: 0 };

    // Base rotation + scroll-driven bank/pitch/yaw.
    this.shuttle.rotation.x =
      CONFIG.BASE_ROTATION.x + offset.x + eased * CONFIG.SCROLL_PITCH_X + pointer.y * CONFIG.POINTER_TILT_X;
    this.shuttle.rotation.y =
      CONFIG.BASE_ROTATION.y + offset.y + eased * CONFIG.SCROLL_YAW_Y + pointer.x * CONFIG.POINTER_TILT_Y * -1;
    this.shuttle.rotation.z =
      CONFIG.BASE_ROTATION.z + offset.z + Math.sin(eased * Math.PI) * CONFIG.SCROLL_BANK_Z;

    // Vertical drift across the 3 pages (top of page 1 -> bottom of page 3).
    this.shuttle.position.y = CONFIG.SCROLL_Y_TRAVEL * (0.5 - eased);

    // Subtle scale breathing so it doesn't read as a static rotating prop.
    const scaleFactor =
      CONFIG.BASE_SCALE * (1 + Math.sin(eased * Math.PI) * CONFIG.SCROLL_SCALE_RANGE);
    this.shuttle.scale.setScalar(scaleFactor);
  }
}

// ---------------------------------------------------------------------------
// AUTO-INIT
// Runs once the DOM is ready. Exported too, in case you want to control
// init timing yourself (e.g. after a loading screen finishes).
// ---------------------------------------------------------------------------
export function initShuttleController(mountId) {
  return new ShuttleController(mountId);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initShuttleController());
} else {
  initShuttleController();
}
