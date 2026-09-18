import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { ICONS, MODULES, SHAPES_3D, SWATCHES } from './formwork-data.js';
/* NOTE: if your data file has a different name than formwork-data.js, update the
   import path above to match — search for "formwork-data.js" and replace it. */

/* =====================================================================
   INJECTED STYLES — kept in this one file on purpose (single-file build)
   ===================================================================== */
const style = document.createElement('style');
style.textContent = `
.stepper-row{ display:flex; align-items:center; gap:6px; }
.stepper-row .step-lbl{ width:14px; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--gold); flex:0 0 auto; }
.stepper-row button{ width:30px; height:30px; flex:0 0 auto; background:var(--navy-3); border:1px solid var(--line); border-radius:7px; color:var(--gold-light); font-size:16px; font-weight:700; }
.stepper-row button:active{ background:var(--gold); color:var(--navy); }
.stepper-row input{ flex:1; min-width:0; background:#fff; color:#111; border:1px solid var(--line); border-radius:7px; font-family:'JetBrains Mono',monospace; font-size:12px; padding:6px 4px; text-align:center; }
.pinned-tile{ display:flex; align-items:center; gap:8px; background:var(--navy-4); border:1px solid var(--gold); border-radius:10px; padding:8px; position:relative; }
.pinned-tile .swatch-fill{ width:28px; height:28px; border-radius:6px; flex:0 0 auto; }
.pinned-tile .pt-label{ font-size:11.5px; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:none; }
#slideMenu.expanded .pinned-tile .pt-label{ display:block; }
.action-row{ display:grid; grid-template-columns:repeat(5,1fr); gap:5px; }
.action-row button{ display:flex; flex-direction:column; align-items:center; gap:3px; background:var(--navy-3); border:1px solid var(--line); border-radius:8px; color:var(--ink); padding:7px 2px; }
.action-row button svg{ width:16px; height:16px; color:var(--gold-light); }
.action-row button span{ font-size:8px; font-weight:600; }
.action-row button.active{ border-color:var(--gold); background:var(--navy-4); }
.shape-tile-wrap{ position:relative; }
.shape-num{ position:absolute; top:3px; right:5px; font-size:9px; font-weight:700; color:var(--gold-light); }
.layer-tile-wrap{ position:relative; }
.layer-del{ position:absolute; top:3px; right:3px; width:20px; height:20px; border-radius:5px; background:var(--navy); border:1px solid var(--line); color:var(--muted); display:flex; align-items:center; justify-content:center; z-index:2; }
.layer-del svg{ width:12px; height:12px; }
.layer-del.armed{ background:var(--danger); color:#fff; border-color:var(--danger); }
#lockBtn{ position:absolute; top:10px; right:10px; z-index:6; width:38px; height:38px; background:rgba(32,33,58,0.9); border:1px solid var(--line); border-radius:9px; color:var(--gold-light); display:flex; align-items:center; justify-content:center; }
#lockBtn svg{ width:18px; height:18px; }
#lockBtn.unlocked{ color:var(--muted); }
#confirmOverlay{ position:absolute; inset:0; z-index:50; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; }
#confirmOverlay.hidden{ display:none; }
.confirm-box{ background:var(--navy-2); border:1px solid var(--line); border-radius:12px; padding:18px; width:78%; max-width:280px; text-align:center; }
.confirm-box p{ font-size:13px; color:var(--ink); margin:0 0 14px; }
.confirm-row{ display:flex; gap:10px; }
.confirm-row button{ flex:1; padding:10px; border-radius:8px; font-size:13px; font-weight:700; border:1px solid var(--line); }
.confirm-yes{ background:var(--danger); color:#fff; border-color:var(--danger); }
.confirm-no{ background:var(--navy-3); color:var(--ink); }
`;
document.head.appendChild(style);

/* =====================================================================
   ICON HELPER
   ===================================================================== */
