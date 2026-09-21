import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { ICONS, MODULES, SHAPES_3D, SWATCHES } from './stl_maker_data.js';


/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */

const style = document.createElement('style');

style.textContent = `
.module-btn.active-blue{
  background:#3a6fd8 !important;
  border-color:#3a6fd8 !important;
  color:#fff !important;
}
.module-btn.active-blue svg{ color:#fff !important; }

#slideMenu{ transition:none !important; }
#slideMenu.open{ width:92px; min-width:92px; }

.toggle-row2{
  display:flex;
  gap:4px;
  width:100%;
}
.toggle-row2 button{
  flex:1;
  padding:6px 1px;
  border-radius:7px;
  border:1px solid var(--line);
  background:var(--navy-3);
  color:var(--ink);
  font-size:9.5px;
  font-weight:700;
}
.toggle-row2 button.toggle-active{
  background:#3a6fd8;
  color:#fff;
  border-color:#3a6fd8;
}

.add-rect{
  width:100%;
  padding:6px 1px;
  border-radius:7px;
  border:1px solid var(--line);
  background:var(--navy-3);
  color:var(--gold-light);
  font-size:8.5px;
  font-weight:700;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:3px;
}
.add-rect svg{
  width:12px;
  height:12px;
  flex:0 0 auto;
}

.h3-stack{
  display:flex;
  flex-direction:column;
  gap:6px;
  width:100%;
}

.menu-scroll{
  align-items:center;
}

.tile3{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:3px;
  width:72px;
  aspect-ratio:1;
  border-radius:12px;
  background:var(--navy-3);
  border:1px solid var(--line);
  color:var(--ink);
  padding:4px 3px;
  position:relative;
}

.tile3 svg{
  width:16px;
  height:16px;
  color:var(--gold-light);
  flex:0 0 auto;
}

.tile3 span{
  font-size:8.5px;
  font-weight:600;
  text-align:center;
  line-height:1.1;
  display:block;
  overflow:hidden;
  text-overflow:ellipsis;
  max-height:2.2em;
}

.tile3.toggle-active{
  background:#3a6fd8;
  border-color:#3a6fd8;
  color:#fff;
}
.tile3.toggle-active svg{ color:#fff; }

.tile3.layer-active{
  background:#fff;
  border:2px solid #3a6fd8;
  color:#111;
}
.tile3.layer-active svg{ color:#3a6fd8; }
.tile3.layer-active span{ color:#111; }

.tile-num{
  position:absolute;
  top:-7px;
  right:-4px;
  background:var(--gold);
  color:var(--navy);
  font-size:9px;
  font-weight:800;
  width:17px;
  height:17px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
}

.tile-del{
  position:absolute;
  bottom:-7px;
  right:-7px;
  width:20px;
  height:20px;
  border-radius:6px;
  background:var(--navy);
  border:1px solid var(--line);
  color:var(--muted);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:2;
}
.tile-del svg{
  width:11px;
  height:11px;
}
.tile-del.armed{
  background:var(--danger);
  color:#fff;
  border-color:var(--danger);
}

.stepper-row{
  display:flex;
  align-items:center;
  gap:2px;
  width:100%;
  min-width:0;
}

.stepper-row .step-lbl{
  display:block;
  width:8px;
  font-family:'JetBrains Mono',monospace;
  font-size:8px;
  color:var(--gold);
  flex:0 0 auto;
  text-align:center;
}

.stepper-row button{
  width:18px;
  height:20px;
  flex:0 0 auto;
  background:var(--navy-3);
  border:1px solid var(--line);
  border-radius:5px;
  color:var(--gold-light);
  font-size:12px;
  font-weight:700;
  line-height:1;
  padding:0;
}

.stepper-row button:active{
  background:var(--gold);
  color:var(--navy);
}

.stepper-row input{
  flex:1 1 0;
  min-width:0;
  width:0;
  background:#fff;
  color:#111;
  border:1px solid var(--line);
  border-radius:5px;
  font-family:'JetBrains Mono',monospace;
  font-size:8px;
  padding:3px 0;
  text-align:center;
}

.stepper-row.all-axes .step-lbl{
  width:18px;
  font-size:7px;
  text-transform:uppercase;
}

.stepper-stack{
  display:flex;
  flex-direction:column;
  gap:4px;
  width:100%;
  padding:0 1px;
}

.action-col{
  display:flex;
  flex-direction:column;
  gap:4px;
  width:100%;
}

.action-col button{
  display:flex;
  flex-direction:row;
  align-items:center;
  gap:6px;
  background:var(--navy-3);
  border:1px solid var(--line);
  border-radius:8px;
  color:var(--ink);
  padding:7px 6px;
  width:100%;
}

.action-col button svg{
  width:15px;
  height:15px;
  color:var(--gold-light);
  flex:0 0 auto;
}

.action-col button span{
  font-size:9px;
  font-weight:600;
}

.action-col button.active{
  border-color:var(--gold);
  background:var(--navy-4);
}

.tile-row{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  justify-content:center;
  width:100%;
}

.swatch-row{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
  justify-content:center;
  width:100%;
}

#lockBtn,
#mmBtn,
#modeToggle{
  position:absolute;
  top:10px;
  z-index:6;
  height:36px;
  background:rgba(32,33,58,0.9);
  border:1px solid var(--line);
  border-radius:9px;
  color:var(--gold-light);
  display:flex;
  align-items:center;
  justify-content:center;
}

#modeToggle{
  left:10px;
  padding:3px;
  gap:3px;
}

#modeToggle button{
  height:100%;
  padding:0 10px;
  border-radius:6px;
  border:none;
  background:transparent;
  color:var(--muted);
  font-size:11px;
  font-weight:700;
}

#modeToggle button.toggle-active{
  background:#3a6fd8;
  color:#fff;
}

#mmBtn{
  left:118px;
  padding:0 9px;
  font-family:'JetBrains Mono',monospace;
  font-size:10.5px;
  font-weight:700;
  gap:5px;
}

#lockBtn{
  right:10px;
  width:36px;
}

#lockBtn svg{
  width:17px;
  height:17px;
}

#lockBtn.unlocked{
  color:var(--muted);
}

#mmBtn .seg{ opacity:0.4; }
#mmBtn .seg.on{ opacity:1; color:#fff; }
#mmBtn .sep{ opacity:0.3; }

#crosshairCursor{
  position:absolute;
  display:none;
  align-items:center;
  justify-content:center;
  width:40px;
  height:40px;
  pointer-events:none;
  z-index:7;
}

#crosshairCursor::before,
#crosshairCursor::after{
  content:'';
  position:absolute;
  background:#3a6fd8;
}

#crosshairCursor::before{
  width:100%;
  height:2px;
  top:19px;
}

#crosshairCursor::after{
  width:2px;
  height:100%;
  left:19px;
}

#confirmOverlay{
  position:absolute;
  inset:0;
  z-index:50;
  background:rgba(0,0,0,0.55);
  display:flex;
  align-items:center;
  justify-content:center;
}

#confirmOverlay.hidden{
  display:none;
}

.confirm-box{
  background:var(--navy-2);
  border:1px solid var(--line);
  border-radius:12px;
  padding:18px;
  width:78%;
  max-width:280px;
  text-align:center;
}

.confirm-box p{
  font-size:13px;
  color:var(--ink);
  margin:0 0 14px;
}

.confirm-row{
  display:flex;
  gap:10px;
}

.confirm-row button{
  flex:1;
  padding:10px;
  border-radius:8px;
  font-size:13px;
  font-weight:700;
  border:1px solid var(--line);
}

.confirm-yes{
  background:var(--danger);
  color:#fff;
  border-color:var(--danger);
}

.confirm-no{
  background:var(--navy-3);
  color:var(--ink);
}

#h2Title{
  white-space:normal !important;
  word-break:break-word;
}
`;

document.head.appendChild(style);


/* ─────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────── */

function svg(name){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||''}</svg>`;
}

Object.assign(ICONS, {
  lock:   '<rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
  unlock: '<rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8 10.5V7a4 4 0 0 1 7.5-2"/>',
  twod:   '<rect x="4" y="4" width="16" height="16" rx="2"/>',
  threed: '<path d="M12 2 3 7.5 12 12l9-4.5L12 2Z"/><path d="M3 7.5v9L12 21l9-4.5v-9"/>',
  pencil: '<path d="m14 4 6 6-11 11H3v-6L14 4Z"/><path d="m13.5 5.5 5 5"/>'
});


/* ─────────────────────────────────────────────────────────────
   THREE.JS SCENE
───────────────────────────────────────────────────────────── */

const canvas = document.getElementById('viewport3d');

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias:true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x1a1a2e, 1);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 5000);

const DEFAULT_CAM = new THREE.Vector3(90, 70, 110);
camera.position.copy(DEFAULT_CAM);

scene.add(new THREE.HemisphereLight(0xfff4e0, 0x14141f, 1.1));

const key = new THREE.DirectionalLight(0xffffff, 1.4);
key.position.set(60,90,40);
scene.add(key);

const fillL = new THREE.DirectionalLight(0xc8a96e, 0.35);
fillL.position.set(-60,30,-40);
scene.add(fillL);


const PLATE_SIZE = 100;
const GRID_SQUARE = 2.5;
const half = PLATE_SIZE / 2;

let shapeMode = '2d';


/* Grid */

const grid = new THREE.GridHelper(
  PLATE_SIZE,
  PLATE_SIZE / GRID_SQUARE,
  0xc8a96e,
  0x34355a
);

grid.material.transparent = true;
grid.material.opacity = 0.4;

scene.add(grid);


/* Plate border */

const borderGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-half,0,-half),
  new THREE.Vector3( half,0,-half),
  new THREE.Vector3( half,0, half),
  new THREE.Vector3(-half,0, half)
]);

const plateBorder = new THREE.LineLoop(
  borderGeometry,
  new THREE.LineBasicMaterial({ color:0xe0c48f })
);

scene.add(plateBorder);


/* Axis labels */

function makeLabelSprite(text, color, fontSize = 22){
  const cvs = document.createElement('canvas');
  cvs.width = 64;
  cvs.height = 32;

  const ctx = cvs.getContext('2d');

  ctx.fillStyle = color || '#e0c48f';
  ctx.font = `bold ${fontSize}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText(text, 32, 16);

  const spr = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map:new THREE.CanvasTexture(cvs),
      depthTest:false
    })
  );

  spr.scale.set(6,3,1);

  return spr;
}

const axisOrigin = new THREE.Vector3(-half-4, 0.1, -half-4);

const xArrow = new THREE.ArrowHelper(
  new THREE.Vector3(1,0,0),
  axisOrigin,
  18,
  0xd9534f,
  4,
  3
);

const zArrow = new THREE.ArrowHelper(
  new THREE.Vector3(0,0,1),
  axisOrigin,
  18,
  0x4a90d9,
  4,
  3
);

const yArrow = new THREE.ArrowHelper(
  new THREE.Vector3(0,1,0),
  axisOrigin,
  18,
  0x5cb85c,
  4,
  3
);

scene.add(xArrow);
scene.add(zArrow);
scene.add(yArrow);

