import * as THREE from 'three';
import { S } from './stl_maker_state.js';
import { camera, canvas } from './stl_maker_three.js';
import { activeShape, layers } from './stl_maker_layer_data.js';
import { raycaster, ndc } from './stl_maker_selection.js';
import { currentIncrement } from './stl_maker_object_manipulation.js';


/* ─────────────────────────────────────────────────────────────
   POINTS / SIDES
   Direct vertex editing for box-shaped objects (square, rectangle)
   and the two faces of a cone. Replaces the old "Select" action:
   pressing Points or Sides shows numbered H3 tiles; tapping a
   tile (or a white corner dot in the 3D view) selects a corner or
   a face, then Move + the axis buttons move just that part.

   Only square/rectangle (box) and cone shapes are supported —
   other shapes show a short explanation instead of tiles.
───────────────────────────────────────────────────────────── */

const EPS = .01;

function isBox(s){
  return s.geomId==='square' || s.geomId==='rectangle';
}

function isCone(s){
  return s.geomId==='cone';
}


/* ── one-time bake: turn the shape's current mesh.scale into real
   geometry, so editing one corner or face doesn't fight the old
   uniform-scale system. After this, mesh.scale is always 1,1,1
   and baseDimensions matches the live geometry. ── */

function bakeScale(s){

  const sc=s.mesh.scale;

  if(
    Math.abs(sc.x-1)<1e-6 &&
    Math.abs(sc.y-1)<1e-6 &&
    Math.abs(sc.z-1)<1e-6
  )
    return;

  const pos=
    s.mesh.geometry
      .attributes.position;

  for(let i=0;i<pos.count;i++){

    pos.setXYZ(
      i,
      pos.getX(i)*sc.x,
      pos.getY(i)*sc.y,
      pos.getZ(i)*sc.z
    );
  }

  pos.needsUpdate=true;

  s.mesh.geometry.computeVertexNormals();
  s.mesh.geometry.computeBoundingBox();

  s.mesh.scale.set(1,1,1);

  s.baseDimensions=null;
}


/* ── vertex groups, found by position rather than index, so this
   doesn't depend on three.js's internal vertex ordering ── */

function axisExtent(s, axis){

  if(!s.mesh.geometry.boundingBox)
    s.mesh.geometry.computeBoundingBox();

  const bb=s.mesh.geometry.boundingBox;

  return {
    min:bb.min[axis],
    max:bb.max[axis]
  };
}

const FACES={
  top:   {axis:'z', side:'max'},
  bottom:{axis:'z', side:'min'},
  left:  {axis:'y', side:'min'},
  right: {axis:'y', side:'max'},
  end5:  {axis:'x', side:'min'},
  end6:  {axis:'x', side:'max'}
};

export function faceAxisLetter(faceKey){
  return FACES[faceKey].axis.toUpperCase();
}

export function faceSideSign(faceKey){
  return FACES[faceKey].side==='max' ? 1 : -1;
}

const FACE_LABEL={
  top:'Top', bottom:'Bottom',
  left:'Left', right:'Right',
  end5:'End', end6:'End'
};

const FACE_NUM={
  top:1, bottom:2, left:3, right:4, end5:5, end6:6
};