function svg(name){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||''}</svg>`; }
const EXTRA_ICONS = {
  lock:   '<rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
  unlock: '<rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8 10.5V7a4 4 0 0 1 7.5-2"/>',
  crosshair: '<circle cx="12" cy="12" r="7"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>',
};
Object.assign(ICONS, EXTRA_ICONS);

/* =====================================================================
   THREE.JS SCENE
   ===================================================================== */
const canvas = document.getElementById('viewport3d');
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x1a1a2e, 1);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 5000);
const DEFAULT_CAM = new THREE.Vector3(90, 70, 110);
camera.position.copy(DEFAULT_CAM);
scene.add(new THREE.HemisphereLight(0xfff4e0, 0x14141f, 1.1));
const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(60,90,40); scene.add(key);
const fillL = new THREE.DirectionalLight(0xc8a96e, 0.35); fillL.position.set(-60,30,-40); scene.add(fillL);

const PLATE_SIZE = 100, GRID_SQUARE = 2.5, half = PLATE_SIZE/2;
const grid = new THREE.GridHelper(PLATE_SIZE, PLATE_SIZE/GRID_SQUARE, 0xc8a96e, 0x34355a);
grid.material.transparent = true; grid.material.opacity = 0.4;
scene.add(grid);
scene.add(new THREE.LineLoop(
  new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-half,0.06,-half),new THREE.Vector3(half,0.06,-half),new THREE.Vector3(half,0.06,half),new THREE.Vector3(-half,0.06,half)]),
  new THREE.LineBasicMaterial({ color:0xe0c48f })
));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.target.set(0,10,0); controls.update();

/* manual rotation lock — defaults LOCKED on load, independent of 2D/3D shape mode */
let rotationLocked = true;
controls.enableRotate = !rotationLocked;
const lockBtn = document.createElement('button');
lockBtn.id = 'lockBtn';
document.getElementById('plate').appendChild(lockBtn);
function refreshLockBtn(){
  lockBtn.innerHTML = svg(rotationLocked ? 'lock' : 'unlock');
  lockBtn.classList.toggle('unlocked', !rotationLocked);
}
lockBtn.addEventListener('click', () => { rotationLocked = !rotationLocked; controls.enableRotate = !rotationLocked; refreshLockBtn(); });
refreshLockBtn();

function fitCanvas(){
  const rect = document.getElementById('plate').getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width/rect.height; camera.updateProjectionMatrix();
}
new ResizeObserver(fitCanvas).observe(document.getElementById('plate'));
setTimeout(fitCanvas, 30);
(function animate(){ requestAnimationFrame(animate); controls.update(); renderer.render(scene,camera); })();

/* =====================================================================
   DATA MODEL — layers hold many shapes
   ===================================================================== */
const layers = [];        // { id, name, shapes:[{id,num,mesh,geomId,fields,color}] }
let nextLayerId = 1;
let activeLayerId = null;
let activeShapeId = null;
const GRAY = 0x777788;

function findLayer(id){ return layers.find(l=>l.id===id); }
function activeLayer(){ return findLayer(activeLayerId); }
function findShape(layerId, shapeId){ const l=findLayer(layerId); return l ? l.shapes.find(s=>s.id===shapeId) : null; }
function activeShape(){ const l=activeLayer(); return l ? l.shapes.find(s=>s.id===activeShapeId) : null; }

function createLayer(){
  const l = { id: nextLayerId++, name:`Layer ${layers.length+1}`, shapes:[] };
  layers.push(l);
  return l;
}

function refreshShapeVisuals(){
  layers.forEach(l => l.shapes.forEach(s => {
    const active = (l.id===activeLayerId && s.id===activeShapeId);
    s.mesh.material.color.set(active ? s.color : GRAY);
    if (s.mesh.userData.outline) s.mesh.userData.outline.visible = !active;
  }));
}

/* =====================================================================
   GEOMETRY / CLAMP
   ===================================================================== */
function buildGeometry(shapeId, fields){
  if (shapeId==='circle')    return new THREE.SphereGeometry(fields.D/2, 32, 24);
  if (shapeId==='square')    return new THREE.BoxGeometry(fields.W, fields.W, fields.W);
  if (shapeId==='rectangle') return new THREE.BoxGeometry(fields.L, fields.H, fields.W);
  if (shapeId==='cylinder')  return new THREE.CylinderGeometry(fields.D/2, fields.D/2, fields.H, 32);
  if (shapeId==='cone')      return new THREE.ConeGeometry(fields.D/2, fields.H, 32);
  return new THREE.BoxGeometry(30,30,30);
}
function clampToPlate(mesh, allowFloat){
  const geo = mesh.geometry; if (!geo.boundingBox) geo.computeBoundingBox(); const bb = geo.boundingBox;
  const rx=(bb.max.x-bb.min.x)*mesh.scale.x, ry=(bb.max.y-bb.min.y)*mesh.scale.y, rz=(bb.max.z-bb.min.z)*mesh.scale.z;
  if (rx>PLATE_SIZE) mesh.scale.x*=PLATE_SIZE/rx;
  if (ry>PLATE_SIZE) mesh.scale.y*=PLATE_SIZE/ry;
  if (rz>PLATE_SIZE) mesh.scale.z*=PLATE_SIZE/rz;
  if (!allowFloat) mesh.position.y = -bb.min.y*mesh.scale.y;
  else if (mesh.position.y < -bb.min.y*mesh.scale.y) mesh.position.y = -bb.min.y*mesh.scale.y; // floor at plate
  const hx=(bb.max.x-bb.min.x)*mesh.scale.x/2, hz=(bb.max.z-bb.min.z)*mesh.scale.z/2;
  mesh.position.x = THREE.MathUtils.clamp(mesh.position.x, -half+hx, half-hx);
  mesh.position.z = THREE.MathUtils.clamp(mesh.position.z, -half+hz, half-hz);
}
function attachOutline(mesh){
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color:0xffffff }));
  mesh.add(edges);
  mesh.userData.outline = edges;
}
function insertShape(layerId, shapeId, fields){
  const l = findLayer(layerId);
  const geo = buildGeometry(shapeId, fields);
  const color = SWATCHES[0];
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, metalness:0.15, roughness:0.55 }));
  mesh.position.set(0,0,0);
  clampToPlate(mesh, false);
  attachOutline(mesh);
  scene.add(mesh);
  const rec = { id: Date.now()+Math.random(), num: l.shapes.length+1, mesh, geomId:shapeId, fields:{...fields}, color };
  l.shapes.push(rec);
  return rec;
}
function deleteShape(layerId, shapeId){
  const l = findLayer(layerId); if (!l) return;
  const idx = l.shapes.findIndex(s=>s.id===shapeId); if (idx===-1) return;
  const s = l.shapes[idx];
  scene.remove(s.mesh); s.mesh.geometry.dispose();
  l.shapes.splice(idx,1);
  l.shapes.forEach((s2,i)=>s2.num=i+1); // renumber sequentially, no gaps
  if (activeShapeId===shapeId) activeShapeId = null;
}
function deleteLayer(layerId){
  const l = findLayer(layerId); if (!l) return;
  l.shapes.forEach(s => { scene.remove(s.mesh); s.mesh.geometry.dispose(); });
  const idx = layers.indexOf(l);
  layers.splice(idx,1);
  layers.forEach((l2,i)=>l2.name=`Layer ${i+1}`); // renumber sequentially
  if (activeLayerId===layerId){ activeLayerId=null; activeShapeId=null; }
}

/* raycaster tap-to-select on the plate */
const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2();
canvas.addEventListener('pointerup', (e) => {
  const rect = canvas.getBoundingClientRect();
  ndc.x = ((e.clientX-rect.left)/rect.width)*2-1;
  ndc.y = -((e.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(ndc, camera);
  const all = [];
  layers.forEach(l => l.shapes.forEach(s => all.push({l,s})));
  const hits = raycaster.intersectObjects(all.map(x=>x.s.mesh), false);
  if (hits.length){
    const hit = all.find(x => x.s.mesh === hits[0].object);
    activeLayerId = hit.l.id; activeShapeId = hit.s.id;
    refreshShapeVisuals();
    resetView('shapePanel');
  }
});

/* =====================================================================
   H1 — MODULES  (View is intentionally skipped — replaced by lock button)
   ===================================================================== */
const h1 = document.getElementById('h1');
const MODULE_ORDER = ['tools','layers','settings','help'];
function renderH1(){
  const mods = MODULE_ORDER.map(id => MODULES.find(m=>m.id===id)).filter(Boolean);
  h1.innerHTML = mods.map(m => `<button class="module-btn" data-module="${m.id}">${svg(m.icon)}<span>${m.label}</span></button>`).join('');
  h1.querySelectorAll('[data-module]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.module;
    if (id==='tools') resetView('toolsHome');
    else if (id==='layers') resetView('layersList');
    else if (id==='settings') resetView('settings');
    else if (id==='help') resetView('help');
  }));
}

/* =====================================================================
   H2 + VIEW STACK
   ===================================================================== */
const h2Title = document.getElementById('h2Title'), h2Info = document.getElementById('h2Info');
const btnUndo = document.getElementById('btnUndo'), btnRedo = document.getElementById('btnRedo');
btnUndo.innerHTML = svg('undo') + '<span>Undo</span>';
btnRedo.innerHTML = svg('redo') + '<span>Redo</span>';
btnUndo.disabled = true; btnRedo.disabled = true; // history not wired in this pass

let viewStack = [{v:'home'}];
function resetView(v, ctx){ viewStack = [{v, ...(ctx||{})}]; render(); }
function pushView(v, ctx){ viewStack.push({v, ...(ctx||{})}); render(); }
function backView(){ if (viewStack.length>1) viewStack.pop(); render(); }
function topView(){ return viewStack[viewStack.length-1]; }

const menuScroll = document.getElementById('menuScroll');
const slideMenu = document.getElementById('slideMenu');
document.getElementById('expandTab').innerHTML = svg('back') // placeholder, rotated via CSS
document.getElementById('expandTab').addEventListener('click', () => slideMenu.classList.toggle('expanded'));

let h2BackHandlerAttached = false;
function ensureH2Back(){
  if (h2BackHandlerAttached) return;
  const wrap = h2Title.parentElement.parentElement; // #h2
  const backBtn = document.createElement('button');
  backBtn.id = 'h2Back';
  backBtn.style.cssText = 'background:none;border:none;color:var(--gold-light);width:26px;height:26px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;';
  backBtn.innerHTML = svg('back');
  backBtn.addEventListener('click', backView);
  wrap.insertBefore(backBtn, wrap.firstChild);
  h2BackHandlerAttached = true;
}
ensureH2Back();
function setH2(title, info){
  document.getElementById('h2Back').style.display = viewStack.length>1 ? 'flex' : 'none';
  h2Title.textContent = title; h2Info.textContent = info;
}

/* =====================================================================
   RENDER DISPATCH
   ===================================================================== */
function render(){
  slideMenu.classList.add('open');
  const t = topView();
  if (t.v==='home') renderHome();
  else if (t.v==='addShapeFlow') renderAddShapeFlow();
  else if (t.v==='shapePanel') renderShapePanel();
  else if (t.v==='subtool') renderSubtool(t.tool);
  else if (t.v==='layersList') renderLayersList();
  else if (t.v==='toolsHome') renderToolsHome();
  else if (t.v==='booleanPick') renderBooleanPick();
  else if (t.v==='settings') renderSettings();
  else if (t.v==='help') renderHelp();
}

/* ---- HOME: content of the active layer ---- */
function renderHome(){
  const l = activeLayer();
  if (!l){
    // no layer active yet — create the first one automatically
    const nl = createLayer(); activeLayerId = nl.id;
  }
  const layer = activeLayer();
  if (!layer.shapes.length){
    pushIfNeeded('addShapeFlow');
    renderAddShapeFlow();
    return;
  }
  setH2(`${layer.name} : ${layer.shapes.length} shapes`, 'Tap a shape to select it');
  menuScroll.innerHTML = layer.shapes.map(s => `
    <div class="tile shape-tile-wrap" data-shape="${s.id}">
      ${svg('shapes')}<span>${s.geomId}</span>
      <span class="shape-num">#${s.num}</span>
    </div>`).join('');
  menuScroll.querySelectorAll('[data-shape]').forEach(el => el.addEventListener('click', () => {
    activeShapeId = parseFloat(el.dataset.shape);
    refreshShapeVisuals();
    pushView('shapePanel');
  }));
}
function pushIfNeeded(v){ if (topView().v!==v) viewStack.push({v}); }

/* ---- ADD SHAPE FLOW: 2D (default) / 3D toggle ---- */
let shapeMode = '2d';
function renderAddShapeFlow(){
  setH2('Add Shape', shapeMode==='2d' ? 'Sketch tools' : 'Tap a shape to add it');
  const toggle = `<div class="toggle-row">
    <button class="toggle-btn ${shapeMode==='2d'?'active':''}" data-mode="2d">2D</button>
    <button class="toggle-btn ${shapeMode==='3d'?'active':''}" data-mode="3d">3D</button>
  </div>`;
  let list;
  if (shapeMode==='3d'){
    list = SHAPES_3D.map(s => `<button class="tile" data-shape3d="${s.id}">${svg('shapes')}<span>${s.label}</span></button>`).join('');
  } else {
    list = [['freehand','Freehand'],['shapedrag','Shape Drag'],['p2p','P2P']]
      .map(([id,label]) => `<button class="tile" data-shape2d="${id}">${svg('shapes')}<span>${label}</span></button>`).join('');
  }
  menuScroll.innerHTML = toggle + list;
  menuScroll.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => { shapeMode=b.dataset.mode; renderAddShapeFlow(); }));
  menuScroll.querySelectorAll('[data-shape3d]').forEach(b => b.addEventListener('click', () => {
    const def = SHAPES_3D.find(s=>s.id===b.dataset.shape3d);
    const l = activeLayer();
    const rec = insertShape(l.id, def.id, def.fields);
    activeShapeId = rec.id;
    refreshShapeVisuals();
    showToast(`${def.label} added`);
    resetView('shapePanel');
  }));
  menuScroll.querySelectorAll('[data-shape2d]').forEach(b => b.addEventListener('click', () => {
    showToast('2D drawing tools are coming in a future update');
  }));
}

/* ---- SHAPE PANEL: pinned tile + 5 action buttons ---- */
const ACTIONS = [
  { id:'select', label:'Select', icon:'select' },
  { id:'move',   label:'Move',   icon:'move' },
  { id:'scale',  label:'Scale',  icon:'scale' },
  { id:'color',  label:'Color',  icon:'color' },
  { id:'delete', label:'Delete', icon:'trash' },
];
function renderShapePanel(){
  const l = activeLayer(), s = activeShape();
  if (!l || !s){ resetView('home'); return; }
  setH2(`${s.geomId} #${s.num}`, `${l.name}`);
  menuScroll.innerHTML = `
    <div class="pinned-tile">
      <div class="swatch-fill" style="background:${s.color}"></div>
      <span class="pt-label">${s.geomId} #${s.num}</span>
    </div>
    <div class="action-row">
      ${ACTIONS.map(a => `<button data-action="${a.id}">${svg(a.icon)}<span>${a.label}</span></button>`).join('')}
    </div>
    <div id="subtoolSlot"></div>
  `;
  menuScroll.querySelectorAll('[data-action]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.action;
    if (id==='delete'){
      deleteShape(l.id, s.id);
      resetView('home');
      showToast('Shape deleted');
      return;
    }
    if (id==='select'){
      showToast('Tap any shape on the plate to select it \u2014 crosshair mode coming soon');
      return;
    }
    pushView('subtool', { tool:id });
  }));
}