const xLabel = makeLabelSprite('X', '#d9534f', 26);
const zLabel = makeLabelSprite('Z', '#4a90d9', 26);
const yLabel = makeLabelSprite('Y', '#5cb85c', 26);

xLabel.position.set(axisOrigin.x+10, axisOrigin.y, axisOrigin.z);
zLabel.position.set(axisOrigin.x, axisOrigin.y, axisOrigin.z+10);
yLabel.position.set(axisOrigin.x, axisOrigin.y+10, axisOrigin.z);

scene.add(xLabel);
scene.add(zLabel);
scene.add(yLabel);


/* ─────────────────────────────────────────────────────────────
   MM LABELS
───────────────────────────────────────────────────────────── */

let mmLabelGroup = null;

function buildMmLabels(step){
  if (mmLabelGroup) scene.remove(mmLabelGroup);

  mmLabelGroup = new THREE.Group();

  for (let v=0; v<=PLATE_SIZE; v+=step){

    if (shapeMode === '2d'){
      const sx = makeLabelSprite(String(v));
      sx.position.set(-half+v, -half-5, 0.2);
      mmLabelGroup.add(sx);

      const sy = makeLabelSprite(String(v));
      sy.position.set(-half-5, -half+v, 0.2);
      mmLabelGroup.add(sy);
    } else {
      const sx = makeLabelSprite(String(v));
      sx.position.set(-half+v, 0.2, half+5);
      mmLabelGroup.add(sx);

      const sz = makeLabelSprite(String(v));
      sz.position.set(-half-5, 0.2, -half+v);
      mmLabelGroup.add(sz);
    }
  }

  mmLabelGroup.visible = false;
  scene.add(mmLabelGroup);
}

buildMmLabels(5);

let mmState = 'off';

const mmBtn = document.createElement('button');
mmBtn.id = 'mmBtn';

document.getElementById('plate').appendChild(mmBtn);

function refreshMmBtn(){
  mmBtn.innerHTML =
    `<span class="seg ${mmState==='5'?'on':''}">5</span>` +
    `<span class="sep">|</span>` +
    `<span class="seg ${mmState==='2.5'?'on':''}">2.5</span>`;
}

mmBtn.addEventListener('click', () => {

  mmState =
    mmState==='off'
      ? '5'
      : mmState==='5'
        ? '2.5'
        : 'off';

  if (mmState==='off'){
    mmLabelGroup.visible = false;
  } else {
    buildMmLabels(mmState==='5' ? 5 : 2.5);
    mmLabelGroup.visible = true;
  }

  refreshMmBtn();
});

refreshMmBtn();


/* ─────────────────────────────────────────────────────────────
   2D / 3D MODE
───────────────────────────────────────────────────────────── */

const modeToggle = document.createElement('div');

modeToggle.id = 'modeToggle';

modeToggle.innerHTML =
  `<button data-m="2d">2D</button>` +
  `<button data-m="3d">3D</button>`;

document.getElementById('plate').appendChild(modeToggle);


const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.08;

controls.target.set(0,10,0);
controls.update();

let rotationLocked = true;

controls.enableRotate = false;


/* Mode-dependent drawing plane */

const dragGroundPlane = new THREE.Plane(
  new THREE.Vector3(0,1,0),
  0
);


function refreshModeScene(){

  if (shapeMode === '2d'){

    /*
      2D = X/Y plane.
      Z is removed from the working plane.
    */

    grid.rotation.set(Math.PI/2,0,0);
    grid.position.set(0,0,0);

    plateBorder.rotation.set(Math.PI/2,0,0);
    plateBorder.position.set(0,0,0.06);

    xArrow.position.set(-half-4,-half-4,0.1);
    xArrow.setDirection(new THREE.Vector3(1,0,0));

    yArrow.position.set(-half-4,-half-4,0.1);
    yArrow.setDirection(new THREE.Vector3(0,1,0));

    zArrow.visible = false;
    zLabel.visible = false;

    xLabel.position.set(-half-4+10,-half-4,0.1);
    yLabel.position.set(-half-4,-half-4+10,0.1);

    xLabel.visible = true;
    yLabel.visible = true;

    camera.position.set(0,0,140);
    camera.up.set(0,1,0);

    controls.target.set(0,0,0);
    controls.enableRotate = false;

    dragGroundPlane.set(
      new THREE.Vector3(0,0,1),
      0
    );

  } else {

    /*
      3D = X/Y/Z.
      The modeling plate remains X/Z with Y as height.
    */

    grid.rotation.set(0,0,0);
    grid.position.set(0,0,0);

    plateBorder.rotation.set(0,0,0);
    plateBorder.position.set(0,0.06,0);

    xArrow.position.copy(axisOrigin);
    xArrow.setDirection(new THREE.Vector3(1,0,0));

    zArrow.position.copy(axisOrigin);
    zArrow.setDirection(new THREE.Vector3(0,0,1));
    zArrow.visible = true;

    yArrow.position.copy(axisOrigin);
    yArrow.setDirection(new THREE.Vector3(0,1,0));

    xLabel.position.set(axisOrigin.x+10,axisOrigin.y,axisOrigin.z);
    zLabel.position.set(axisOrigin.x,axisOrigin.y,axisOrigin.z+10);
    yLabel.position.set(axisOrigin.x,axisOrigin.y+10,axisOrigin.z);

    xLabel.visible = true;
    yLabel.visible = true;
    zLabel.visible = true;

    camera.position.copy(DEFAULT_CAM);

    controls.target.set(0,10,0);
    controls.enableRotate = !rotationLocked;

    dragGroundPlane.set(
      new THREE.Vector3(0,1,0),
      0
    );
  }

  controls.update();

  if (mmState !== 'off'){
    buildMmLabels(mmState==='5' ? 5 : 2.5);
    mmLabelGroup.visible = true;
  }
}


function refreshModeToggle(){

  modeToggle.querySelectorAll('button').forEach(b => {
    b.classList.toggle(
      'toggle-active',
      b.dataset.m === shapeMode
    );
  });
}


function setShapeMode(mode){

  shapeMode = mode;

  refreshModeScene();
  refreshModeToggle();

  /*
    Re-render only the currently visible H3 content.
    Tools and Layers use the same tool set in either mode.
  */

  if (activeModule === 'tools'){
    renderDrawingToolsHome();
  } else if (activeModule === 'layers'){
    const s = activeShape();
    if (s) goToShape();
    else goToLayersHome();
  }
}


modeToggle.querySelectorAll('button').forEach(b => {
  b.addEventListener('click', () => {
    setShapeMode(b.dataset.m);
  });
});


const lockBtn = document.createElement('button');

lockBtn.id = 'lockBtn';

document.getElementById('plate').appendChild(lockBtn);


function refreshLockBtn(){
  lockBtn.innerHTML = svg(
    rotationLocked ? 'lock' : 'unlock'
  );

  lockBtn.classList.toggle(
    'unlocked',
    !rotationLocked
  );
}


lockBtn.addEventListener('click', () => {

  rotationLocked = !rotationLocked;

  controls.enableRotate =
    shapeMode === '3d' && !rotationLocked;

  refreshLockBtn();
});


refreshLockBtn();


function fitCanvas(){

  const rect =
    document.getElementById('plate').getBoundingClientRect();

  renderer.setSize(
    rect.width,
    rect.height,
    false
  );

  camera.aspect = rect.width / rect.height;

  camera.updateProjectionMatrix();
}


new ResizeObserver(fitCanvas)
  .observe(document.getElementById('plate'));

setTimeout(fitCanvas,30);


(function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene,camera);
})();


/* ─────────────────────────────────────────────────────────────
   DATA MODEL
───────────────────────────────────────────────────────────── */

const layers = [];

let nextLayerId = 1;
let activeLayerId = null;
let activeShapeId = null;

const GRAY = 0x777788;


function findLayer(id){
  return layers.find(l => l.id === id);
}


function activeLayer(){
  return findLayer(activeLayerId);
}


function activeShape(){
  const l = activeLayer();

  return l
    ? l.shapes.find(s => s.id === activeShapeId)
    : null;
}


function createLayer(){

  const l = {
    id:nextLayerId++,
    name:`Layer ${layers.length+1}`,
    shapes:[]
  };

  layers.push(l);

  return l;
}


function refreshShapeVisuals(){

  layers.forEach(l => {

    l.shapes.forEach(s => {

      const active =
        l.id === activeLayerId &&
        s.id === activeShapeId;

      if (s.mesh.material && s.mesh.material.color){
        s.mesh.material.color.set(
          active ? s.color : GRAY
        );
      }

      if (s.mesh.userData.outline){
        s.mesh.userData.outline.visible = !active;
      }
    });
  });
}


/* ─────────────────────────────────────────────────────────────
   GEOMETRY
───────────────────────────────────────────────────────────── */

function polygonGeometry(sides, radius){

  const shape = new THREE.Shape();

  for (let i=0; i<sides; i++){

    const a =
      Math.PI / 2 +
      (i / sides) * Math.PI * 2;

    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;

    if (i===0){
      shape.moveTo(x,y);
    } else {
      shape.lineTo(x,y);
    }
  }

  shape.closePath();

  return new THREE.ShapeGeometry(shape);
}


function buildGeometry(shapeId, fields){

  if (shapeMode === '2d'){

    if (shapeId === 'circle'){
      return new THREE.CircleGeometry(
        fields.D / 2,
        64
      );
    }

    if (shapeId === 'square'){
      return new THREE.PlaneGeometry(
        fields.W,
        fields.W
      );
    }

    if (shapeId === 'rectangle'){
      return new THREE.PlaneGeometry(
        fields.L,
        fields.H
      );
    }

    if (shapeId === 'triangle'){
      return polygonGeometry(
        3,
        fields.D / 2
      );
    }

    if (shapeId === 'octagon'){
      return polygonGeometry(
        8,
        fields.D / 2
      );
    }

    if (shapeId === 'oval'){
      const g = new THREE.CircleGeometry(
        fields.D / 2,
        64
      );

      g.scale(1,0.6,1);

      return g;
    }

    return new THREE.PlaneGeometry(30,30);
  }


  if (shapeId === 'circle')
    return new THREE.SphereGeometry(
      fields.D/2,
      32,
      24
    );

  if (shapeId === 'square')
    return new THREE.BoxGeometry(
      fields.W,
      fields.W,
      fields.W
    );

  if (shapeId === 'rectangle')
    return new THREE.BoxGeometry(
      fields.L,
      fields.H,
      fields.W
    );

  if (shapeId === 'cylinder')
    return new THREE.CylinderGeometry(
      fields.D/2,
      fields.D/2,
      fields.H,
      32
    );

  if (shapeId === 'cone')
    return new THREE.ConeGeometry(
      fields.D/2,
      fields.H,
      32
    );

  if (shapeId === 'triangle')
    return new THREE.CylinderGeometry(
      fields.D/2,
      fields.D/2,
      fields.H,
      3
    );

  if (shapeId === 'octagon')
    return new THREE.CylinderGeometry(
      fields.D/2,
      fields.D/2,
      fields.H,
      8
    );

  if (shapeId === 'oval'){
    const g = new THREE.SphereGeometry(
      fields.D/2,
      32,
      24
    );

    g.scale(1,0.6,1);

    return g;
  }

  return new THREE.BoxGeometry(30,30,30);
}


