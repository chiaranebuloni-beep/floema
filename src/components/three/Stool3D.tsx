"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Misure dal disegno tecnico, in centimetri (origine: spigolo sinistro del piano, a terra).
// Il modello viene scalato con l'altezza totale = 1 unità.
const CM = 1 / 45;
const HEIGHT = 45;
const TOP = 35; // piano 35 × 35
const THICK = 2.8; // spessore di piano e tavola
const UNDER = HEIGHT - THICK; // quota del sotto-piano
// Tavola inclinata a 55,1°: dallo spigolo destro del piano scende a terra a sinistra.
const BOARD_COT = 1 / Math.tan((55.1 * Math.PI) / 180);
const BOARD_OUT = TOP - HEIGHT * BOARD_COT; // filo esterno a terra
const BOARD_IN = BOARD_OUT - THICK / Math.sin((55.1 * Math.PI) / 180); // filo interno a terra
// Gamba: 109° con il piano, larga 5,4 cm in alto e 8,3 cm a terra, attraversa la tavola in un'asola.
const LEG_TOP_X = 6.8;
const LEG_TOP_W = 5.4;
const LEG_FOOT_W = 8.3;
const LEG_DX = UNDER / Math.tan(((180 - 109) * Math.PI) / 180);
const LEG_DEPTH = 5; // non quotata: stimata dalla vista 3D, centrata

// Legno vero, ritagliato dalla foto dall'alto del piano e tinto come nel disegno tecnico:
// piano e tavola in legno chiaro, gamba più scura.
const WOOD_LIGHT_URL = "/images/textures/legno-chiaro.jpg";
const WOOD_DARK_URL = "/images/textures/legno-scuro.jpg";
const TEX_SPAN = 1.3; // quanta lunghezza di legno (in altezze del modello) copre una ripetizione della texture
const TEX_ASPECT = 620 / 415;

// Coordinate UV allineate alla lunghezza di ogni pezzo, così la venatura segue il legno.
function grainUV(angle: number, offset: [number, number]): THREE.ExtrudeGeometryOptions["UVGenerator"] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const k = 1 / TEX_SPAN;
  const along = (x: number, y: number) => (x * cos + y * sin) * k + offset[0];
  const across = (x: number, y: number) => (-x * sin + y * cos) * k * TEX_ASPECT + offset[1];
  const vtx = (v: ArrayLike<number>, i: number) => [v[i * 3], v[i * 3 + 1], v[i * 3 + 2]] as const;
  return {
    generateTopUV(_g, v, a, b, c) {
      return [a, b, c].map((i) => {
        const [x, y] = vtx(v, i);
        return new THREE.Vector2(along(x, y), across(x, y));
      });
    },
    generateSideWallUV(_g, v, a, b, c, d) {
      return [a, b, c, d].map((i) => {
        const [x, y, z] = vtx(v, i);
        // z va da 0 alla profondità del pezzo: con l'offset la faccia larga resta dentro una sola copia della texture.
        return new THREE.Vector2(along(x, y), z * k * TEX_ASPECT + offset[1] + 0.31);
      });
    },
  };
}

// Prisma estruso in profondità a partire dal profilo laterale, con spigoli leggermente smussati.
function prism(points: [number, number][], depth: number, z: number, material: THREE.Material, angle: number, offset: [number, number]) {
  const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.003,
    bevelThickness: 0.003,
    bevelSegments: 3,
    UVGenerator: grainUV(angle, offset),
  });
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.z = z;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function buildStool(light: THREE.Texture, dark: THREE.Texture) {
  const woodMat = new THREE.MeshStandardMaterial({ map: light, bumpMap: light, bumpScale: 1.4, roughness: 0.75, metalness: 0 });
  const legMat = new THREE.MeshStandardMaterial({ map: dark, bumpMap: dark, bumpScale: 1.4, roughness: 0.6, metalness: 0 });
  const P = (x: number, y: number): [number, number] => [x * CM, y * CM];
  const boardIn = (y: number) => BOARD_IN + y * BOARD_COT;
  const boardOut = (y: number) => BOARD_OUT + y * BOARD_COT;

  const group = new THREE.Group();

  // Piano: la testata destra è tagliata sull'inclinazione della tavola.
  group.add(
    prism([P(0, HEIGHT), P(boardIn(HEIGHT), HEIGHT), P(boardIn(UNDER), UNDER), P(0, UNDER)], TOP * CM, (-TOP / 2) * CM, woodMat, 0, [0.2, -0.26]),
  );

  // Tavola inclinata, larga quanto il piano.
  group.add(
    prism(
      [P(boardIn(0), 0), P(boardOut(0), 0), P(boardOut(HEIGHT), HEIGHT), P(boardIn(HEIGHT), HEIGHT)],
      TOP * CM,
      (-TOP / 2) * CM,
      woodMat,
      Math.atan2(1, BOARD_COT),
      [0.03, -0.26],
    ),
  );

  // Gamba rastremata, centrata in profondità.
  group.add(
    prism(
      [
        P(LEG_TOP_X, UNDER),
        P(LEG_TOP_X + LEG_TOP_W, UNDER),
        P(LEG_TOP_X + LEG_DX + LEG_FOOT_W, 0),
        P(LEG_TOP_X + LEG_DX, 0),
      ],
      LEG_DEPTH * CM,
      (-LEG_DEPTH / 2) * CM,
      legMat,
      Math.atan2(-UNDER, LEG_DX),
      [0.71, 0.46],
    ),
  );

  // Centra il gruppo sull'origine, appoggiato a terra.
  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  group.position.set(-center.x, -box.min.y, -center.z);
  const wrap = new THREE.Group();
  wrap.add(group);
  return { stool: wrap, woodMat, legMat };
}