/* ---- SUBTOOL: Move / Scale / Color, rendered under the pinned tile ---- */
function renderSubtool(tool){
  const l = activeLayer(), s = activeShape();
  if (!l || !s){ resetView('home'); return; }
  // repaint the pinned tile + action row first (stay visible), then this tool's controls
  setH2(tool[0].toUpperCase()+tool.slice(1), `${s.geomId} #${s.num}`);
  const slot = () => document.getElementById('subtoolSlot');
  renderShapePanelStatic(l, s, tool);
  if (tool==='move'){
    slot().innerHTML = stepperRow('X', s.mesh.position.x, -half, half) + stepperRow('Y', s.mesh.position.y, 0, PLATE_SIZE) + stepperRow('Z', s.mesh.position.z, -half, half);
    wireSteppers(['X','Y','Z'], (axis,val) => {
      if (axis==='X') s.mesh.position.x = val;
      if (axis==='Y') s.mesh.position.y = Math.max(0, val);
      if (axis==='Z') s.mesh.position.z = val;
      clampToPlate(s.mesh, true);
      renderSubtool('move');
    });
  } else if (tool==='scale'){
    slot().innerHTML = stepperRow('X', s.mesh.scale.x, 0.1, 10) + stepperRow('Y', s.mesh.scale.y, 0.1, 10) + stepperRow('Z', s.mesh.scale.z, 0.1, 10);
    wireSteppers(['X','Y','Z'], (axis,val) => {
      if (axis==='X') s.mesh.scale.x = val;
      if (axis==='Y') s.mesh.scale.y = val;
      if (axis==='Z') s.mesh.scale.z = val;
      clampToPlate(s.mesh, true);
      renderSubtool('scale');
    });
  } else if (tool==='color'){
    slot().innerHTML = `<div class="swatch-row">${SWATCHES.map(c=>`<div class="swatch ${s.color===c?'selected':''}" data-c="${c}" style="background:${c}"></div>`).join('')}</div>`;
    slot().querySelectorAll('[data-c]').forEach(sw => sw.addEventListener('click', () => {
      s.color = sw.dataset.c; refreshShapeVisuals(); renderSubtool('color');
    }));
  }
}
function renderShapePanelStatic(l, s, activeTool){
  menuScroll.innerHTML = `
    <div class="pinned-tile">
      <div class="swatch-fill" style="background:${s.color}"></div>
      <span class="pt-label">${s.geomId} #${s.num}</span>
    </div>
    <div class="action-row">
      ${ACTIONS.map(a => `<button data-action="${a.id}" class="${a.id===activeTool?'active':''}">${svg(a.icon)}<span>${a.label}</span></button>`).join('')}
    </div>
    <div id="subtoolSlot"></div>
  `;
  menuScroll.querySelectorAll('[data-action]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.action;
    if (id==='delete'){ deleteShape(l.id, s.id); resetView('home'); showToast('Shape deleted'); return; }
    if (id==='select'){ showToast('Tap any shape on the plate to select it \u2014 crosshair mode coming soon'); return; }
    viewStack[viewStack.length-1] = { v:'subtool', tool:id };
    render();
  }));
}
function stepperRow(axis, val, min, max){
  return `<div class="stepper-row" data-axis="${axis}">
    <span class="step-lbl">${axis}</span>
    <button data-step="-1">\u2212</button>
    <input type="number" value="${val.toFixed(2)}" data-min="${min}" data-max="${max}">
    <button data-step="1">+</button>
  </div>`;
}
function wireSteppers(axes, onChange){
  axes.forEach(axis => {
    const row = menuScroll.querySelector(`.stepper-row[data-axis="${axis}"]`);
    if (!row) return;
    const input = row.querySelector('input');
    const min = parseFloat(input.dataset.min), max = parseFloat(input.dataset.max);
    row.querySelectorAll('[data-step]').forEach(btn => btn.addEventListener('click', () => {
      const stepSize = axis==='X'||axis==='Y'||axis==='Z' ? (max>50?2.5:0.1) : 1;
      let v = parseFloat(input.value) + parseFloat(btn.dataset.step)*stepSize;
      v = Math.min(max, Math.max(min, v));
      onChange(axis, v);
    }));
    input.addEventListener('change', () => {
      let v = Math.min(max, Math.max(min, parseFloat(input.value)||0));
      onChange(axis, v);
    });
  });
}