function clampToPlate(mesh, allowFloat){

  const geo = mesh.geometry;

  if (!geo.boundingBox){
    geo.computeBoundingBox();
  }

  const bb = geo.boundingBox;

  const rx =
    (bb.max.x-bb.min.x) *
    Math.abs(mesh.scale.x);

  const ry =
    (bb.max.y-bb.min.y) *
    Math.abs(mesh.scale.y);

  const rz =
    (bb.max.z-bb.min.z) *
    Math.abs(mesh.scale.z);


  if (rx > PLATE_SIZE){
    mesh.scale.x *= PLATE_SIZE / rx;
  }

  if (shapeMode === '2d'){

    if (ry > PLATE_SIZE){
      mesh.scale.y *= PLATE_SIZE / ry;
    }

    mesh.position.z = 0;

    const hx =
      (bb.max.x-bb.min.x) *
      Math.abs(mesh.scale.x) / 2;

    const hy =
      (bb.max.y-bb.min.y) *
      Math.abs(mesh.scale.y) / 2;

    mesh.position.x =
      THREE.MathUtils.clamp(
        mesh.position.x,
        -half+hx,
        half-hx
      );

    mesh.position.y =
      THREE.MathUtils.clamp(
        mesh.position.y,
        -half+hy,
        half-hy
      );

    return;
  }


  if (ry > PLATE_SIZE){
    mesh.scale.y *= PLATE_SIZE / ry;
  }

  if (rz > PLATE_SIZE){
    mesh.scale.z *= PLATE_SIZE / rz;
  }

  if (!allowFloat){
    mesh.position.y =
      -bb.min.y * mesh.scale.y;
  } else if (
    mesh.position.y <
    -bb.min.y * mesh.scale.y
  ){
    mesh.position.y =
      -bb.min.y * mesh.scale.y;
  }

  const hx =
    (bb.max.x-bb.min.x) *
    Math.abs(mesh.scale.x) / 2;

  const hz =
    (bb.max.z-bb.min.z) *
    Math.abs(mesh.scale.z) / 2;

  mesh.position.x =
    THREE.MathUtils.clamp(
      mesh.position.x,
      -half+hx,
      half-hx
    );

  mesh.position.z =
    THREE.MathUtils.clamp(
      mesh.position.z,
      -half+hz,
      half-hz
    );
}


function attachOutline(mesh){

  if (!mesh.isMesh) return;

  const edges =
    new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({
        color:0xffffff
      })
    );

  mesh.add(edges);

  mesh.userData.outline = edges;
}


function insertShape(layerId, shapeId, fields){

  const l = findLayer(layerId);

  const geo =
    buildGeometry(shapeId,fields);

  const color = SWATCHES[0];

  const material =
    new THREE.MeshStandardMaterial({
      color,
      metalness:0.15,
      roughness:0.55
    });

  const mesh =
    new THREE.Mesh(geo,material);

  mesh.position.set(0,0,0);

  clampToPlate(mesh,false);

  attachOutline(mesh);

  scene.add(mesh);

  const rec = {
    id:Date.now()+Math.random(),
    num:l.shapes.length+1,
    mesh,
    geomId:shapeId,
    fields:{...fields},
    color
  };

  l.shapes.push(rec);

  return rec;
}


function deleteShape(layerId, shapeId){

  const l = findLayer(layerId);

  if (!l) return;

  const idx =
    l.shapes.findIndex(
      s => s.id === shapeId
    );

  if (idx === -1) return;

  const s = l.shapes[idx];

  scene.remove(s.mesh);

  if (s.mesh.geometry){
    s.mesh.geometry.dispose();
  }

  if (s.mesh.material){
    if (Array.isArray(s.mesh.material)){
      s.mesh.material.forEach(m => m.dispose());
    } else {
      s.mesh.material.dispose();
    }
  }

  l.shapes.splice(idx,1);

  l.shapes.forEach((s2,i) => {
    s2.num = i+1;
  });

  if (activeShapeId === shapeId){
    activeShapeId = null;
  }
}


function deleteLayer(layerId){

  const l = findLayer(layerId);

  if (!l) return;

  l.shapes.forEach(s => {

    scene.remove(s.mesh);

    if (s.mesh.geometry){
      s.mesh.geometry.dispose();
    }

    if (s.mesh.material){
      if (Array.isArray(s.mesh.material)){
        s.mesh.material.forEach(m => m.dispose());
      } else {
        s.mesh.material.dispose();
      }
    }
  });

  layers.splice(
    layers.indexOf(l),
    1
  );

  layers.forEach((l2,i) => {
    l2.name = `Layer ${i+1}`;
  });

  if (activeLayerId === layerId){
    activeLayerId = null;
    activeShapeId = null;
  }
}


/* ─────────────────────────────────────────────────────────────
   SELECTION
───────────────────────────────────────────────────────────── */

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();


function trySelectAt(clientX,clientY){

  const rect =
    canvas.getBoundingClientRect();

  ndc.x =
    ((clientX-rect.left)/rect.width)*2-1;

  ndc.y =
    -((clientY-rect.top)/rect.height)*2+1;

  raycaster.setFromCamera(
    ndc,
    camera
  );

  const all = [];

  layers.forEach(l =>
    l.shapes.forEach(s =>
      all.push({l,s})
    )
  );

  const hits =
    raycaster.intersectObjects(
      all.map(x => x.s.mesh),
      false
    );

  if (hits.length){

    const hit =
      all.find(
        x => x.s.mesh === hits[0].object
      );

    activeLayerId = hit.l.id;
    activeShapeId = hit.s.id;

    refreshShapeVisuals();

    goToShape();

    return true;
  }

  return false;
}


canvas.addEventListener(
  'pointerup',
  e => {
    if (!crosshairActive){
      trySelectAt(
        e.clientX,
        e.clientY
      );
    }
  }
);


let crosshairActive = false;

const crosshairEl =
  document.createElement('div');

crosshairEl.id =
  'crosshairCursor';

document.getElementById('plate')
  .appendChild(crosshairEl);


function activateCrosshair(){

  crosshairActive = true;

  crosshairEl.style.display = 'flex';

  showToast(
    'Tap a shape on the plate to select it'
  );

  function move(e){

    const rect =
      canvas.getBoundingClientRect();

    crosshairEl.style.left =
      (e.clientX-rect.left-20)+'px';

    crosshairEl.style.top =
      (e.clientY-rect.top-20)+'px';
  }

  function up(e){

    const found =
      trySelectAt(
        e.clientX,
        e.clientY
      );

    if (found){
      deactivate();
    }
  }

  function deactivate(){

    crosshairActive = false;

    crosshairEl.style.display = 'none';

    canvas.removeEventListener(
      'pointermove',
      move
    );

    canvas.removeEventListener(
      'pointerup',
      up
    );
  }

  canvas.addEventListener(
    'pointermove',
    move
  );

  canvas.addEventListener(
    'pointerup',
    up
  );
}


function shapeLabel(s){

  if (!s || !s.geomId){
    return 'Shape';
  }

  return (
    s.geomId[0].toUpperCase() +
    s.geomId.slice(1) +
    ` #${s.num}`
  );
}


/* ─────────────────────────────────────────────────────────────
   MODULE / H1
───────────────────────────────────────────────────────────── */

const h1 =
  document.getElementById('h1');

const MODULE_ORDER = [
  'tools',
  'layers',
  'settings',
  'help'
];

const MODULE_OVERRIDE = {
  tools:{
    label:'Drawing Tools',
    icon:'pencil'
  }
};

let activeModule = 'tools';


function renderH1(){

  const mods =
    MODULE_ORDER
      .map(id =>
        MODULES.find(m => m.id===id)
      )
      .filter(Boolean);

  h1.innerHTML =
    mods.map(m => {

      const o =
        MODULE_OVERRIDE[m.id] || {};

      return `
        <button
          class="module-btn ${m.id===activeModule?'active-blue':''}"
          data-module="${m.id}">
          ${svg(o.icon || m.icon)}
          <span>${o.label || m.label}</span>
        </button>
      `;
    }).join('');


  h1.querySelectorAll(
    '[data-module]'
  ).forEach(btn => {

    btn.addEventListener(
      'click',
      () => {

        const id =
          btn.dataset.module;

        activeModule = id;

        if (id === 'layers'){
          goToLayersHome();
        }

        else if (id === 'tools'){
          goToDrawingTools();
        }

        else if (id === 'settings'){
          crumbs = ['Settings'];
          crumbBack = null;
          render('settings');
        }

        else if (id === 'help'){
          crumbs = ['Help'];
          crumbBack = null;
          render('help');
        }

        renderH1();
      }
    );
  });
}


/* ─────────────────────────────────────────────────────────────
   H2
───────────────────────────────────────────────────────────── */

const h2Title =
  document.getElementById('h2Title');

const h2Info =
  document.getElementById('h2Info');

const btnUndo =
  document.getElementById('btnUndo');

const btnRedo =
  document.getElementById('btnRedo');


btnUndo.innerHTML =
  svg('undo') + '<span>Undo</span>';

btnRedo.innerHTML =
  svg('redo') + '<span>Redo</span>';

btnUndo.disabled = true;
btnRedo.disabled = true;


let lastPlaced = null;


function armUndo(layerId,shapeId){

  lastPlaced = {
    layerId,
    shapeId
  };

  btnUndo.disabled = false;
}


btnUndo.addEventListener(
  'click',
  () => {

    if (!lastPlaced) return;

    deleteShape(
      lastPlaced.layerId,
      lastPlaced.shapeId
    );

    if (
      activeLayerId ===
      lastPlaced.layerId
    ){
      goToLayer();
    } else {
      goToLayersHome();
    }

    showToast('Shape removed');

    lastPlaced = null;

    btnUndo.disabled = true;
  }
);


let crumbs = ['Layer 1'];
let crumbBack = null;
let h2BackAttached = false;


function ensureH2Back(){

  if (h2BackAttached) return;

  const wrap =
    h2Title.parentElement.parentElement;

  const backBtn =
    document.createElement('button');

  backBtn.id = 'h2Back';

  backBtn.style.cssText =
    'background:none;border:none;color:var(--gold-light);width:26px;height:26px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;';

  backBtn.innerHTML =
    svg('back');

  backBtn.addEventListener(
    'click',
    () => {
      if (crumbBack){
        crumbBack();
      }
    }
  );

  wrap.insertBefore(
    backBtn,
    wrap.firstChild
  );

  h2BackAttached = true;
}


ensureH2Back();


function setH2(info){

  document.getElementById(
    'h2Back'
  ).style.display =
    crumbBack ? 'flex' : 'none';

  h2Title.textContent =
    crumbs.join(' - ');

  h2Info.textContent =
    info || '';
}


const menuScroll =
  document.getElementById('menuScroll');

const slideMenu =
  document.getElementById('slideMenu');

const expandTabEl =
  document.getElementById('expandTab');

if (expandTabEl){
  expandTabEl.remove();
}


/* ─────────────────────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────────────────────── */

