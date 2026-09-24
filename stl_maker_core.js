/* STL Maker — CORE subsystem (scene, camera, renderer, grid, plate, axes) */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* Every file in this split shares one namespace object instead of precise
   import/export wiring between all 8 files. Any file can read STL.scene,
   STL.camera, STL.svg, etc. A missing piece shows up as undefined at the
   point it's used, instead of crashing the whole app on load. */
window.STL = window.STL || {};
const STL = window.STL;
STL.THREE = THREE;

/* ─────────────────────────────────────────────────────────────
   THREE.JS
───────────────────────────────────────────────────────────── */
const canvas = document.getElementById('viewport3d');
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x1a1a2e, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 5000);
const DEFAULT_CAM = new THREE.Vector3(90, 70, 110);
camera.position.copy(DEFAULT_CAM);

scene.add(new THREE.HemisphereLight(0xfff4e0, 0x14141f, 1.1));
const key = new THREE.DirectionalLight(0xffffff, 1.4);
key.position.set(60, 90, 40);
scene.add(key);
const fillL = new THREE.DirectionalLight(0xc8a96e, 0.35);
fillL.position.set(-60, 30, -40);
scene.add(fillL);

const PLATE_SIZE = 100;
const GRID_SQUARE = 5;
const half = PLATE_SIZE / 2;
let shapeMode = '2d';

/* GRID — X/Y PLANE */
const grid = new THREE.GridHelper(PLATE_SIZE, PLATE_SIZE / GRID_SQUARE, 0xc8a96e, 0x34355a);
grid.material.transparent = true;
grid.material.opacity = 0.4;
grid.rotation.x = Math.PI / 2;
scene.add(grid);

/* PLATE BORDER */
const borderGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-half, -half, 0),
  new THREE.Vector3(half, -half, 0),
  new THREE.Vector3(half, half, 0),
  new THREE.Vector3(-half, half, 0),
]);
const plateBorder = new THREE.LineLoop(borderGeometry, new THREE.LineBasicMaterial({ color:0xe0c48f }));
scene.add(plateBorder);