/* ---- LAYERS LIST ---- */
function renderLayersList(){
  setH2('Layers', 'Tap Add, or tap a layer to enter it');
  menuScroll.innerHTML = `<button class="tile" id="addLayerBtn">${svg('add')}<span>Add</span></button>` +
    layers.map(l => `
      <div class="tile layer-tile-wrap" data-layer="${l.id}">
        ${svg('layers')}<span>${l.name}</span>
        <button class="layer-del" data-del="${l.id}">${svg('trash')}</button>
      </div>`).join('');
  document.getElementById('addLayerBtn').addEventListener('click', () => {
    const l = createLayer(); activeLayerId = l.id; activeShapeId = null;
    resetView('home');
  });
  menuScroll.querySelectorAll('[data-layer]').forEach(el => el.addEventListener('click', (e) => {
    if (e.target.closest('[data-del]')) return;
    activeLayerId = parseInt(el.dataset.layer,10); activeShapeId = null;
    refreshShapeVisuals();
    resetView('home');
  }));
  let armedId = null, armTimer = null;
  menuScroll.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = parseInt(btn.dataset.del,10);
    if (armedId !== id){
      menuScroll.querySelectorAll('.layer-del').forEach(b=>b.classList.remove('armed'));
      armedId = id; btn.classList.add('armed');
      clearTimeout(armTimer);
      armTimer = setTimeout(() => { armedId=null; btn.classList.remove('armed'); }, 3000);
    } else {
      clearTimeout(armTimer);
      showConfirm(`Delete this layer?`, () => {
        deleteLayer(id);
        renderLayersList();
      });
    }
  }));
}