function goToLayersHome(){

  activeModule = 'layers';

  const l = activeLayer();

  crumbs = [
    l ? l.name : 'Layers'
  ];

  crumbBack = null;

  activeShapeId = null;

  render('layersHome');

  renderH1();
}


function goToLayer(){

  activeModule = 'layers';

  const l = activeLayer();

  if (!l){
    goToLayersHome();
    return;
  }

  crumbs = [l.name];

  crumbBack = () => {

    activeLayerId = null;

    goToLayersHome();
  };

  render('layersHome');

  renderH1();
}


function goToShape(){

  activeModule = 'layers';

  const l = activeLayer();
  const s = activeShape();

  if (!l || !s){
    goToLayersHome();
    return;
  }

  crumbs = [
    l.name,
    shapeLabel(s)
  ];

  crumbBack = () => {

    activeShapeId = null;

    goToLayer();
  };

  render(
    'shapePanel',
    'color'
  );

  renderH1();
}


function goToSubtool(toolLabel){

  const l = activeLayer();
  const s = activeShape();

  crumbs = [
    l.name,
    shapeLabel(s),
    toolLabel
  ];

  crumbBack = () => {
    goToShape();
  };

  render(
    'shapePanel',
    toolLabel.toLowerCase()
  );
}


function goToDrawingTools(){

  activeModule = 'tools';

  crumbs = ['Drawing Tools'];

  crumbBack = null;

  render('drawingToolsHome');

  renderH1();
}


function goToP2POptions(){

  crumbs = [
    'Drawing Tools',
    'P2P'
  ];

  crumbBack = () =>
    goToDrawingTools();

  render('p2pHome');
}


function goToP2PShapePick(){

  crumbs = [
    'Drawing Tools',
    'P2P',
    'Shape'
  ];

  crumbBack = () =>
    goToP2POptions();

  render('p2pShapePick');
}


function goToP2PFillPick(shapeKey){

  crumbs = [
    'Drawing Tools',
    'P2P',
    'Shape',
    shapeKey[0].toUpperCase() +
    shapeKey.slice(1)
  ];

  crumbBack = () =>
    goToP2PShapePick();

  render(
    'p2pFillPick',
    shapeKey
  );
}


/* ─────────────────────────────────────────────────────────────
   RENDER
───────────────────────────────────────────────────────────── */

function render(view,subtool){

  slideMenu.classList.add('open');

  if (view==='layersHome')
    renderLayersHome();

  else if (view==='shapePanel')
    renderShapePanel(subtool);

  else if (view==='drawingToolsHome')
    renderDrawingToolsHome();

  else if (view==='p2pHome')
    renderP2PHome();

  else if (view==='p2pShapePick')
    renderP2PShapePick();

  else if (view==='p2pFillPick')
    renderP2PFillPick(subtool);

  else if (view==='p2pLineOptions')
    renderP2PLineOptions();

  else if (view==='p2pShapeOptions')
    renderP2PShapeOptions();

  else if (view==='booleanPick')
    renderBooleanPick();

  else if (view==='settings')
    renderSettings();

  else if (view==='help')
    renderHelp();

  else if (view==='drawMethod')
    renderDrawMethod(subtool);

  else if (view==='drawShapePick')
    renderDrawShapePick(subtool);

  else if (view==='drawDivisionPick')
    renderDrawDivisionPick(
      subtool.method,
      subtool.shapeKey
    );
}


/* ─────────────────────────────────────────────────────────────
   LAYERS HOME
───────────────────────────────────────────────────────────── */

function renderLayersHome(){

  if (!layers.length){

    const l = createLayer();

    activeLayerId = l.id;
  }

  const active =
    activeLayer();

  setH2(
    active
      ? `${active.name} : ${active.shapes.length} shapes`
      : 'Tap Add Layer for a layer'
  );

  refreshModeToggle();


  const activeTile =
    active
      ? `
        <div
          class="tile3 layer-active"
          data-layer="${active.id}">
          ${svg('layers')}
          <span>${active.name}</span>
          <button
            class="tile-del"
            data-del="${active.id}">
            ${svg('trash')}
          </button>
        </div>
      `
      : '';


  const otherLayers =
    layers
      .filter(l =>
        !active ||
        l.id !== active.id
      )
      .map(l => `
        <div
          class="tile3"
          data-layer="${l.id}">
          ${svg('layers')}
          <span>${l.name}</span>
          <button
            class="tile-del"
            data-del="${l.id}">
            ${svg('trash')}
          </button>
        </div>
      `)
      .join('');


  const addLayer =
    `<button
      class="add-rect"
      id="addLayerTile">
      ${svg('add')}Add Layer +
    </button>`;


  let shapeTiles = '';

  if (
    active &&
    active.shapes.length
  ){

    shapeTiles =
      active.shapes.map(s => `
        <div
          class="tile3"
          data-shape="${s.id}">
          ${svg('shapes')}
          <span>${s.geomId}</span>
          <span class="tile-num">${s.num}</span>
        </div>
      `).join('');
  }


  menuScroll.innerHTML = `
    <div class="h3-stack">

      ${activeTile}

      ${addLayer}

      ${
        otherLayers
          ? `<div class="tile-row">${otherLayers}</div>`
          : ''
      }

      ${
        shapeTiles
          ? `<div class="tile-row">${shapeTiles}</div>`
          : ''
      }

    </div>
  `;


  document
    .getElementById('addLayerTile')
    .addEventListener(
      'click',
      () => {

        const l =
          createLayer();

        activeLayerId = l.id;
        activeShapeId = null;

        goToLayer();
      }
    );


  menuScroll
    .querySelectorAll('[data-layer]')
    .forEach(el => {

      el.addEventListener(
        'click',
        e => {

          if (
            e.target.closest(
              '[data-del]'
            )
          ){
            return;
          }

          const id =
            parseInt(
              el.dataset.layer,
              10
            );

          if (
            activeLayerId === id
          ){
            return;
          }

          activeLayerId = id;
          activeShapeId = null;

          refreshShapeVisuals();

          goToLayer();
        }
      );
    });


  menuScroll
    .querySelectorAll('[data-shape]')
    .forEach(el => {

      el.addEventListener(
        'click',
        () => {

          activeShapeId =
            parseFloat(
              el.dataset.shape
            );

          refreshShapeVisuals();

          goToShape();
        }
      );
    });


  wireLayerDelete();
}


/* ─────────────────────────────────────────────────────────────
   DRAWING TOOLS
───────────────────────────────────────────────────────────── */

const DRAW_METHOD_LABEL = {
  freehand:'Freehand',
  shapedrag:'Shape',
  p2p:'P2P'
};


function renderDrawingToolsHome(){

  if (!layers.length){

    const l = createLayer();

    activeLayerId = l.id;
  }

  const active =
    activeLayer();


  setH2(
    'Pick a drawing method'
  );


  const activeLayerTile = `
    <div
      class="tile3 layer-active"
      data-tool-layer="${active.id}">
      ${svg('layers')}
      <span>${active.name}</span>

      <button
        class="tile-del"
        data-del-tool="${active.id}">
        ${svg('trash')}
      </button>
    </div>
  `;


  menuScroll.innerHTML = `
    <div class="h3-stack">

      ${activeLayerTile}

      <div class="tile-row">

        <div
          class="tile3"
          data-dt="freehand">
          ${svg('shapes')}
          <span>Freehand</span>
        </div>

        <div
          class="tile3"
          data-dt="shapedrag">
          ${svg('shapes')}
          <span>Shape</span>
        </div>

        <div
          class="tile3"
          data-dt="p2p">
          ${svg('shapes')}
          <span>P2P</span>
        </div>

      </div>

    </div>
  `;


  menuScroll
    .querySelector(
      '[data-tool-layer]'
    )
    .addEventListener(
      'click',
      e => {

        if (
          e.target.closest(
            '[data-del-tool]'
          )
        ){
          return;
        }

        goToLayer();
      }
    );


  menuScroll
    .querySelector(
      '[data-dt="freehand"]'
    )
    .addEventListener(
      'click',
      () => {

        crumbs = [
          'Drawing Tools',
          'Freehand'
        ];

        crumbBack = () =>
          goToDrawingTools();

        startFreehand();
      }
    );


  menuScroll
    .querySelector(
      '[data-dt="shapedrag"]'
    )
    .addEventListener(
      'click',
      () => {

        if (!activeLayer()){

          const l =
            createLayer();

          activeLayerId = l.id;
        }

        crumbs = [
          'Drawing Tools',
          'Shape'
        ];

        crumbBack = () =>
          goToDrawingTools();

        render(
          'drawShapePick',
          'shapedrag'
        );
      }
    );


  menuScroll
    .querySelector(
      '[data-dt="p2p"]'
    )
    .addEventListener(
      'click',
      goToP2POptions
    );
}


/* ─────────────────────────────────────────────────────────────
   DRAW METHOD
───────────────────────────────────────────────────────────── */

const DIVISIONS = {
  circle:[
    ['full','Full'],
    ['half','Half'],
    ['quarter','Quarter']
  ],

  square:[
    ['full','Full'],
    ['quarter','Quarter']
  ],

  rectangle:[
    ['full','Full'],
    ['eighth','Eighth']
  ],

  triangle:[
    ['full','Full'],
    ['half','Half']
  ],

  octagon:[
    ['full','Full'],
    ['quarter','Quarter']
  ],

  oval:[
    ['full','Full'],
    ['half','Half']
  ]
};


const LINE_TYPES = [
  ['straight','Straight'],
  ['arc','Arc'],
  ['wave','Wave']
];


function goToDrawMethod(method){

  const l =
    activeLayer();

  crumbs = [
    'Layers',
    l.name,
    DRAW_METHOD_LABEL[method]
  ];

  crumbBack = () =>
    goToLayer();

  render(
    'drawMethod',
    method
  );
}


function goToDrawShapePick(method){

  const l =
    activeLayer();

  crumbs = [
    'Layers',
    l.name,
    DRAW_METHOD_LABEL[method]
  ];

  crumbBack = () =>
    goToDrawMethod(method);

  render(
    'drawShapePick',
    method
  );
}


function goToDrawDivisionPick(
  method,
  shapeKey
){

  const l =
    activeLayer();

  crumbs = [
    'Layers',
    l.name,
    DRAW_METHOD_LABEL[method],
    shapeKey[0].toUpperCase() +
    shapeKey.slice(1)
  ];

  crumbBack = () =>
    goToDrawShapePick(method);

  render(
    'drawDivisionPick',
    {
      method,
      shapeKey
    }
  );
}


function renderDrawMethod(method){

  if (method === 'freehand'){

    crumbs = [
      'Drawing Tools',
      'Freehand'
    ];

    crumbBack = () =>
      goToDrawingTools();

    startFreehand();

    return;
  }


  if (method === 'p2p'){

    goToP2POptions();

    return;
  }


  goToDrawShapePick(method);
}