type Props = {
  /** Tinte moltiplicate sulle texture: cambiano la colorazione senza ricreare la scena. */
  woodTint?: string;
  legTint?: string;
};

export default function Stool3D({ woodTint = "#ffffff", legTint = "#ffffff" }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const mats = useRef<{ wood: THREE.MeshStandardMaterial; leg: THREE.MeshStandardMaterial } | null>(null);
  const tints = useRef({ woodTint, legTint });
  tints.current = { woodTint, legTint };

  useEffect(() => {
    const el = mount.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.86;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.38;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 50);
    // Vista iniziale come nel disegno tecnico: tavola larga davanti, gamba sotto il piano.
    camera.position.set(-2.19, 1.5, 1.6);

    const loadWood = (url: string) => {
      const t = new THREE.TextureLoader().load(url);
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return t;
    };
    const texLight = loadWood(WOOD_LIGHT_URL);
    const texDark = loadWood(WOOD_DARK_URL);
    const { stool, woodMat, legMat } = buildStool(texLight, texDark);
    mats.current = { wood: woodMat, leg: legMat };
    woodMat.color.set(tints.current.woodTint);
    legMat.color.set(tints.current.legTint);
    scene.add(stool);

    // Luce principale radente e laterale, così il piano non si brucia rispetto alle facce verticali.
    const key = new THREE.DirectionalLight(0xfff1e0, 1.7);
    key.position.set(2.8, 1.9, 2.2);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -1.5;
    key.shadow.camera.right = 1.5;
    key.shadow.camera.top = 1.5;
    key.shadow.camera.bottom = -1.5;
    key.shadow.radius = 10;
    key.shadow.blurSamples = 16;
    key.shadow.bias = -0.0005;
    scene.add(key);
    scene.add(new THREE.HemisphereLight(0xf6f2ec, 0x6f665b, 0.4));
    const fill = new THREE.DirectionalLight(0xf2ece4, 0.45);
    fill.position.set(-2.4, 1.2, -1.2);
    scene.add(fill);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({ opacity: 0.13 }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.48, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false; // la rotella continua a scorrere la pagina
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.12;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.autoRotate = !reduce;
    controls.autoRotateSpeed = 0.9;
    controls.update();
    // OrbitControls imposta touch-action: none; lo riapriamo così su mobile la pagina scorre anche sopra il modello.
    renderer.domElement.style.touchAction = "pan-y";

    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    const onStart = () => {
      controls.autoRotate = false;
      clearTimeout(resumeTimer);
    };
    const onEnd = () => {
      if (reduce) return;
      resumeTimer = setTimeout(() => (controls.autoRotate = true), 2500);
    };
    controls.addEventListener("start", onStart);
    controls.addEventListener("end", onEnd);

    // Distanza della camera adattata al riquadro: nei formati verticali si allontana per inquadrare tutto.
    const baseDistance = camera.position.distanceTo(controls.target);
    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const offset = camera.position.clone().sub(controls.target);
      offset.setLength(baseDistance * Math.max(1, 1.25 / camera.aspect));
      camera.position.copy(controls.target).add(offset);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Disegna solo quando il canvas è visibile.
    let visible = false;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      controls.update();
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resumeTimer);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        if (!(o instanceof THREE.Mesh)) return;
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      });
      texLight.dispose();
      texDark.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  // Cambio colorazione: aggiorna solo le tinte dei materiali.
  useEffect(() => {
    if (!mats.current) return;
    mats.current.wood.color.set(woodTint);
    mats.current.leg.color.set(legTint);
  }, [woodTint, legTint]);

  return <div ref={mount} className="stool3d__canvas" aria-label="Modello 3D dello Sgabello 01, trascina per ruotarlo" role="img" />;
}