/* ---- TOOLS HOME: Boolean, Select ---- */
function renderToolsHome(){
  setH2('Tools', 'Boolean and selection helpers');
  const totalShapes = layers.reduce((n,l)=>n+l.shapes.length,0);
  menuScroll.innerHTML = `
    <button class="tile" data-t="select">${svg('select')}<span>Select</span></button>
    <button class="tile" data-t="boolean" ${totalShapes<2?'disabled':''}>${svg('boolean')}<span>Boolean</span></button>
  `;
  menuScroll.querySelector('[data-t="select"]').addEventListener('click', () => {
    showToast('Tap any shape on the plate to select it \u2014 crosshair mode coming soon');
  });
  const boolBtn = menuScroll.querySelector('[data-t="boolean"]');
  if (boolBtn) boolBtn.addEventListener('click', () => {
    if (!activeShape()){ showToast('Select a shape first, then open Boolean'); return; }
    pushView('booleanPick');
  });
}
function renderBooleanPick(){
  const s = activeShape();
  setH2('Boolean', 'Pick a second shape, then an operation');
  const others = [];
  layers.forEach(l => l.shapes.forEach(sh => { if (!(l.id===activeLayerId && sh.id===activeShapeId)) others.push({l,sh}); }));
  let targetId = null;
  menuScroll.innerHTML = others.map(o => `<button class="tile" data-target="${o.l.id}:${o.sh.id}">${svg('shapes')}<span>${o.sh.geomId} #${o.sh.num}</span></button>`).join('') +
    `<div class="action-row" style="grid-template-columns:repeat(3,1fr)">
      <button data-op="union" disabled>${svg('boolean')}<span>Union</span></button>
      <button data-op="subtract" disabled>${svg('boolean')}<span>Subtract</span></button>
      <button data-op="intersect" disabled>${svg('boolean')}<span>Intersect</span></button>
    </div>`;
  menuScroll.querySelectorAll('[data-target]').forEach(b => b.addEventListener('click', () => {
    targetId = b.dataset.target;
    menuScroll.querySelectorAll('[data-target]').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');
    menuScroll.querySelectorAll('[data-op]').forEach(x=>x.disabled=false);
  }));
  menuScroll.querySelectorAll('[data-op]').forEach(b => b.addEventListener('click', () => {
    if (!targetId) return;
    const parts = targetId.split(':');
    const lid = parseInt(parts[0], 10), sid = parseFloat(parts[1]);
    runBoolean(b.dataset.op, lid, sid);
  }));
}
async function runBoolean(mode, targetLayerId, targetShapeId){
  const a = activeShape(), aLayer = activeLayer();
  const bLayer = findLayer(targetLayerId), b = bLayer ? bLayer.shapes.find(s=>s.id===targetShapeId) : null;
  if (!a || !b) return;
  try{
    const { Evaluator, Brush, ADDITION, SUBTRACTION, INTERSECTION } = await import('https://unpkg.com/three-bvh-csg@0.0.16/build/index.module.js');
    const opMap = { union:ADDITION, subtract:SUBTRACTION, intersect:INTERSECTION };
    a.mesh.updateMatrixWorld(); b.mesh.updateMatrixWorld();
    const brushA = new Brush(a.mesh.geometry.clone()); brushA.position.copy(a.mesh.position); brushA.scale.copy(a.mesh.scale); brushA.updateMatrixWorld();
    const brushB = new Brush(b.mesh.geometry.clone()); brushB.position.copy(b.mesh.position); brushB.scale.copy(b.mesh.scale); brushB.updateMatrixWorld();
    const evaluator = new Evaluator();
    const result = evaluator.evaluate(brushA, brushB, opMap[mode]);
    result.geometry.computeVertexNormals();
    const color = a.color;
    const mesh = new THREE.Mesh(result.geometry, new THREE.MeshStandardMaterial({ color, metalness:0.15, roughness:0.55 }));
    clampToPlate(mesh, false);
    attachOutline(mesh);
    scene.add(mesh);
    const rec = { id: Date.now()+Math.random(), num: aLayer.shapes.length, mesh, geomId:'Solid', fields:null, color };
    deleteShape(aLayer.id, a.id);
    deleteShape(bLayer.id, b.id);
    aLayer.shapes.push(rec);
    aLayer.shapes.forEach((s2,i)=>s2.num=i+1);
    activeLayerId = aLayer.id; activeShapeId = rec.id;
    refreshShapeVisuals();
    showToast(`${mode[0].toUpperCase()+mode.slice(1)} created`);
    resetView('shapePanel');
  } catch(err){
    console.error(err);
    showToast('Boolean tool could not load \u2014 check your connection and try again');
  }
}