/* AXES */
function makeLabelSprite(text, color, fontSize=26){
  const cvs = document.createElement('canvas');
  cvs.width = 64; cvs.height = 32;
  const ctx = cvs.getContext('2d');
  ctx.fillStyle = color || '#e0c48f';
  ctx.font = `bold ${fontSize}px monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 32, 16);
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map:new THREE.CanvasTexture(cvs), depthTest:false }));
  spr.scale.set(6, 3, 1);
  return spr;
}

const axisOrigin = new THREE.Vector3(-half-4, -half-4, 0.1);
const xArrow = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), axisOrigin, 18, 0xd9534f, 4, 3);
const yArrow = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), axisOrigin, 18, 0x5cb85c, 4, 3);
const zArrow = new THREE.ArrowHelper(new THREE.Vector3(0,0,1), axisOrigin, 18, 0x4a90d9, 4, 3);
scene.add(xArrow); scene.add(yArrow); scene.add(zArrow);

const xLabel = makeLabelSprite('X', '#d9534f', 26);
const yLabel = makeLabelSprite('Y', '#5cb85c', 26);
const zLabel = makeLabelSprite('Z', '#4a90d9', 26);
scene.add(xLabel); scene.add(yLabel); scene.add(zLabel);

/* MM LABELS */
let mmLabelGroup = null;
function buildMmLabels(step){
  if (mmLabelGroup) scene.remove(mmLabelGroup);
  mmLabelGroup = new THREE.Group();
  for (let v=0; v<=PLATE_SIZE; v+=step){
    const sx = makeLabelSprite(String(v));
    sx.position.set(-half+v, -half-5, 0.2);
    mmLabelGroup.add(sx);
    const sy = makeLabelSprite(String(v));
    sy.position.set(-half-5, -half+v, 0.2);
    mmLabelGroup.add(sy);
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
  mmBtn.innerHTML = `<span class="seg ${mmState==='5'?'on':''}">5</span><span class="sep">|</span><span class="seg ${mmState==='2.5'?'on':''}">2.5</span>`;
}
mmBtn.addEventListener('click', () => {
  mmState = mmState==='off' ? '5' : mmState==='5' ? '2.5' : 'off';
  if (mmState==='off'){ mmLabelGroup.visible = false; }
  else { buildMmLabels(mmState==='5' ? 5 : 2.5); mmLabelGroup.visible = true; }
  refreshMmBtn();
});
refreshMmBtn();

/* MODE */
const modeToggle = document.createElement('div');
modeToggle.id = 'modeToggle';
modeToggle.innerHTML = `<button data-m="2d">2D</button><button data-m="3d">3D</button>`;
document.getElementById('plate').appendChild(modeToggle);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 0, 0);
controls.update();

let rotationLocked = true;
controls.enableRotate = false;

/* WORKING PLANE */
const dragGroundPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

/* GRID ROTATION MODE */
let gridRotationAxis = 'x';
let gridRotationEnabled = false;
let gridRotationDragging = false;
let gridRotationLastX = 0;
let gridRotationLastY = 0;
const GRID_ROTATION_SPEED = 0.01;

function setGridRotationAxis(axis){
  if (axis!=='x' && axis!=='y' && axis!=='z') return;
  gridRotationAxis = axis;
}
function setGridRotationEnabled(enabled){
  gridRotationEnabled = !!enabled;
  gridRotationDragging = false;
  controls.enableRotate = false;
}
function startGridRotation(e){
  if (!gridRotationEnabled) return;
  if (e.pointerType==='mouse' && e.button!==0) return;
  gridRotationDragging = true;
  gridRotationLastX = e.clientX;
  gridRotationLastY = e.clientY;
  controls.enabled = false;
  if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
}
function moveGridRotation(e){
  if (!gridRotationDragging) return;
  const dx = e.clientX - gridRotationLastX;
  const dy = e.clientY - gridRotationLastY;
  gridRotationLastX = e.clientX; gridRotationLastY = e.clientY;
  if (gridRotationAxis==='x') grid.rotation.x += dy*GRID_ROTATION_SPEED;
  else if (gridRotationAxis==='y') grid.rotation.y += dx*GRID_ROTATION_SPEED;
  else if (gridRotationAxis==='z') grid.rotation.z += dx*GRID_ROTATION_SPEED;
}
function stopGridRotation(e){
  if (!gridRotationDragging) return;
  gridRotationDragging = false;
  controls.enabled = true;
  if (e && canvas.releasePointerCapture){ try{ canvas.releasePointerCapture(e.pointerId); } catch(err){} }
}
canvas.addEventListener('pointerdown', startGridRotation);
canvas.addEventListener('pointermove', moveGridRotation);
canvas.addEventListener('pointerup', stopGridRotation);
canvas.addEventListener('pointercancel', stopGridRotation);

function refreshModeScene(){
  if (shapeMode==='2d'){
    grid.rotation.set(Math.PI/2, 0, 0);
    grid.position.set(0, 0, 0);
    plateBorder.rotation.set(0, 0, 0);
    plateBorder.position.set(0, 0, 0.06);
    xArrow.position.set(-half-4, -half-4, 0.1);
    xArrow.setDirection(new THREE.Vector3(1,0,0));
    yArrow.position.set(-half-4, -half-4, 0.1);
    yArrow.setDirection(new THREE.Vector3(0,1,0));
    zArrow.visible = false; zLabel.visible = false;
    xLabel.position.set(-half-4+10, -half-4, 0.1);
    yLabel.position.set(-half-4, -half-4+10, 0.1);
    xLabel.visible = true; yLabel.visible = true;
    camera.position.set(0, 0, 140);
    camera.up.set(0, 1, 0);
    controls.target.set(0, 0, 0);
    controls.enableRotate = false;
    dragGroundPlane.set(new THREE.Vector3(0,0,1), 0);
  } else {
    grid.rotation.set(Math.PI/2, 0, 0);
    grid.position.set(0, 0, 0);
    plateBorder.rotation.set(0, 0, 0);
    plateBorder.position.set(0, 0, 0.06);
    xArrow.position.copy(axisOrigin);
    yArrow.position.copy(axisOrigin);
    zArrow.position.copy(axisOrigin);
    xArrow.setDirection(new THREE.Vector3(1,0,0));
    yArrow.setDirection(new THREE.Vector3(0,1,0));
    zArrow.setDirection(new THREE.Vector3(0,0,1));
    xLabel.position.set(axisOrigin.x+10, axisOrigin.y, axisOrigin.z);
    yLabel.position.set(axisOrigin.x, axisOrigin.y+10, axisOrigin.z);
    zLabel.position.set(axisOrigin.x, axisOrigin.y, axisOrigin.z+10);
    xLabel.visible = true; yLabel.visible = true; zLabel.visible = true;
    zArrow.visible = true;
    camera.position.copy(DEFAULT_CAM);
    controls.target.set(0, 0, 0);
    controls.enableRotate = false;
    dragGroundPlane.set(new THREE.Vector3(0,0,1), 0);
  }
  controls.update();
  if (mmState!=='off'){ buildMmLabels(mmState==='5' ? 5 : 2.5); mmLabelGroup.visible = true; }
}
function refreshModeToggle(){
  modeToggle.querySelectorAll('button').forEach(b => b.classList.toggle('toggle-active', b.dataset.m===shapeMode));
}
function setShapeMode(mode){
  shapeMode = mode;
  STL.shapeMode = mode;
  refreshModeScene();
  refreshModeToggle();
  /* these three live in other files — read via STL so load order and
     missing pieces never crash this file; they just no-op if absent */
  if (STL.activeModule==='tools'){
    STL.renderDrawingToolsHome && STL.renderDrawingToolsHome();
  } else if (STL.activeModule==='layers'){
    const s = STL.activeShape && STL.activeShape();
    if (s) STL.goToShape && STL.goToShape();
    else STL.goToLayersHome && STL.goToLayersHome();
  }
}
modeToggle.querySelectorAll('button').forEach(b => b.addEventListener('click', () => setShapeMode(b.dataset.m)));

const lockBtn = document.createElement('button');
lockBtn.id = 'lockBtn';
document.getElementById('plate').appendChild(lockBtn);
function refreshLockBtn(){
  lockBtn.innerHTML = (STL.svg ? STL.svg(rotationLocked ? 'lock' : 'unlock') : (rotationLocked ? '\u{1F512}' : '\u{1F513}'));
  lockBtn.classList.toggle('unlocked', !rotationLocked);
}
lockBtn.addEventListener('click', () => {
  rotationLocked = !rotationLocked;
  controls.enableRotate = shapeMode==='3d' && !rotationLocked;
  refreshLockBtn();
});
refreshLockBtn();

function fitCanvas(){
  const rect = document.getElementById('plate').getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
}
new ResizeObserver(fitCanvas).observe(document.getElementById('plate'));
setTimeout(fitCanvas, 30);

(function animate(){
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
})();

/* ── register everything other files may need ── */
Object.assign(STL, {
  canvas, renderer, scene, camera, DEFAULT_CAM, controls,
  PLATE_SIZE, GRID_SQUARE, half, shapeMode,
  grid, plateBorder, dragGroundPlane,
  setShapeMode, refreshModeScene, refreshModeToggle,
  setGridRotationAxis, setGridRotationEnabled,
  get rotationLocked(){ return rotationLocked; },
  fitCanvas, makeLabelSprite,
});