const CORNERS=[
  [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
  [-1,-1,1], [1,-1,1], [1,1,1], [-1,1,1]
];


function vertexIndicesFor(s, test){

  const pos=
    s.mesh.geometry.attributes.position;

  const idx=[];

  for(let i=0;i<pos.count;i++){

    if(
      test(
        pos.getX(i),
        pos.getY(i),
        pos.getZ(i)
      )
    )
      idx.push(i);
  }

  return idx;
}

function faceVertexIndices(s, faceKey){

  const {axis,side}=FACES[faceKey];

  const ext=axisExtent(s,axis);

  const target=
    side==='max' ? ext.max : ext.min;

  return vertexIndicesFor(
    s,
    (x,y,z) =>
      Math.abs(
        {x,y,z}[axis]-target
      )<EPS
  );
}

function cornerVertexIndices(s, cornerNum){

  const [sx,sy,sz]=
    CORNERS[cornerNum-1];

  const ex=axisExtent(s,'x');
  const ey=axisExtent(s,'y');
  const ez=axisExtent(s,'z');

  const tx=sx<0 ? ex.min : ex.max;
  const ty=sy<0 ? ey.min : ey.max;
  const tz=sz<0 ? ez.min : ez.max;

  return vertexIndicesFor(
    s,
    (x,y,z) =>
      Math.abs(x-tx)<EPS &&
      Math.abs(y-ty)<EPS &&
      Math.abs(z-tz)<EPS
  );
}

export function cornerPosition(s, cornerNum){

  const idx=
    cornerVertexIndices(s,cornerNum);

  const pos=
    s.mesh.geometry.attributes.position;

  return new THREE.Vector3(
    pos.getX(idx[0]),
    pos.getY(idx[0]),
    pos.getZ(idx[0])
  );
}

// given a point in the mesh's own local space (e.g. from a raycast
// hit, converted with mesh.worldToLocal), decides whether it's closer
// to one of the 8 corners or to one of the 6 faces, for the extrude
// long-press gesture in stl_maker_drawing_tools.js
export function classifyLocalHit(s, local){

  const ex=axisExtent(s,'x');
  const ey=axisExtent(s,'y');
  const ez=axisExtent(s,'z');

  const size=
    Math.max(
      ex.max-ex.min,
      ey.max-ey.min,
      ez.max-ez.min
    );

  const CORNER_RADIUS=size*.22;

  let nearestCorner=null;
  let nearestDist=Infinity;

  for(let n=1;n<=8;n++){

    const p=cornerPosition(s,n);

    const d=p.distanceTo(local);

    if(d<nearestDist){
      nearestDist=d;
      nearestCorner=n;
    }
  }

  if(nearestDist<=CORNER_RADIUS)
    return {kind:'point', point:nearestCorner};

  const dists=[
    ['top',    Math.abs(local.z-ez.max)],
    ['bottom', Math.abs(local.z-ez.min)],
    ['left',   Math.abs(local.y-ey.min)],
    ['right',  Math.abs(local.y-ey.max)],
    ['end5',   Math.abs(local.x-ex.min)],
    ['end6',   Math.abs(local.x-ex.max)]
  ];

  dists.sort((a,b) => a[1]-b[1]);

  // near two face planes at once (one from x/y, one from z, or one from
  // x and one from y) means the hit is on the edge where they meet
  const EDGE_RADIUS=size*.18;

  const [f1,d1]=dists[0];
  const [f2,d2]=dists[1];

  if(d2<=EDGE_RADIUS){

    const edgeKey=
      Object.keys(EDGES).find(k => {

        const pair=EDGES[k];

        return (
          (pair[0]===f1 && pair[1]===f2) ||
          (pair[0]===f2 && pair[1]===f1)
        );
      });

    if(edgeKey)
      return {kind:'edge', edge:edgeKey};
  }

  return {kind:'face', face:f1};
}


const EDGES={
  'top-left':   ['top','left'],
  'top-right':  ['top','right'],
  'top-end5':   ['top','end5'],
  'top-end6':   ['top','end6'],
  'bottom-left':['bottom','left'],
  'bottom-right':['bottom','right'],
  'bottom-end5':['bottom','end5'],
  'bottom-end6':['bottom','end6'],
  'left-end5':  ['left','end5'],
  'left-end6':  ['left','end6'],
  'right-end5': ['right','end5'],
  'right-end6': ['right','end6']
};

export function edgeAxes(edgeKey){

  const [f1,f2]=EDGES[edgeKey];

  return [FACES[f1].axis,FACES[f2].axis];
}

function edgeVertexIndices(s, edgeKey){

  const [f1,f2]=EDGES[edgeKey];

  const set1=new Set(faceVertexIndices(s,f1));

  return faceVertexIndices(s,f2)
    .filter(i => set1.has(i));
}

export function edgePosition(s, edgeKey, axis){

  const [f1,f2]=EDGES[edgeKey];

  const key=
    FACES[f1].axis===axis ? f1 : f2;

  return facePosition(s,key);
}

export function moveEdge(s, edgeKey, axis, delta){

  bakeScale(s);

  const [f1,f2]=EDGES[edgeKey];

  const faceKey=
    FACES[f1].axis===axis ? f1 : f2;

  const opp=
    axisExtent(s,axis)[
      FACES[faceKey].side==='max' ? 'min' : 'max'
    ];

  let target=
    edgePosition(s,edgeKey,axis)+delta;

  target=
    FACES[faceKey].side==='max'
      ? Math.max(target,opp+MIN_GAP)
      : Math.min(target,opp-MIN_GAP);

  const idx=edgeVertexIndices(s,edgeKey);

  const pos=s.mesh.geometry.attributes.position;

  idx.forEach(i => {

    if(axis==='x') pos.setX(i,target);
    else if(axis==='y') pos.setY(i,target);
    else pos.setZ(i,target);
  });

  pos.needsUpdate=true;

  finishEdit(s);
}

function highlightEdge(s, edgeKey){

  clearHighlight(s);

  const idx=edgeVertexIndices(s,edgeKey);

  const pos=s.mesh.geometry.attributes.position;

  const a=new THREE.Vector3(
    pos.getX(idx[0]),pos.getY(idx[0]),pos.getZ(idx[0])
  );

  const b=new THREE.Vector3(
    pos.getX(idx[1]),pos.getY(idx[1]),pos.getZ(idx[1])
  );

  const mesh=
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([a,b]),
      new THREE.LineBasicMaterial({
        color:0x3a6fd8,
        linewidth:4,
        depthTest:false
      })
    );

  mesh.renderOrder=996;

  s.mesh.add(mesh);

  highlight=mesh;
}