/* ---- SETTINGS ---- */
function renderSettings(){
  setH2('Settings', `Plate fixed at ${PLATE_SIZE}\u00d7${PLATE_SIZE}mm, ${GRID_SQUARE}mm grid`);
  menuScroll.innerHTML = `
    <button class="tile" id="saveBtn">${svg('settings')}<span>Save Scene</span></button>
    <button class="tile" id="loadBtn">${svg('settings')}<span>Load Scene</span></button>
    <button class="tile" id="stlBtn">${svg('settings')}<span>Export STL</span></button>
  `;
  document.getElementById('saveBtn').addEventListener('click', () => { saveSceneJSON(); showToast('Scene saved'); });
  document.getElementById('loadBtn').addEventListener('click', () => showToast('Load Scene is coming in a future update'));
  document.getElementById('stlBtn').addEventListener('click', () => { exportSTL(); showToast('STL exported'); });
}

/* ---- HELP ---- */
function renderHelp(){
  setH2('Help', 'Every module in the app');
  menuScroll.innerHTML = MODULES.filter(m=>MODULE_ORDER.includes(m.id)).map(m => `<button class="tile" disabled>${svg(m.icon)}<span>${m.label}</span></button>`).join('');
}

/* =====================================================================
   CONFIRM POPUP (Yes/No)
   ===================================================================== */
