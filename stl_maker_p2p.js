import * as THREE from 'three';
import { SWATCHES } from './stl_maker_data.js';
import { S } from './stl_maker_state.js';
import { armUndo, menuScroll, setH2 } from './stl_maker_h2.js';
import { svg } from './stl_maker_icons.js';
import { goToP2PFillPick, goToP2POptions, goToShape } from './stl_maker_navigation.js';
import { plateHit } from './stl_maker_plate_hit.js';
import { render } from './stl_maker_render.js';
import { GRID_SQUARE, canvas, scene } from './stl_maker_three.js';
import { activeLayer, createLayer, refreshShapeVisuals } from './stl_maker_layer_data.js';
import { attachOutline, clampToPlate, geometryDimensions, storeDimensions } from './stl_maker_geometry.js';
import { showToast } from './stl_maker_toast.js';
import { buildDragGeometry } from './stl_maker_drag_geometry.js';


/* ─────────────────────────────────────────────────────────────
   P2P
───────────────────────────────────────────────────────────── */

const P2P_SHAPES=[
  'rectangle',
  'square',
  'circle',
  'triangle',
  'octagon',
  'oval'
];

const LINE_TYPES=[
  ['straight','Straight'],
  ['arc','Arc'],
  ['wave','Wave']
];


export function renderP2PHome(){

  setH2(
    'Place two points, then choose what to create'
  );

  menuScroll.innerHTML=`
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

  S.crumbs=[
    'Drawing Tools',
    'P2P',
    'Line'
  ];

  S.crumbBack=
    () => goToP2POptions();

  S.pendingP2P={
    type:'line',
    points:[]
  };

  startP2PPointCapture();
}


function startP2PShapeCapture(){

  S.crumbs=[
    'Drawing Tools',
    'P2P',
    'Shape'
  ];

  S.crumbBack=
    () => goToP2POptions();

  S.pendingP2P={
    type:'shape',
    points:[]
  };

  startP2PPointCapture();
}


function startP2PPointCapture(){

  setH2(
    'Tap the first point, then the second point'
  );

  menuScroll.innerHTML=`
    <div style="
      padding:14px 6px;
      color:var(--muted);
      font-size:11px;
      text-align:center;
      max-width:220px;">
      ${
        S.pendingP2P &&
        S.pendingP2P.type==='line'
          ? 'Place two endpoints.'
          : 'Place two opposite corners.'
      }
    </div>
  `;


  function onUp(e){

    const p=
      plateHit(
        e.clientX,
        e.clientY
      );

    if(!p)
      return;

    const point=
      p.clone();

    point.z=0;

    S.pendingP2P.points.push(
      point
    );


    if(
      S.pendingP2P.points.length>=2
    ){

      cleanup();

      if(
        S.pendingP2P.type==='line'
      )
        render(
          'p2pLineOptions'
        );
      else
        render(
          'p2pShapeOptions'
        );

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


export function renderP2PLineOptions(){

  setH2(
    'Choose how the two points connect'
  );

  menuScroll.innerHTML=`
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
    .querySelectorAll(
      '[data-line]'
    )
    .forEach(
      el => {

        el.addEventListener(
          'click',
          () =>
            createP2PLine(
              el.dataset.line
            )
        );
      }
    );
}


export function renderP2PShapeOptions(){

  setH2(
    'Choose the shape between the two points'
  );

  menuScroll.innerHTML=`
    <div class="tile-row">
      ${
        P2P_SHAPES.map(
          k => `
            <div
              class="tile3"
              data-pshape="${k}">
              ${svg('shapes')}
              <span>${
                k[0].toUpperCase()+
                k.slice(1)
              }</span>
            </div>
          `
        ).join('')
      }
    </div>
  `;


  menuScroll
    .querySelectorAll(
      '[data-pshape]'
    )
    .forEach(
      el => {

        el.addEventListener(
          'click',
          () =>
            goToP2PFillPick(
              el.dataset.pshape
            )
        );
      }
    );
}