export function selectEdge(s, edgeKey){

  S.selectedEdge=edgeKey;
  S.selectedFace=null;
  S.selectedPoint=null;

  refreshHighlight(s);
}


export function facePosition(s, faceKey){

  const {axis,side}=FACES[faceKey];

  const ext=axisExtent(s,axis);

  return side==='max' ? ext.max : ext.min;
}


/* ── moving ── */

const MIN_GAP=1; // never let two opposite faces cross / touch

export function moveFace(s, faceKey, delta){

  bakeScale(s);

  const {axis,side}=FACES[faceKey];

  const opp=
    axisExtent(s,axis)[
      side==='max' ? 'min' : 'max'
    ];

  let target=
    facePosition(s,faceKey)+delta;

  target=
    side==='max'
      ? Math.max(target,opp+MIN_GAP)
      : Math.min(target,opp-MIN_GAP);

  const idx=
    faceVertexIndices(s,faceKey);

  const pos=
    s.mesh.geometry.attributes.position;

  idx.forEach(i => {

    if(axis==='x')
      pos.setX(i,target);
    else if(axis==='y')
      pos.setY(i,target);
    else
      pos.setZ(i,target);
  });

  pos.needsUpdate=true;

  finishEdit(s);
}

export function movePoint(s, cornerNum, axis, delta){

  bakeScale(s);

  const idx=
    cornerVertexIndices(s,cornerNum);

  const pos=
    s.mesh.geometry.attributes.position;

  idx.forEach(i => {

    if(axis==='x')
      pos.setX(i,pos.getX(i)+delta);
    else if(axis==='y')
      pos.setY(i,pos.getY(i)+delta);
    else
      pos.setZ(i,pos.getZ(i)+delta);
  });

  pos.needsUpdate=true;

  finishEdit(s);
}

function finishEdit(s){

  s.mesh.geometry.computeVertexNormals();
  s.mesh.geometry.computeBoundingBox();

  s.baseDimensions=null;

  refreshCornerDots(s);
  refreshHighlight(s);
}


/* ── white corner-dot handles (always shown on the active shape) ── */

const DOT_SIZE=1.6;

function buildDots(s){

  clearDots(s);

  if(!isBox(s))
    return;

  s.__dots=[];

  for(let n=1;n<=8;n++){

    const dot=
      new THREE.Mesh(
        new THREE.SphereGeometry(DOT_SIZE,12,10),
        new THREE.MeshBasicMaterial({
          color:0xffffff,
          depthTest:false
        })
      );

    dot.renderOrder=997;
    dot.userData.cornerNum=n;
    dot.userData.shapeId=s.id;

    dot.position.copy(
      cornerPosition(s,n)
    );

    s.mesh.add(dot);

    s.__dots.push(dot);
  }
}

function refreshCornerDots(s){

  if(!s.__dots)
    return;

  s.__dots.forEach(dot => {

    dot.position.copy(
      cornerPosition(
        s,
        dot.userData.cornerNum
      )
    );
  });
}

function clearDots(s){

  if(!s.__dots)
    return;

  s.__dots.forEach(
    d => s.mesh.remove(d)
  );

  s.__dots=null;
}

export function showCornerDots(){

  const s=activeShape();

  // clear dots left on any other shape (e.g. switching shapes
  // while staying on the shape panel)
  layers.forEach(l =>
    l.shapes.forEach(other => {

      if(other!==s)
        clearDots(other);
    })
  );

  if(s && isBox(s))
    buildDots(s);
}