function renderDrawShapePick(method){

  setH2(
    'Pick a shape to divide, or use it whole'
  );

  menuScroll.innerHTML = `
    <div class="tile-row">
      ${
        Object.keys(DIVISIONS)
          .map(k => `
            <div
              class="tile3"
              data-dshape="${k}">
              ${svg('shapes')}
              <span>
                ${
                  k[0].toUpperCase() +
                  k.slice(1)
                }
              </span>
            </div>
          `)
          .join('')
      }
    </div>
  `;


  menuScroll
    .querySelectorAll(
      '[data-dshape]'
    )
    .forEach(el => {

      el.addEventListener(
        'click',
        () =>
          goToDrawDivisionPick(
            method,
            el.dataset.dshape
          )
      );
    });
}


function renderDrawDivisionPick(
  method,
  shapeKey
){

  setH2(
    'Press and drag on the plate to size it'
  );

  const divs =
    DIVISIONS[shapeKey] ||
    [['full','Full']];


  menuScroll.innerHTML = `
    <div class="tile-row">
      ${
        divs.map(
          ([id,label]) => `
            <div
              class="tile3"
              data-div="${id}">
              ${svg('shapes')}
              <span>${label}</span>
            </div>
          `
        ).join('')
      }
    </div>
  `;


  menuScroll
    .querySelectorAll('[data-div]')
    .forEach(el => {

      el.addEventListener(
        'click',
        () => {

          if (
            el.dataset.div !== 'full'
          ){

            showToast(
              `${shapeKey} (${el.dataset.div}) is not wired yet. Use Full.`
            );

            return;
          }

          startDragToSize(shapeKey);
        }
      );
    });
}


/* ─────────────────────────────────────────────────────────────
   SHAPE DRAG
───────────────────────────────────────────────────────────── */

function plateHit(clientX,clientY){

  const rect =
    canvas.getBoundingClientRect();

  ndc.x =
    ((clientX-rect.left)/rect.width)*2-1;

  ndc.y =
    -((clientY-rect.top)/rect.height)*2+1;

  raycaster.setFromCamera(
    ndc,
    camera
  );

  const pt =
    new THREE.Vector3();

  raycaster.ray.intersectPlane(
    dragGroundPlane,
    pt
  );

  return pt;
}


function buildDragGeometry(
  shapeKey,
  sizeMM
){

  const H = 15;


  if (shapeMode === '2d'){

    if (shapeKey === 'circle'){
      return new THREE.CircleGeometry(
        sizeMM/2,
        64
      );
    }

    if (shapeKey === 'square'){
      return new THREE.PlaneGeometry(
        sizeMM,
        sizeMM
      );
    }

    if (shapeKey === 'rectangle'){
      return new THREE.PlaneGeometry(
        sizeMM,
        sizeMM*0.5
      );
    }

    if (shapeKey === 'triangle'){
      return polygonGeometry(
        3,
        sizeMM/2
      );
    }

    if (shapeKey === 'octagon'){
      return polygonGeometry(
        8,
        sizeMM/2
      );
    }

    if (shapeKey === 'oval'){

      const g =
        new THREE.CircleGeometry(
          sizeMM/2,
          64
        );

      g.scale(1,0.6,1);

      return g;
    }

    return new THREE.PlaneGeometry(
      sizeMM,
      sizeMM
    );
  }


  if (shapeKey === 'circle')
    return new THREE.SphereGeometry(
      sizeMM/2,
      32,
      24
    );

  if (shapeKey === 'square')
    return new THREE.BoxGeometry(
      sizeMM,
      sizeMM,
      sizeMM
    );

  if (shapeKey === 'rectangle')
    return new THREE.BoxGeometry(
      sizeMM,
      H,
      sizeMM*0.5
    );

  if (shapeKey === 'triangle')
    return new THREE.CylinderGeometry(
      sizeMM/2,
      sizeMM/2,
      H,
      3
    );

  if (shapeKey === 'octagon')
    return new THREE.CylinderGeometry(
      sizeMM/2,
      sizeMM/2,
      H,
      8
    );

  if (shapeKey === 'oval'){

    const g =
      new THREE.SphereGeometry(
        sizeMM/2,
        32,
        24
      );

    g.scale(1,0.6,1);

    return g;
  }

  return new THREE.BoxGeometry(
    sizeMM,
    H,
    sizeMM
  );
}


function startDragToSize(shapeKey){

  setH2(
    'Press on the plate, drag out to size, release to place'
  );

  menuScroll.innerHTML = `
    <div
      style="padding:14px 6px;color:var(--muted);font-size:11px;text-align:center;max-width:220px;">
      Dragging on the plate now sizes the ${shapeKey}...
    </div>
  `;


  let startPt = null;
  let previewMesh = null;


  function onDown(e){

    startPt =
      plateHit(
        e.clientX,
        e.clientY
      );

    rotationLocked = true;

    controls.enableRotate = false;

    refreshLockBtn();
  }


  function onMove(e){

    if (!startPt) return;

    const cur =
      plateHit(
        e.clientX,
        e.clientY
      );

    const size =
      Math.max(
        GRID_SQUARE,
        startPt.distanceTo(cur)
      );


    if (previewMesh){

      scene.remove(previewMesh);

      previewMesh.geometry.dispose();

      if (previewMesh.material){
        previewMesh.material.dispose();
      }
    }


    previewMesh =
      new THREE.Mesh(
        buildDragGeometry(
          shapeKey,
          size
        ),
        new THREE.MeshStandardMaterial({
          color:0xe0c48f,
          transparent:true,
          opacity:0.55
        })
      );


    if (shapeMode === '2d'){

      previewMesh.position.set(
        (startPt.x+cur.x)/2,
        (startPt.y+cur.y)/2,
        0
      );

    } else {

      previewMesh.position.set(
        (startPt.x+cur.x)/2,
        0,
        (startPt.z+cur.z)/2
      );
    }


    clampToPlate(
      previewMesh,
      false
    );

    scene.add(previewMesh);
  }


  function onUp(e){

    if (!startPt){
      cleanup();
      return;
    }


    const cur =
      plateHit(
        e.clientX,
        e.clientY
      );


    let size =
      Math.max(
        GRID_SQUARE,
        startPt.distanceTo(cur)
      );


    size =
      Math.round(
        size / GRID_SQUARE
      ) * GRID_SQUARE;


    if (previewMesh){

      scene.remove(previewMesh);

      previewMesh.geometry.dispose();

      if (previewMesh.material){
        previewMesh.material.dispose();
      }

      previewMesh = null;
    }


    const active =
      activeLayer();

    if (!active){
      cleanup();
      return;
    }


    const mesh =
      new THREE.Mesh(
        buildDragGeometry(
          shapeKey,
          size
        ),
        new THREE.MeshStandardMaterial({
          color:SWATCHES[0],
          metalness:0.15,
          roughness:0.55
        })
      );


    if (shapeMode === '2d'){

      mesh.position.set(
        (startPt.x+cur.x)/2,
        (startPt.y+cur.y)/2,
        0
      );

    } else {

      mesh.position.set(
        (startPt.x+cur.x)/2,
        0,
        (startPt.z+cur.z)/2
      );
    }


    clampToPlate(
      mesh,
      false
    );

    attachOutline(mesh);

    scene.add(mesh);


    const rec = {
      id:Date.now()+Math.random(),
      num:active.shapes.length+1,
      mesh,
      geomId:shapeKey,
      fields:{size},
      color:SWATCHES[0]
    };


    active.shapes.push(rec);

    activeShapeId = rec.id;

    armUndo(
      active.id,
      rec.id
    );

    refreshShapeVisuals();

    showToast(
      `${shapeKey} placed at ${size}mm`
    );

    cleanup();

    goToShape();
  }


  function cleanup(){

    canvas.removeEventListener(
      'pointerdown',
      onDown
    );

    canvas.removeEventListener(
      'pointermove',
      onMove
    );

    canvas.removeEventListener(
      'pointerup',
      onUp
    );
  }


  canvas.addEventListener(
    'pointerdown',
    onDown
  );

  canvas.addEventListener(
    'pointermove',
    onMove
  );

  canvas.addEventListener(
    'pointerup',
    onUp
  );
}


/* ─────────────────────────────────────────────────────────────
   FREEHAND
───────────────────────────────────────────────────────────── */

function startFreehand(){

  setH2(
    'Press and hold on the grid, draw, then release'
  );

  menuScroll.innerHTML = `
    <div
      style="padding:14px 6px;color:var(--muted);font-size:11px;text-align:center;max-width:220px;">
      Draw directly on the plate with one finger.
    </div>
  `;


  let drawing = false;
  let points = [];


  function getPoint(e){

    const p =
      plateHit(
        e.clientX,
        e.clientY
      );

    if (!p) return null;

    if (shapeMode === '2d'){
      p.z = 0;
    } else {
      p.y = 0;
    }

    return p;
  }


  function onDown(e){

    const p =
      getPoint(e);

    if (!p) return;

    drawing = true;

    points = [p];

    rotationLocked = true;

    controls.enableRotate = false;

    refreshLockBtn();
  }


  function onMove(e){

    if (!drawing) return;

    const p =
      getPoint(e);

    if (!p) return;

    const last =
      points[points.length-1];

    if (
      last &&
      last.distanceTo(p) < 0.8
    ){
      return;
    }

    points.push(p);
  }


  function onUp(){

    if (!drawing){
      cleanup();
      return;
    }

    drawing = false;

    if (points.length < 2){

      cleanup();

      showToast(
        'Draw a longer path'
      );

      return;
    }


    const active =
      activeLayer();

    if (!active){
      cleanup();
      return;
    }


    let mesh;


    if (shapeMode === '2d'){

      const geo =
        new THREE.BufferGeometry()
          .setFromPoints(points);

      const material =
        new THREE.LineBasicMaterial({
          color:SWATCHES[0],
          linewidth:1
        });

      mesh =
        new THREE.Line(
          geo,
          material
        );

    } else {

      const curve =
        new THREE.CatmullRomCurve3(
          points
        );

      const segments =
        Math.max(
          8,
          points.length * 2
        );

      const geo =
        new THREE.TubeGeometry(
          curve,
          segments,
          0.8,
          8,
          false
        );

      const material =
        new THREE.MeshStandardMaterial({
          color:SWATCHES[0],
          metalness:0.15,
          roughness:0.55
        });

      mesh =
        new THREE.Mesh(
          geo,
          material
        );

      attachOutline(mesh);
    }


    scene.add(mesh);


    const rec = {
      id:Date.now()+Math.random(),
      num:active.shapes.length+1,
      mesh,
      geomId:'freehand',
      fields:{
        points:points.map(p =>
          p.toArray()
        )
      },
      color:SWATCHES[0]
    };


    active.shapes.push(rec);

    activeShapeId = rec.id;

    armUndo(
      active.id,
      rec.id
    );

    refreshShapeVisuals();

    showToast(
      'Freehand shape placed'
    );

    cleanup();

    goToShape();
  }


  function cleanup(){

    canvas.removeEventListener(
      'pointerdown',
      onDown
    );

    canvas.removeEventListener(
      'pointermove',
      onMove
    );

    canvas.removeEventListener(
      'pointerup',
      onUp
    );
  }


  canvas.addEventListener(
    'pointerdown',
    onDown
  );

  canvas.addEventListener(
    'pointermove',
    onMove
  );

  canvas.addEventListener(
    'pointerup',
    onUp
  );
}