export function renderP2PFillPick(
  shapeKey
){

  setH2(
    'Filled or hollow'
  );

  menuScroll.innerHTML=`
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
    .querySelectorAll(
      '[data-fill]'
    )
    .forEach(
      el => {

        el.addEventListener(
          'click',
          () =>
            createP2PShape(
              shapeKey,
              el.dataset.fill==='hollow'
            )
        );
      }
    );
}


function makeP2PCurve(
  p1,
  p2,
  type
){

  if(type==='straight')
    return new THREE.LineCurve3(
      p1,
      p2
    );


  const dx=
    p2.x-p1.x;

  const dy=
    p2.y-p1.y;

  const length=
    Math.sqrt(
      dx*dx+dy*dy
    );

  if(length<.001)
    return null;


  const nx=
    -dy/length;

  const ny=
    dx/length;

  const offset=
    Math.min(
      15,
      Math.max(
        5,
        length*.25
      )
    );


  if(type==='arc'){

    const mid=
      p1.clone()
        .lerp(p2,.5);

    mid.x+=nx*offset;
    mid.y+=ny*offset;

    return new THREE.QuadraticBezierCurve3(
      p1,
      mid,
      p2
    );
  }


  const points=[];

  for(
    let i=0;
    i<=24;
    i++
  ){

    const t=i/24;

    const base=
      p1.clone()
        .lerp(p2,t);

    const wave=
      Math.sin(
        t*Math.PI*4
      )*
      Math.min(
        5,
        Math.max(
          2,
          length*.08
        )
      );

    base.x+=nx*wave;
    base.y+=ny*wave;

    points.push(base);
  }

  return new THREE.CatmullRomCurve3(
    points
  );
}


function createP2PLine(
  type
){

  if(
    !S.pendingP2P ||
    S.pendingP2P.points.length<2
  )
    return;

  const p1=
    S.pendingP2P.points[0];

  const p2=
    S.pendingP2P.points[1];

  const curve=
    makeP2PCurve(
      p1,
      p2,
      type
    );

  if(!curve)
    return;

  const active=
    activeLayer();

  if(!active)
    return;


  let mesh;


  if(S.shapeMode==='2d'){

    const points=
      curve.getPoints(
        type==='straight'
          ? 1
          : 32
      );

    mesh=
      new THREE.Line(
        new THREE.BufferGeometry()
          .setFromPoints(
            points
          ),
        new THREE.LineBasicMaterial({
          color:SWATCHES[0]
        })
      );

  }else{

    mesh=
      new THREE.Mesh(
        new THREE.TubeGeometry(
          curve,
          type==='straight'
            ? 1
            : 32,
          .8,
          8,
          false
        ),
        new THREE.MeshBasicMaterial({
          color:SWATCHES[0]
        })
      );

    attachOutline(mesh);
  }


  scene.add(mesh);


  const rec={
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
    color:SWATCHES[0],
    baseDimensions:
      storeDimensions(mesh)
  };


  active.shapes.push(rec);

  S.activeShapeId=rec.id;

  armUndo(
    active.id,
    rec.id
  );

  refreshShapeVisuals();

  S.pendingP2P=null;

  showToast(
    `${type[0].toUpperCase()+type.slice(1)} line created`
  );

  goToShape();
}


async function createP2PShape(
  shapeKey,
  hollow
){

  if(
    !S.pendingP2P ||
    S.pendingP2P.points.length<2
  )
    return;


  if(!activeLayer()){

    const l=
      createLayer();

    S.activeLayerId=l.id;
  }


  const active=
    activeLayer();

  const p1=
    S.pendingP2P.points[0];

  const p2=
    S.pendingP2P.points[1];


  const width=
    Math.max(
      GRID_SQUARE,
      Math.abs(
        p2.x-p1.x
      )
    );

  const length=
    Math.max(
      GRID_SQUARE,
      Math.abs(
        p2.y-p1.y
      )
    );

  const size=
    Math.max(
      width,
      length
    );


  let outerGeo;


  if(S.shapeMode==='2d'){

    if(shapeKey==='rectangle'){

      outerGeo=
        new THREE.PlaneGeometry(
          width,
          length
        );

    }else if(
      shapeKey==='square'
    ){

      const side=
        Math.max(
          width,
          length
        );

      outerGeo=
        new THREE.PlaneGeometry(
          side,
          side
        );

    }else{

      outerGeo=
        buildDragGeometry(
          shapeKey,
          size
        );
    }

  }else{

    outerGeo=
      buildDragGeometry(
        shapeKey,
        size
      );
  }


  let finalGeo=outerGeo;


  if(hollow){

    try{

      const {
        Evaluator,
        Brush,
        SUBTRACTION
      }=
        await import(
          'https://unpkg.com/three-bvh-csg@0.0.16/build/index.module.js'
        );


      const wallRatio=.6;

      const innerGeo=
        buildDragGeometry(
          shapeKey,
          size*wallRatio
        );


      const brushA=
        new Brush(
          outerGeo
        );

      brushA.updateMatrixWorld();


      const brushB=
        new Brush(
          innerGeo
        );

      brushB.updateMatrixWorld();


      const evaluator=
        new Evaluator();


      const result=
        evaluator.evaluate(
          brushA,
          brushB,
          SUBTRACTION
        );


      result.geometry
        .computeVertexNormals();

      finalGeo=
        result.geometry;

    }catch(err){

      console.error(err);

      showToast(
        'Hollow tool could not load — placed filled instead'
      );
    }
  }


  const mesh=
    new THREE.Mesh(
      finalGeo,
      new THREE.MeshBasicMaterial({
        color:SWATCHES[0]
      })
    );


  /*
    P2P placement remains based on
    its two selected points.
  */

  mesh.position.set(
    (p1.x+p2.x)/2,
    (p1.y+p2.y)/2,
    S.shapeMode==='3d'
      ? geometryDimensions(mesh).z/2
      : 0
  );


  clampToPlate(
    mesh,
    false
  );

  attachOutline(mesh);

  scene.add(mesh);


  const rec={
    id:Date.now()+Math.random(),
    num:active.shapes.length+1,
    mesh,
    geomId:shapeKey,
    fields:{
      W:width,
      L:length,
      H:
        S.shapeMode==='3d'
          ? geometryDimensions(mesh).z
          : 0,
      hollow
    },
    color:SWATCHES[0],
    baseDimensions:
      storeDimensions(mesh)
  };


  active.shapes.push(rec);

  S.activeShapeId=rec.id;

  armUndo(
    active.id,
    rec.id
  );

  refreshShapeVisuals();

  S.pendingP2P=null;

  showToast(
    `${hollow?'Hollow':'Filled'} ${shapeKey} placed`
  );

  goToShape();
}