export function hideCornerDots(){

  const s=activeShape();

  if(s)
    clearDots(s);

  clearSelection();
}


// point/face selection is driven by the long-press gesture in
// stl_maker_drawing_tools.js (EXTRUDE section), not by tapping here


/* ── blue selection highlight ── */

let highlight=null;

function clearHighlight(s){

  if(highlight && s && s.mesh)
    s.mesh.remove(highlight);

  highlight=null;
}

function refreshHighlight(s){

  if(!s)
    return;

  if(S.selectedFace)
    highlightFace(s,S.selectedFace);
  else if(S.selectedEdge)
    highlightEdge(s,S.selectedEdge);
  else if(S.selectedPoint)
    highlightPoint(s,S.selectedPoint);
}

function highlightFace(s, faceKey){

  clearHighlight(s);

  const {axis}=FACES[faceKey];

  const ex=axisExtent(s,'x');
  const ey=axisExtent(s,'y');
  const ez=axisExtent(s,'z');

  const w = axis==='x' ? ey.max-ey.min : ex.max-ex.min;
  const h = axis==='z' ? ey.max-ey.min : ez.max-ez.min;

  const mesh=
    new THREE.Mesh(
      new THREE.PlaneGeometry(w,h),
      new THREE.MeshBasicMaterial({
        color:0x3a6fd8,
        transparent:true,
        opacity:.45,
        depthTest:false,
        side:THREE.DoubleSide
      })
    );

  mesh.renderOrder=996;

  const pos=facePosition(s,faceKey);

  if(axis==='x'){

    mesh.position.set(pos,(ey.min+ey.max)/2,(ez.min+ez.max)/2);
    mesh.rotation.y=Math.PI/2;

  }else if(axis==='y'){

    mesh.position.set((ex.min+ex.max)/2,pos,(ez.min+ez.max)/2);
    mesh.rotation.x=Math.PI/2;

  }else{

    mesh.position.set((ex.min+ex.max)/2,(ey.min+ey.max)/2,pos);
  }

  s.mesh.add(mesh);

  highlight=mesh;
}

function highlightPoint(s, cornerNum){

  clearHighlight(s);

  const mesh=
    new THREE.Mesh(
      new THREE.SphereGeometry(DOT_SIZE*1.6,12,10),
      new THREE.MeshBasicMaterial({
        color:0x3a6fd8,
        depthTest:false
      })
    );

  mesh.renderOrder=996;
  mesh.position.copy(cornerPosition(s,cornerNum));

  s.mesh.add(mesh);

  highlight=mesh;
}

function clearSelection(){

  const s=activeShape();

  S.selectedFace=null;
  S.selectedEdge=null;
  S.selectedPoint=null;

  clearHighlight(s);
}


/* ── H3 tile panels ── */

function unsupportedPanel(kind){

  return `
    <div class="stepper-stack">
      <div style="padding:10px;font-size:12px;color:var(--muted);line-height:1.5">
        ${kind} tiles aren't available for this shape yet — only
        boxes${kind==='Side'?' and cones':''} are supported so far.
      </div>
    </div>
  `;
}

function tileGridHtml(tiles){

  return `
    <div class="face-tile-grid">
      ${
        tiles.map(t => `
          <button class="face-tile" data-tile="${t.key}">
            ${t.label ? `<span class="ft-label">${t.label}</span>` : ''}
            <span class="ft-num">${t.num}</span>
            ${t.mm!=null ? `<span class="ft-mm">${t.mm}mm</span>` : ''}
          </button>
        `).join('')
      }
    </div>
  `;
}

export function renderSidesPanel(slot, s){

  if(isBox(s)){

    const tiles=
      Object.keys(FACES).map(key => ({
        key,
        label:FACE_LABEL[key],
        num:FACE_NUM[key],
        mm:Math.round(
          Math.abs(facePosition(s,key))
        )
      }));

    slot.innerHTML=tileGridHtml(tiles);

  }else if(isCone(s)){

    slot.innerHTML=
      tileGridHtml([
        {key:'top',label:'Top',num:1,mm:null},
        {key:'bottom',label:'Bottom',num:2,mm:null}
      ]);

  }else{

    slot.innerHTML=unsupportedPanel('Side');

    return;
  }

  slot
    .querySelectorAll('[data-tile]')
    .forEach(b =>
      b.addEventListener('click',() => {

        selectFace(s,b.dataset.tile);

        renderSidesPanel(slot,s);

        scrollSelectedIntoView(slot);
      })
    );

  markSelectedTile(slot);

  if(S.selectedFace && isBox(s))
    showAxisEditor(slot,s,'face');
  else if(S.selectedFace){

    const note=
      document.createElement('div');

    note.style.cssText=
      'padding:8px;font-size:11px;color:var(--muted)';

    note.textContent=
      'Moving cone faces isn\'t supported yet — selection only, for now.';

    slot.appendChild(note);
  }
}