/* ─────────────────────────────────────────────────────────────
   P2P
───────────────────────────────────────────────────────────── */

const P2P_SHAPES = [
  'rectangle',
  'square',
  'circle',
  'triangle',
  'octagon',
  'oval'
];


let pendingP2P = null;


function renderP2PHome(){

  setH2(
    'Place two points, then choose what to create'
  );

  menuScroll.innerHTML = `
    <div class="tile-row">

      <div
        class="tile3"
        data-p2p="line">
        ${svg('shapes')}
        <span>Line</span>
      </div>

      <div
        class="tile3"
        data-p2p="shape">
        ${svg('shapes')}
        <span>Shape</span>
      </div>

    </div>
  `;


  menuScroll
    .querySelector(
      '[data-p2p="line"]'
    )
    .addEventListener(
      'click',
      startP2PLineCapture
    );


  menuScroll
    .querySelector(
      '[data-p2p="shape"]'
    )
    .addEventListener(
      'click',
      startP2PShapeCapture
    );
}


function startP2PLineCapture(){

  crumbs = [
    'Drawing Tools',
    'P2P',
    'Line'
  ];

  crumbBack = () =>
    goToP2POptions();

  pendingP2P = {
    type:'line',
    points:[]
  };

  startP2PPointCapture();
}


function startP2PShapeCapture(){

  crumbs = [
    'Drawing Tools',
    'P2P',
    'Shape'
  ];

  crumbBack = () =>
    goToP2POptions();

  pendingP2P = {
    type:'shape',
    points:[]
  };

  startP2PPointCapture();
}


function startP2PPointCapture(){

  setH2(
    'Tap the first point, then the second point'
  );

  menuScroll.innerHTML = `
    <div
      style="padding:14px 6px;color:var(--muted);font-size:11px;text-align:center;max-width:220px;">
      ${
        pendingP2P &&
        pendingP2P.type === 'line'
          ? 'Place two endpoints.'
          : 'Place two opposite corners.'
      }
    </div>
  `;


  let pointCount =
    pendingP2P.points.length;


  function onUp(e){

    const p =
      plateHit(
        e.clientX,
        e.clientY
      );

    if (!p) return;


    const point =
      p.clone();


    if (shapeMode === '2d'){
      point.z = 0;
    } else {
      point.y = 0;
    }


    pendingP2P.points.push(point);

    pointCount++;


    if (pointCount >= 2){

      cleanup();

      if (
        pendingP2P.type === 'line'
      ){
        render(
          'p2pLineOptions'
        );
      } else {
        render(
          'p2pShapeOptions'
        );
      }

      return;
    }


    setH2(
      'First point placed — tap the second point'
    );
  }


  function cleanup(){

    canvas.removeEventListener(
      'pointerup',
      onUp
    );
  }


  canvas.addEventListener(
    'pointerup',
    onUp
  );
}


/* P2P line options */

function renderP2PLineOptions(){

  setH2(
    'Choose how the two points connect'
  );

  menuScroll.innerHTML = `
    <div class="tile-row">
      ${
        LINE_TYPES.map(
          ([id,label]) => `
            <div
              class="tile3"
              data-line="${id}">
              ${svg('shapes')}
              <span>${label}</span>
            </div>
          `
        ).join('')
      }
    </div>
  `;


  menuScroll
    .querySelectorAll('[data-line]')
    .forEach(el => {

      el.addEventListener(
        'click',
        () => {

          createP2PLine(
            el.dataset.line
          );
        }
      );
    });
}


/* P2P shape options */

function renderP2PShapeOptions(){

  setH2(
    'Choose the shape between the two points'
  );

  menuScroll.innerHTML = `
    <div class="tile-row">
      ${
        P2P_SHAPES.map(
          k => `
            <div
              class="tile3"
              data-pshape="${k}">
              ${svg('shapes')}
              <span>
                ${
                  k[0].toUpperCase() +
                  k.slice(1)
                }
              </span>
            </div>
          `
        ).join('')
      }
    </div>
  `;


  menuScroll
    .querySelectorAll('[data-pshape]')
    .forEach(el => {

      el.addEventListener(
        'click',
        () => {

          goToP2PFillPick(
            el.dataset.pshape
          );
        }
      );
    });
}


function renderP2PShapePick(){

  renderP2PShapeOptions();
}


function renderP2PFillPick(shapeKey){

  setH2(
    'Filled or hollow'
  );

  menuScroll.innerHTML = `
    <div class="tile-row">

      <div
        class="tile3"
        data-fill="filled">
        ${svg('shapes')}
        <span>Filled</span>
      </div>

      <div
        class="tile3"
        data-fill="hollow">
        ${svg('shapes')}
        <span>Hollow</span>
      </div>

    </div>
  `;


  menuScroll
    .querySelectorAll('[data-fill]')
    .forEach(el => {

      el.addEventListener(
        'click',
        () => {

          createP2PShape(
            shapeKey,
            el.dataset.fill === 'hollow'
          );
        }
      );
    });
}


function makeP2PCurve(
  p1,
  p2,
  type
){

  const points = [];

  if (type === 'straight'){

    points.push(
      p1.clone(),
      p2.clone()
    );

  } else {

    const dx =
      p2.x-p1.x;

    const dz =
      p2.z-p1.z;

    const dy =
      p2.y-p1.y;


    let length;

    if (shapeMode === '2d'){
      length =
        Math.sqrt(
          dx*dx +
          dy*dy
        );
    } else {
      length =
        Math.sqrt(
          dx*dx +
          dz*dz
        );
    }


    if (length < 0.001){
      return null;
    }


    if (shapeMode === '2d'){

      const nx =
        -dy / length;

      const ny =
        dx / length;

      const offset =
        Math.min(
          15,
          Math.max(
            5,
            length*0.25
          )
        );


      if (type === 'arc'){

        const mid =
          p1.clone()
            .lerp(p2,0.5);

        mid.x += nx*offset;
        mid.y += ny*offset;

        return new THREE.QuadraticBezierCurve3(
          p1,
          mid,
          p2
        );
      }


      for (let i=0; i<=24; i++){

        const t = i/24;

        const base =
          p1.clone().lerp(p2,t);

        const wave =
          Math.sin(
            t*Math.PI*4
          ) *
          Math.min(
            5,
            Math.max(
              2,
              length*0.08
            )
          );

        base.x += nx*wave;
        base.y += ny*wave;

        points.push(base);
      }

      return new THREE.CatmullRomCurve3(
        points
      );
    }


    const nx =
      -dz / length;

    const nz =
      dx / length;

    const offset =
      Math.min(
        15,
        Math.max(
          5,
          length*0.25
        )
      );


    if (type === 'arc'){

      const mid =
        p1.clone()
          .lerp(p2,0.5);

      mid.x += nx*offset;
      mid.z += nz*offset;

      return new THREE.QuadraticBezierCurve3(
        p1,
        mid,
        p2
      );
    }


    for (let i=0; i<=24; i++){

      const t = i/24;

      const base =
        p1.clone().lerp(p2,t);

      const wave =
        Math.sin(
          t*Math.PI*4
        ) *
        Math.min(
          5,
          Math.max(
            2,
            length*0.08
          )
        );

      base.x += nx*wave;
      base.z += nz*wave;

      points.push(base);
    }

    return new THREE.CatmullRomCurve3(
      points
    );
  }


  return new THREE.LineCurve3(
    p1,
    p2
  );
}


function createP2PLine(type){

  if (
    !pendingP2P ||
    pendingP2P.points.length < 2
  ){
    return;
  }


  const p1 =
    pendingP2P.points[0];

  const p2 =
    pendingP2P.points[1];


  const curve =
    makeP2PCurve(
      p1,
      p2,
      type
    );


  if (!curve){
    return;
  }


  const active =
    activeLayer();

  if (!active){
    return;
  }


  let mesh;


  if (shapeMode === '2d'){

    const points =
      curve.getPoints(
        type === 'straight'
          ? 1
          : 32
      );

    const geo =
      new THREE.BufferGeometry()
        .setFromPoints(points);

    const material =
      new THREE.LineBasicMaterial({
        color:SWATCHES[0]
      });

    mesh =
      new THREE.Line(
        geo,
        material
      );

  } else {

    const geo =
      new THREE.TubeGeometry(
        curve,
        type === 'straight'
          ? 1
          : 32,
        0.8,
        8,
        false
      );

    const material =
      new THREE.MeshStandardMaterial({
        color:SWATCHES[0],
        metalness:0.15,
        roughness:0.55
      });

    mesh =
      new THREE.Mesh(
        geo,
        material
      );

    attachOutline(mesh);
  }


  scene.add(mesh);


  const rec = {
    id:Date.now()+Math.random(),
    num:active.shapes.length+1,
    mesh,
    geomId:`p2p-${type}`,
    fields:{
      points:[
        p1.toArray(),
        p2.toArray()
      ]
    },
    color:SWATCHES[0]
  };


  active.shapes.push(rec);

  activeShapeId = rec.id;

  armUndo(
    active.id,
    rec.id
  );

  refreshShapeVisuals();

  pendingP2P = null;

  showToast(
    `${type[0].toUpperCase()+type.slice(1)} line created`
  );

  goToShape();
}