const confirmOverlay = document.createElement('div');
confirmOverlay.id = 'confirmOverlay'; confirmOverlay.classList.add('hidden');
confirmOverlay.innerHTML = `<div class="confirm-box"><p id="confirmMsg"></p><div class="confirm-row"><button class="confirm-no" id="confirmNo">No</button><button class="confirm-yes" id="confirmYes">Yes</button></div></div>`;
document.getElementById('main').appendChild(confirmOverlay);
function showConfirm(msg, onYes){
  document.getElementById('confirmMsg').textContent = msg;
  confirmOverlay.classList.remove('hidden');
  const yes = document.getElementById('confirmYes'), no = document.getElementById('confirmNo');
  const cleanup = () => { confirmOverlay.classList.add('hidden'); yes.replaceWith(yes.cloneNode(true)); no.replaceWith(no.cloneNode(true)); };
  document.getElementById('confirmYes').addEventListener('click', () => { cleanup(); onYes(); });
  document.getElementById('confirmNo').addEventListener('click', cleanup);
}

/* =====================================================================
   EXPORT
   ===================================================================== */
function exportSTL(){
  const meshes = []; layers.forEach(l=>l.shapes.forEach(s=>meshes.push(s.mesh)));
  if (!meshes.length){ showToast('Nothing to export'); return; }
  const group = new THREE.Group();
  meshes.forEach(m => { const c = m.clone(); c.remove(...c.children); group.add(c); });
  const exporter = new STLExporter();
  const result = exporter.parse(group, { binary:true });
  downloadBlob(new Blob([result], {type:'application/octet-stream'}), 'stl-maker-model.stl');
}
function saveSceneJSON(){
  const data = layers.map(l => ({ name:l.name, shapes: l.shapes.map(s => ({
    geomId:s.geomId, fields:s.fields, color:s.color,
    position:s.mesh.position.toArray(), scale:s.mesh.scale.toArray(),
  })) }));
  downloadBlob(new Blob([JSON.stringify(data, null, 2)], {type:'application/json'}), 'stl-maker-scene.json');
}
function downloadBlob(blob, filename){
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
}

/* =====================================================================
   TOAST
   ===================================================================== */
let toastTimer = null;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 1800);
}

/* =====================================================================
   INIT
   ===================================================================== */
renderH1();
resetView('home');