export function renderPointsPanel(slot, s){

  if(!isBox(s)){

    slot.innerHTML=unsupportedPanel('Point');

    return;
  }

  const tiles=[];

  for(let n=1;n<=8;n++)
    tiles.push({key:String(n),num:n,mm:null});

  slot.innerHTML=tileGridHtml(tiles);

  slot
    .querySelectorAll('[data-tile]')
    .forEach(b =>
      b.addEventListener('click',() => {

        selectPoint(s,Number(b.dataset.tile));

        renderPointsPanel(slot,s);

        scrollSelectedIntoView(slot);
      })
    );

  markSelectedTile(slot);

  if(S.selectedPoint)
    showAxisEditor(slot,s,'point');
}

function markSelectedTile(slot){

  const key=
    S.selectedFace ||
    (S.selectedPoint ? String(S.selectedPoint) : null);

  slot
    .querySelectorAll('[data-tile]')
    .forEach(b =>
      b.classList.toggle(
        'ft-active',
        b.dataset.tile===key
      )
    );
}

function scrollSelectedIntoView(slot){

  const active=
    slot.querySelector('.ft-active');

  if(active)
    active.scrollIntoView({
      block:'nearest'
    });
}

export function selectFace(s, faceKey){

  S.selectedFace=faceKey;
  S.selectedPoint=null;

  refreshHighlight(s);
}

export function selectPoint(s, cornerNum){

  S.selectedPoint=cornerNum;
  S.selectedFace=null;

  refreshHighlight(s);
}


/* ── the Move + axis-button editor for whatever is selected ── */

function showAxisEditor(slot, s, kind){

  const wrap=
    document.createElement('div');

  wrap.className='face-move-editor';

  wrap.innerHTML=
    `<div class="ft-editor-label">Move</div>`;

  slot.appendChild(wrap);

  const axes=['X','Y','Z'];

  const stack=
    document.createElement('div');

  stack.className='stepper-stack';

  wrap.appendChild(stack);

  axes.forEach(axis => {

    const row=
      document.createElement('div');

    row.className='stepper-row';

    const current=
      kind==='point'
        ? cornerPosition(
            s,S.selectedPoint
          )[axis.toLowerCase()]
        : facePosition(
            s,
            axisOfFace(S.selectedFace)===axis.toLowerCase()
              ? S.selectedFace
              : null
          );

    const showValue=
      kind==='point' ||
      axisOfFace(S.selectedFace)===axis.toLowerCase();

    row.innerHTML=`
      <div class="value-button ${!showValue?'ft-dim':''}">
        <b class="ax">${axis}</b>
        <span>${
          showValue
            ? Number(current).toFixed(1)+' mm'
            : '—'
        }</span>
      </div>
      <div class="step-btns">
        <button data-axis="${axis.toLowerCase()}" data-step="-1" ${!showValue?'disabled':''}>−</button>
        <button data-axis="${axis.toLowerCase()}" data-step="1" ${!showValue?'disabled':''}>+</button>
      </div>
    `;

    stack.appendChild(row);
  });

  wrap
    .querySelectorAll('[data-step]')
    .forEach(btn =>
      btn.addEventListener('click',() => {

        const step=
          currentIncrement()*
          parseFloat(btn.dataset.step);

        if(kind==='point'){

          movePoint(
            s,
            S.selectedPoint,
            btn.dataset.axis,
            step
          );

        }else if(
          axisOfFace(S.selectedFace)===
          btn.dataset.axis
        ){

          moveFace(
            s,
            S.selectedFace,
            step*
            (FACES[S.selectedFace].side==='max'?1:-1)
          );
        }

        if(S.__pointsSidesRefresh)
          S.__pointsSidesRefresh();
      })
    );
}

function axisOfFace(faceKey){

  return faceKey ? FACES[faceKey].axis : null;
}


/* called once when the shape panel opens on a shape, and again
   whenever it re-renders */
export function refreshPointsSidesUI(){

  const s=activeShape();

  if(s)
    refreshCornerDots(s);
}