async function createP2PShape(
  shapeKey,
  hollow
){

  if (
    !pendingP2P ||
    pendingP2P.points.length < 2
  ){
    return;
  }


  if (!activeLayer()){

    const l =
      createLayer();

    activeLayerId = l.id;
  }


  const active =
    activeLayer();


  const p1 =
    pendingP2P.points[0];

  const p2 =
    pendingP2P.points[1];


  const SIZE =
    Math.max(
      GRID_SQUARE,
      p1.distanceTo(p2)
    );


  let outerGeo;


  if (shapeMode === '2d'){

    const width =
      Math.max(
        GRID_SQUARE,
        Math.abs(p2.x-p1.x)
      );

    const height =
      Math.max(
        GRID_SQUARE,
        Math.abs(p2.y-p1.y)
      );


    if (shapeKey === 'rectangle'){

      outerGeo =
        new THREE.PlaneGeometry(
          width,
          height
        );

    } else if (
      shapeKey === 'square'
    ){

      const size =
        Math.max(
          width,
          height
        );

      outerGeo =
        new THREE.PlaneGeometry(
          size,
          size
        );

    } else {

      outerGeo =
        buildDragGeometry(
          shapeKey,
          Math.max(
            width,
            height
          )
        );
    }

  } else {

    outerGeo =
      buildDragGeometry(
        shapeKey,
        SIZE
      );
  }


  let finalGeo =
    outerGeo;


  if (hollow){

    try{

      const {
        Evaluator,
        Brush,
        SUBTRACTION
      } =
        await import(
          'https://unpkg.com/three-bvh-csg@0.0.16/build/index.module.js'
        );


      const wallRatio = 0.6;


      let innerGeo;


      if (
        shapeMode === '2d' &&
        (
          shapeKey === 'rectangle' ||
          shapeKey === 'square'
        )
      ){

        const width =
          Math.max(
            GRID_SQUARE,
            Math.abs(p2.x-p1.x)
          );

        const height =
          Math.max(
            GRID_SQUARE,
            Math.abs(p2.y-p1.y)
          );


        innerGeo =
          new THREE.PlaneGeometry(
            width*wallRatio,
            height*wallRatio
          );

      } else {

        innerGeo =
          buildDragGeometry(
            shapeKey,
            SIZE*wallRatio
          );
      }


      const brushA =
        new Brush(outerGeo);

      brushA.updateMatrixWorld();


      const brushB =
        new Brush(innerGeo);

      brushB.updateMatrixWorld();


      const evaluator =
        new Evaluator();


      const result =
        evaluator.evaluate(
          brushA,
          brushB,
          SUBTRACTION
        );


      result.geometry
        .computeVertexNormals();

      finalGeo =
        result.geometry;

    } catch(err){

      console.error(err);

      showToast(
        'Hollow tool could not load — placed filled instead'
      );
    }
  }


  const mesh =
    new THREE.Mesh(
      finalGeo,
      new THREE.MeshStandardMaterial({
        color:SWATCHES[0],
        metalness:0.15,
        roughness:0.55
      })
    );


  if (shapeMode === '2d'){

    mesh.position.set(
      (p1.x+p2.x)/2,
      (p1.y+p2.y)/2,
      0
    );

  } else {

    mesh.position.set(
      (p1.x+p2.x)/2,
      0,
      (p1.z+p2.z)/2
    );
  }


  clampToPlate(
    mesh,
    false
  );

  attachOutline(mesh);

  scene.add(mesh);


  const rec = {
    id:Date.now()+Math.random(),
    num:active.shapes.length+1,
    mesh,
    geomId:shapeKey,
    fields:{
      size:SIZE,
      hollow
    },
    color:SWATCHES[0]
  };


  active.shapes.push(rec);

  activeShapeId = rec.id;

  armUndo(
    active.id,
    rec.id
  );

  refreshShapeVisuals();

  pendingP2P = null;

  showToast(
    `${hollow?'Hollow':'Filled'} ${shapeKey} placed`
  );

  goToShape();
}


/* ─────────────────────────────────────────────────────────────
   LAYER DELETE
───────────────────────────────────────────────────────────── */

function wireLayerDelete(){

  let armedId = null;
  let armTimer = null;


  menuScroll
    .querySelectorAll(
      '[data-del]'
    )
    .forEach(btn => {

      btn.addEventListener(
        'click',
        e => {

          e.stopPropagation();

          const id =
            parseInt(
              btn.dataset.del,
              10
            );


          if (armedId !== id){

            menuScroll
              .querySelectorAll(
                '.tile-del'
              )
              .forEach(b =>
                b.classList.remove(
                  'armed'
                )
              );


            armedId = id;

            btn.classList.add(
              'armed'
            );

            clearTimeout(
              armTimer
            );


            armTimer =
              setTimeout(
                () => {

                  armedId = null;

                  btn.classList.remove(
                    'armed'
                  );

                },
                3000
              );

          } else {

            clearTimeout(
              armTimer
            );

            showConfirm(
              'Delete this layer?',
              () => {

                deleteLayer(id);

                goToLayersHome();
              }
            );
          }
        }
      );
    });


  menuScroll
    .querySelectorAll(
      '[data-del-tool]'
    )
    .forEach(btn => {

      btn.addEventListener(
        'click',
        e => {

          e.stopPropagation();

          const id =
            parseInt(
              btn.dataset.delTool,
              10
            );


          showConfirm(
            'Delete this layer?',
            () => {

              deleteLayer(id);

              if (!layers.length){

                const l =
                  createLayer();

                activeLayerId = l.id;
              }

              renderDrawingToolsHome();
            }
          );
        }
      );
    });
}


/* ─────────────────────────────────────────────────────────────
   SHAPE PANEL
───────────────────────────────────────────────────────────── */

const ACTIONS = [
  {
    id:'select',
    label:'Select',
    icon:'select'
  },
  {
    id:'move',
    label:'Move',
    icon:'move'
  },
  {
    id:'scale',
    label:'Scale',
    icon:'scale'
  },
  {
    id:'color',
    label:'Color',
    icon:'color'
  },
  {
    id:'boolean',
    label:'Boolean',
    icon:'boolean'
  },
  {
    id:'delete',
    label:'Delete',
    icon:'trash'
  }
];


function renderShapePanel(subtool){

  const l =
    activeLayer();

  const s =
    activeShape();


  if (!l || !s){

    goToLayersHome();

    return;
  }


  setH2('');


  const totalShapes =
    layers.reduce(
      (n,ly) =>
        n + ly.shapes.length,
      0
    );


  const booleanDisabled =
    totalShapes < 2 ||
    !s.mesh.isMesh;


  menuScroll.innerHTML = `
    <div class="tile-row">

      <div class="tile3 layer-active">
        ${svg('shapes')}
        <span>${shapeLabel(s)}</span>
      </div>

    </div>

    <div
      class="action-col"
      style="margin-top:8px;">

      ${
        ACTIONS.map(
          a => `
            <button
              data-action="${a.id}"
              class="${a.id===subtool?'active':''}"
              ${
                a.id==='boolean' &&
                booleanDisabled
                  ? 'disabled'
                  : ''
              }>

              ${svg(a.icon)}

              <span>${a.label}</span>

            </button>
          `
        ).join('')
      }

    </div>

    <div
      id="subtoolSlot"
      style="margin-top:8px;">
    </div>
  `;


  menuScroll
    .querySelectorAll(
      '[data-action]'
    )
    .forEach(b => {

      b.addEventListener(
        'click',
        () => {

          const id =
            b.dataset.action;


          if (id === 'delete'){

            deleteShape(
              l.id,
              s.id
            );

            goToLayer();

            showToast(
              'Shape deleted'
            );

            return;
          }


          if (id === 'select'){

            activateCrosshair();

            return;
          }


          if (id === 'boolean'){

            crumbs = [
              l.name,
              shapeLabel(s),
              'Boolean'
            ];

            crumbBack = () =>
              goToShape();

            render(
              'booleanPick'
            );

            return;
          }


          goToSubtool(
            id[0].toUpperCase() +
            id.slice(1)
          );
        }
      );
    });


  if (
    subtool &&
    subtool !== 'boolean'
  ){
    fillSubtool(
      subtool,
      l,
      s
    );
  }
}


function fillSubtool(
  tool,
  l,
  s
){

  const slot =
    document.getElementById(
      'subtoolSlot'
    );

  if (!slot) return;


  if (tool === 'move'){

    const axes =
      shapeMode === '2d'
        ? ['X','Y']
        : ['X','Y','Z'];


    slot.innerHTML = `
      <div class="stepper-stack">
        ${
          axes.map(axis => {

            let value = 0;

            if (axis === 'X')
              value = s.mesh.position.x;

            if (axis === 'Y')
              value = s.mesh.position.y;

            if (axis === 'Z')
              value = s.mesh.position.z;

            const min =
              axis === 'Y' &&
              shapeMode === '3d'
                ? 0
                : -half;

            const max =
              axis === 'Y' &&
              shapeMode === '3d'
                ? PLATE_SIZE
                : half;

            return stepperRow(
              axis,
              value,
              min,
              max
            );
          }).join('')
        }
      </div>
    `;


    wireSteppers(
      slot,
      axes,
      (axis,val) => {

        if (axis === 'X')
          s.mesh.position.x = val;

        if (axis === 'Y')
          s.mesh.position.y =
            shapeMode === '3d'
              ? Math.max(0,val)
              : val;

        if (axis === 'Z')
          s.mesh.position.z = val;


        clampToPlate(
          s.mesh,
          true
        );

        fillSubtool(
          'move',
          l,
          s
        );
      }
    );


  } else if (tool === 'scale'){

    const axes =
      shapeMode === '2d'
        ? ['X','Y']
        : ['X','Y','Z'];


    slot.innerHTML = `
      <div class="stepper-stack">

        ${allAxisStepper()}

        ${
          axes.map(axis =>
            stepperRow(
              axis,
              s.mesh.scale[axis.toLowerCase()],
              0.1,
              10
            )
          ).join('')
        }

      </div>
    `;


    wireSteppers(
      slot,
      axes,
      (axis,val) => {

        s.mesh.scale[
          axis.toLowerCase()
        ] = val;

        clampToPlate(
          s.mesh,
          true
        );

        fillSubtool(
          'scale',
          l,
          s
        );
      }
    );


    const all =
      slot.querySelector(
        '.all-axes'
      );


    if (all){

      all
        .querySelectorAll(
          '[data-step]'
        )
        .forEach(btn => {

          btn.addEventListener(
            'click',
            () => {

              const d =
                parseFloat(
                  btn.dataset.step
                ) * 0.1;


              axes.forEach(axis => {

                const key =
                  axis.toLowerCase();

                s.mesh.scale[key] =
                  Math.min(
                    10,
                    Math.max(
                      0.1,
                      s.mesh.scale[key] + d
                    )
                  );
              });


              clampToPlate(
                s.mesh,
                true
              );


              fillSubtool(
                'scale',
                l,
                s
              );
            }
          );
        });
    }


  } else if (tool === 'color'){

    slot.innerHTML = `
      <div class="swatch-row">

        ${
          SWATCHES.map(
            c => `
              <div
                class="swatch ${s.color===c?'selected':''}"
                data-c="${c}"
                style="background:${c}">
              </div>
            `
          ).join('')
        }

      </div>
    `;


    slot
      .querySelectorAll(
        '[data-c]'
      )
      .forEach(sw => {

        sw.addEventListener(
          'click',
          () => {

            s.color =
              sw.dataset.c;

            refreshShapeVisuals();

            fillSubtool(
              'color',
              l,
              s
            );
          }
        );
      });
  }
}


function allAxisStepper(){

  const axes =
    shapeMode === '2d'
      ? 'X/Y'
      : 'X/Y/Z';


  return `
    <div
      class="stepper-row all-axes">

      <span class="step-lbl">
        All
      </span>

      <button data-step="-1">
        −
      </button>

      <input
        type="text"
        value="${axes}"
        readonly>

      <button data-step="1">
        +
      </button>

    </div>
  `;
}


function stepperRow(
  axis,
  val,
  min,
  max
){

  return `
    <div
      class="stepper-row"
      data-axis="${axis}">

      <span class="step-lbl">
        ${axis}
      </span>

      <button data-step="-1">
        −
      </button>

      <input
        type="number"
        value="${Number(val).toFixed(2)}"
        data-min="${min}"
        data-max="${max}">

      <button data-step="1">
        +
      </button>

    </div>
  `;
}


function wireSteppers(
  scope,
  axes,
  onChange
){

  axes.forEach(axis => {

    const row =
      scope.querySelector(
        `.stepper-row[data-axis="${axis}"]`
      );

    if (!row) return;


    const input =
      row.querySelector('input');


    const min =
      parseFloat(
        input.dataset.min
      );

    const max =
      parseFloat(
        input.dataset.max
      );


    row
      .querySelectorAll(
        '[data-step]'
      )
      .forEach(btn => {

        btn.addEventListener(
          'click',
          () => {

            /*
              Position = 2.5mm steps.
              Scale = 0.1 steps.
            */

            const stepSize =
              max <= 10
                ? 0.1
                : GRID_SQUARE;


            const current =
              parseFloat(
                input.value
              ) || 0;


            const v =
              Math.min(
                max,
                Math.max(
                  min,
                  current +
                  parseFloat(
                    btn.dataset.step
                  ) * stepSize
                )
              );


            onChange(
              axis,
              v
            );
          }
        );
      });


    input.addEventListener(
      'change',
      () => {

        onChange(
          axis,
          Math.min(
            max,
            Math.max(
              min,
              parseFloat(
                input.value
              ) || 0
            )
          )
        );
      }
    );
  });
}


/* ─────────────────────────────────────────────────────────────
   BOOLEAN
───────────────────────────────────────────────────────────── */

function renderBooleanPick(){

  const s =
    activeShape();


  if (!s){

    goToLayersHome();

    return;
  }


  setH2(
    'Pick a second shape, then an operation'
  );


  const others = [];


  layers.forEach(l =>
    l.shapes.forEach(sh => {

      if (
        !(
          l.id === activeLayerId &&
          sh.id === activeShapeId
        )
      ){
        others.push({
          l,
          sh
        });
      }
    })
  );


  let targetId = null;


  menuScroll.innerHTML = `
    <div class="tile-row">

      ${
        others.map(
          o => `
            <div
              class="tile3"
              data-target="${o.l.id}:${o.sh.id}">
              ${svg('shapes')}
              <span>
                ${shapeLabel(o.sh)}
              </span>
            </div>
          `
        ).join('')
      }

    </div>

    <div
      class="action-col"
      style="margin-top:8px;">

      <button
        data-op="union"
        disabled>
        ${svg('boolean')}
        <span>Union</span>
      </button>

      <button
        data-op="subtract"
        disabled>
        ${svg('boolean')}
        <span>Subtract</span>
      </button>

      <button
        data-op="intersect"
        disabled>
        ${svg('boolean')}
        <span>Intersect</span>
      </button>

    </div>
  `;


  menuScroll
    .querySelectorAll(
      '[data-target]'
    )
    .forEach(b => {

      b.addEventListener(
        'click',
        () => {

          targetId =
            b.dataset.target;


          menuScroll
            .querySelectorAll(
              '[data-target]'
            )
            .forEach(x =>
              x.classList.remove(
                'layer-active'
              )
            );


          b.classList.add(
            'layer-active'
          );


          menuScroll
            .querySelectorAll(
              '[data-op]'
            )
            .forEach(
              x => x.disabled = false
            );
        }
      );
    });


  menuScroll
    .querySelectorAll(
      '[data-op]'
    )
    .forEach(b => {

      b.addEventListener(
        'click',
        () => {

          if (!targetId) return;

          const parts =
            targetId.split(':');


          runBoolean(
            b.dataset.op,
            parseInt(
              parts[0],
              10
            ),
            parseFloat(
              parts[1]
            )
          );
        }
      );
    });
}


async function runBoolean(
  mode,
  targetLayerId,
  targetShapeId
){

  const a =
    activeShape();

  const aLayer =
    activeLayer();

  const bLayer =
    findLayer(
      targetLayerId
    );

  const b =
    bLayer
      ? bLayer.shapes.find(
          s => s.id === targetShapeId
        )
      : null;


  if (!a || !b) return;


  if (
    !a.mesh.isMesh ||
    !b.mesh.isMesh
  ){

    showToast(
      'Boolean requires solid shapes'
    );

    return;
  }


  try{

    const {
      Evaluator,
      Brush,
      ADDITION,
      SUBTRACTION,
      INTERSECTION
    } =
      await import(
        'https://unpkg.com/three-bvh-csg@0.0.16/build/index.module.js'
      );


    const opMap = {
      union:ADDITION,
      subtract:SUBTRACTION,
      intersect:INTERSECTION
    };


    a.mesh.updateMatrixWorld();
    b.mesh.updateMatrixWorld();


    const brushA =
      new Brush(
        a.mesh.geometry.clone()
      );

    brushA.position.copy(
      a.mesh.position
    );

    brushA.scale.copy(
      a.mesh.scale
    );

    brushA.updateMatrixWorld();


    const brushB =
      new Brush(
        b.mesh.geometry.clone()
      );

    brushB.position.copy(
      b.mesh.position
    );

    brushB.scale.copy(
      b.mesh.scale
    );

    brushB.updateMatrixWorld();


    const evaluator =
      new Evaluator();


    const result =
      evaluator.evaluate(
        brushA,
        brushB,
        opMap[mode]
      );


    result.geometry
      .computeVertexNormals();


    const color =
      a.color;


    const mesh =
      new THREE.Mesh(
        result.geometry,
        new THREE.MeshStandardMaterial({
          color,
          metalness:0.15,
          roughness:0.55
        })
      );


    clampToPlate(
      mesh,
      false
    );

    attachOutline(mesh);

    scene.add(mesh);


    const rec = {
      id:Date.now()+Math.random(),
      num:aLayer.shapes.length,
      mesh,
      geomId:'solid',
      fields:null,
      color
    };


    deleteShape(
      aLayer.id,
      a.id
    );

    deleteShape(
      bLayer.id,
      b.id
    );


    aLayer.shapes.push(rec);

    aLayer.shapes.forEach(
      (s2,i) =>
        s2.num = i+1
    );


    activeLayerId =
      aLayer.id;

    activeShapeId =
      rec.id;


    refreshShapeVisuals();


    showToast(
      `${
        mode[0].toUpperCase() +
        mode.slice(1)
      } created`
    );


    goToShape();

  } catch(err){

    console.error(err);

    showToast(
      'Boolean tool could not load — check your connection'
    );
  }
}


/* ─────────────────────────────────────────────────────────────
   SETTINGS / HELP
───────────────────────────────────────────────────────────── */

function renderSettings(){

  setH2(
    `Plate fixed at ${PLATE_SIZE}×${PLATE_SIZE}mm, ${GRID_SQUARE}mm grid`
  );


  menuScroll.innerHTML = `
    <div class="tile-row">

      <div
        class="tile3"
        id="saveBtn">
        ${svg('settings')}
        <span>Save</span>
      </div>

      <div
        class="tile3"
        id="loadBtn">
        ${svg('settings')}
        <span>Load</span>
      </div>

      <div
        class="tile3"
        id="stlBtn">
        ${svg('settings')}
        <span>Export STL</span>
      </div>

    </div>
  `;


  document
    .getElementById('saveBtn')
    .addEventListener(
      'click',
      () => {

        saveSceneJSON();

        showToast(
          'Scene saved'
        );
      }
    );


  document
    .getElementById('loadBtn')
    .addEventListener(
      'click',
      () =>
        showToast(
          'Load Scene is coming in a future update'
        )
    );


  document
    .getElementById('stlBtn')
    .addEventListener(
      'click',
      () => {

        exportSTL();

        showToast(
          'STL exported'
        );
      }
    );
}


function renderHelp(){

  setH2(
    'Every module in the app'
  );


  menuScroll.innerHTML = `
    <div class="tile-row">

      ${
        MODULES
          .filter(
            m =>
              MODULE_ORDER.includes(
                m.id
              )
          )
          .map(
            m => `
              <div
                class="tile3"
                style="opacity:0.6">
                ${svg(m.icon)}
                <span>${m.label}</span>
              </div>
            `
          )
          .join('')
      }

    </div>
  `;
}


/* ─────────────────────────────────────────────────────────────
   CONFIRMATION
───────────────────────────────────────────────────────────── */

const confirmOverlay =
  document.createElement('div');

confirmOverlay.id =
  'confirmOverlay';

confirmOverlay.classList.add(
  'hidden'
);

confirmOverlay.innerHTML = `
  <div class="confirm-box">

    <p id="confirmMsg"></p>

    <div class="confirm-row">

      <button
        class="confirm-no"
        id="confirmNo">
        No
      </button>

      <button
        class="confirm-yes"
        id="confirmYes">
        Yes
      </button>

    </div>

  </div>
`;

document
  .getElementById('main')
  .appendChild(
    confirmOverlay
  );


function showConfirm(
  msg,
  onYes
){

  document
    .getElementById('confirmMsg')
    .textContent = msg;


  confirmOverlay
    .classList.remove(
      'hidden'
    );


  const yes =
    document.getElementById(
      'confirmYes'
    );

  const no =
    document.getElementById(
      'confirmNo'
    );


  const cleanup = () => {

    confirmOverlay
      .classList.add(
        'hidden'
      );

    yes.replaceWith(
      yes.cloneNode(true)
    );

    no.replaceWith(
      no.cloneNode(true)
    );
  };


  document
    .getElementById('confirmYes')
    .addEventListener(
      'click',
      () => {

        cleanup();

        onYes();
      }
    );


  document
    .getElementById('confirmNo')
    .addEventListener(
      'click',
      cleanup
    );
}


/* ─────────────────────────────────────────────────────────────
   EXPORT / SAVE
───────────────────────────────────────────────────────────── */

function exportSTL(){

  const meshes = [];

  layers.forEach(l =>
    l.shapes.forEach(s => {

      if (s.mesh.isMesh){
        meshes.push(
          s.mesh
        );
      }
    })
  );


  if (!meshes.length){

    showToast(
      'Nothing to export'
    );

    return;
  }


  const group =
    new THREE.Group();


  meshes.forEach(m => {

    const c =
      m.clone();

    c.remove(
      ...c.children
    );

    group.add(c);
  });


  const exporter =
    new STLExporter();


  const result =
    exporter.parse(
      group,
      {
        binary:true
      }
    );


  downloadBlob(
    new Blob(
      [result],
      {
        type:'application/octet-stream'
      }
    ),
    'stl-maker-model.stl'
  );
}


function saveSceneJSON(){

  const data =
    layers.map(l => ({
      name:l.name,

      shapes:
        l.shapes.map(
          s => ({
            geomId:s.geomId,
            fields:s.fields,
            color:s.color,
            position:
              s.mesh.position.toArray(),
            scale:
              s.mesh.scale.toArray()
          })
        )
    }));


  downloadBlob(
    new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        )
      ],
      {
        type:'application/json'
      }
    ),
    'stl-maker-scene.json'
  );
}


function downloadBlob(
  blob,
  filename
){

  const url =
    URL.createObjectURL(
      blob
    );

  const a =
    document.createElement('a');

  a.href = url;

  a.download =
    filename;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  setTimeout(
    () =>
      URL.revokeObjectURL(url),
    2000
  );
}


/* ─────────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────────── */

let toastTimer = null;


function showToast(msg){

  const t =
    document.getElementById(
      'toast'
    );

  t.textContent = msg;

  t.classList.add(
    'show'
  );

  clearTimeout(
    toastTimer
  );

  toastTimer =
    setTimeout(
      () =>
        t.classList.remove(
          'show'
        ),
      1800
    );
}


/* ─────────────────────────────────────────────────────────────
   INITIAL STATE
───────────────────────────────────────────────────────────── */

refreshModeScene();
refreshModeToggle();

renderH1();

goToDrawingTools();