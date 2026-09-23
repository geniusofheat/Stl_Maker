/* STL Maker subsystem — generated from stl_maker_engine2.js */

function renderDrawingToolsHome(){

  if(!layers.length){

    const l=
      createLayer();

    activeLayerId=l.id;
  }

  const active=
    activeLayer();

  setH2(
    'Pick a drawing method'
  );


  const activeLayerTile=`
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


  menuScroll.innerHTML=`
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

        if(
          e.target.closest(
            '[data-del-tool]'
          )
        )
          return;

        activeModule='layers';

        goToLayer();
      }
    );


  menuScroll
    .querySelector(
      '[data-dt="freehand"]'
    )
    .addEventListener(
      'click',
      startFreehand
    );


  menuScroll
    .querySelector(
      '[data-dt="shapedrag"]'
    )
    .addEventListener(
      'click',
      () => {

        crumbs=[
          'Drawing Tools',
          'Shape'
        ];

        crumbBack=
          () =>
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



const DIVISIONS={
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


function renderDrawShapePick(){

  setH2(
    'Pick a shape to divide, or use it whole'
  );

  menuScroll.innerHTML=`
    <div class="tile-row">
      ${
        Object.keys(DIVISIONS)
          .map(
            k => `
              <div
                class="tile3"
                data-dshape="${k}">
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
      '[data-dshape]'
    )
    .forEach(
      el => {

        el.addEventListener(
          'click',
          () => {

            const key=
              el.dataset.dshape;

            crumbs=[
              'Drawing Tools',
              key[0].toUpperCase()+
              key.slice(1)
            ];

            crumbBack=
              () =>
                goToDrawingTools();

            startDragToSize(
              key
            );
          }
        );
      }
    );
}

function plateHit(
  clientX,
  clientY,
  plane=dragGroundPlane
){

  const rect=
    canvas.getBoundingClientRect();

  ndc.x=
    ((clientX-rect.left)/
      rect.width)*2-1;

  ndc.y=
    -((clientY-rect.top)/
      rect.height)*2+1;

  raycaster.setFromCamera(
    ndc,
    camera
  );

  const pt=
    new THREE.Vector3();

  if(
    !raycaster.ray.intersectPlane(
      plane,
      pt
    )
  )
    return null;

  return pt;
}

function buildDragGeometry(
  shapeKey,
  sizeMM
){

  const H=
    Math.max(
      GRID_SQUARE,
      15
    );


  if(shapeMode==='2d'){

    if(shapeKey==='circle')
      return new THREE.CircleGeometry(
        sizeMM/2,
        64
      );

    if(shapeKey==='square')
      return new THREE.PlaneGeometry(
        sizeMM,
        sizeMM
      );

    if(shapeKey==='rectangle')
      return new THREE.PlaneGeometry(
        sizeMM,
        sizeMM*.5
      );

    if(shapeKey==='triangle')
      return polygonGeometry(
        3,
        sizeMM/2
      );

    if(shapeKey==='octagon')
      return polygonGeometry(
        8,
        sizeMM/2
      );

    if(shapeKey==='oval'){

      const g=
        new THREE.CircleGeometry(
          sizeMM/2,
          64
        );

      g.scale(
        1,
        .6,
        1
      );

      return g;
    }

    return new THREE.PlaneGeometry(
      sizeMM,
      sizeMM
    );
  }


  if(shapeKey==='circle')
    return new THREE.SphereGeometry(
      sizeMM/2,
      32,
      24
    );

  if(shapeKey==='square')
    return new THREE.BoxGeometry(
      sizeMM,
      sizeMM,
      sizeMM
    );

  if(shapeKey==='rectangle')
    return new THREE.BoxGeometry(
      sizeMM,
      sizeMM*.5,
      H
    );

  if(shapeKey==='triangle')
    return rotateGeometryToZ(
      new THREE.CylinderGeometry(
        sizeMM/2,
        sizeMM/2,
        H,
        3
      )
    );

  if(shapeKey==='octagon')
    return rotateGeometryToZ(
      new THREE.CylinderGeometry(
        sizeMM/2,
        sizeMM/2,
        H,
        8
      )
    );

  if(shapeKey==='oval'){

    const g=
      new THREE.SphereGeometry(
        sizeMM/2,
        32,
        24
      );

    g.scale(
      1,
      .6,
      1
    );

    return g;
  }

  return new THREE.BoxGeometry(
    sizeMM,
    sizeMM,
    H
  );
}

function startDragToSize(
  shapeKey
){

  setH2(
    'Press on the grid, drag to size, release'
  );

  menuScroll.innerHTML=`
    <div style="
      padding:14px 6px;
      color:var(--muted);
      font-size:11px;
      text-align:center;
      max-width:220px;">
      Dragging on the grid now sizes the
      ${shapeKey}...
    </div>
  `;


  let startPt=null;
  let previewMesh=null;


  function onDown(e){

    startPt=
      plateHit(
        e.clientX,
        e.clientY
      );

    if(!startPt)
      return;

    rotationLocked=true;

    controls.enableRotate=false;

    refreshLockBtn();
  }


  function onMove(e){

    if(!startPt)
      return;

    const cur=
      plateHit(
        e.clientX,
        e.clientY
      );

    if(!cur)
      return;

    const size=
      Math.max(
        GRID_SQUARE,
        startPt.distanceTo(cur)
      );


    if(previewMesh){

      scene.remove(
        previewMesh
      );

      previewMesh.geometry.dispose();

      previewMesh.material.dispose();
    }


    previewMesh=
      new THREE.Mesh(
        buildDragGeometry(
          shapeKey,
          size
        ),
        new THREE.MeshStandardMaterial({
          color:0xe0c48f,
          transparent:true,
          opacity:.55
        })
      );


    previewMesh.position.set(
      startPt.x,
      startPt.y,
      shapeMode==='3d'
        ? size/2
        : 0
    );

    clampToPlate(
      previewMesh,
      false
    );

    scene.add(
      previewMesh
    );
  }


  function onUp(e){

    if(!startPt){

      cleanup();

      return;
    }

    const cur=
      plateHit(
        e.clientX,
        e.clientY
      );

    if(!cur){

      cleanup();

      return;
    }


    let size=
      Math.max(
        GRID_SQUARE,
        startPt.distanceTo(cur)
      );

    size=
      Math.round(
        size/GRID_SQUARE
      )*GRID_SQUARE;


    if(previewMesh){

      scene.remove(
        previewMesh
      );

      previewMesh.geometry.dispose();
      previewMesh.material.dispose();

      previewMesh=null;
    }


    const active=
      activeLayer();

    if(!active){

      cleanup();

      return;
    }


    const mesh=
      new THREE.Mesh(
        buildDragGeometry(
          shapeKey,
          size
        ),
        new THREE.MeshStandardMaterial({
          color:SWATCHES[0],
          metalness:.15,
          roughness:.55
        })
      );


    /*
      New objects snap to the
      center of the grid.
    */

    mesh.position.set(
      0,
      0,
      shapeMode==='3d'
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
        size
      },
      color:SWATCHES[0],
      baseDimensions:
        storeDimensions(mesh)
    };


    active.shapes.push(rec);

    activeShapeId=
      rec.id;

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

function startFreehand(){

  setH2(
    'Press and hold on the grid, draw, then release'
  );

  menuScroll.innerHTML=`
    <div style="
      padding:14px 6px;
      color:var(--muted);
      font-size:11px;
      text-align:center;
      max-width:220px;">
      Draw directly on the grid with one finger.
    </div>
  `;


  let drawing=false;
  let points=[];


  function getPoint(e){

    const p=
      plateHit(
        e.clientX,
        e.clientY
      );

    if(!p)
      return null;

    if(shapeMode==='2d')
      p.z=0;
    else
      p.z=0;

    return p;
  }


  function onDown(e){

    const p=
      getPoint(e);

    if(!p)
      return;

    drawing=true;

    points=[p];

    rotationLocked=true;

    controls.enableRotate=false;

    refreshLockBtn();
  }


  function onMove(e){

    if(!drawing)
      return;

    const p=
      getPoint(e);

    if(!p)
      return;

    const last=
      points[
        points.length-1
      ];

    if(
      last &&
      last.distanceTo(p)<.8
    )
      return;

    points.push(p);
  }


  function onUp(){

    if(!drawing){

      cleanup();

      return;
    }

    drawing=false;


    if(points.length<2){

      cleanup();

      showToast(
        'Draw a longer path'
      );

      return;
    }


    const active=
      activeLayer();

    if(!active){

      cleanup();

      return;
    }


    let mesh;


    if(shapeMode==='2d'){

      const geo=
        new THREE.BufferGeometry()
          .setFromPoints(
            points
          );

      mesh=
        new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({
            color:SWATCHES[0]
          })
        );

    }else{

      const curve=
        new THREE.CatmullRomCurve3(
          points
        );

      const geo=
        new THREE.TubeGeometry(
          curve,
          Math.max(
            8,
            points.length*2
          ),
          .8,
          8,
          false
        );

      mesh=
        new THREE.Mesh(
          geo,
          new THREE.MeshStandardMaterial({
            color:SWATCHES[0],
            metalness:.15,
            roughness:.55
          })
        );

      attachOutline(mesh);
    }


    scene.add(mesh);


    const rec={
      id:Date.now()+Math.random(),
      num:active.shapes.length+1,
      mesh,
      geomId:'freehand',
      fields:{
        points:
          points.map(
            p => p.toArray()
          )
      },
      color:SWATCHES[0],
      baseDimensions:
        storeDimensions(mesh)
    };


    active.shapes.push(rec);

    activeShapeId=rec.id;

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

let pendingP2P=null;


function renderP2PHome(){

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

  crumbs=[
    'Drawing Tools',
    'P2P',
    'Line'
  ];

  crumbBack=
    () => goToP2POptions();

  pendingP2P={
    type:'line',
    points:[]
  };

  startP2PPointCapture();
}


function startP2PShapeCapture(){

  crumbs=[
    'Drawing Tools',
    'P2P',
    'Shape'
  ];

  crumbBack=
    () => goToP2POptions();

  pendingP2P={
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
        pendingP2P &&
        pendingP2P.type==='line'
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

    pendingP2P.points.push(
      point
    );


    if(
      pendingP2P.points.length>=2
    ){

      cleanup();

      if(
        pendingP2P.type==='line'
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


function renderP2PLineOptions(){

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


function renderP2PShapeOptions(){

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


function renderP2PFillPick(
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
    !pendingP2P ||
    pendingP2P.points.length<2
  )
    return;

  const p1=
    pendingP2P.points[0];

  const p2=
    pendingP2P.points[1];

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


  if(shapeMode==='2d'){

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
        new THREE.MeshStandardMaterial({
          color:SWATCHES[0],
          metalness:.15,
          roughness:.55
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

  activeShapeId=rec.id;

  armUndo(
    active.id,
    rec.id
  );

  refreshShapeVisuals();

  pendingP2P=null;

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
    !pendingP2P ||
    pendingP2P.points.length<2
  )
    return;


  if(!activeLayer()){

    const l=
      createLayer();

    activeLayerId=l.id;
  }


  const active=
    activeLayer();

  const p1=
    pendingP2P.points[0];

  const p2=
    pendingP2P.points[1];


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


  if(shapeMode==='2d'){

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
      new THREE.MeshStandardMaterial({
        color:SWATCHES[0],
        metalness:.15,
        roughness:.55
      })
    );


  /*
    P2P placement remains based on
    its two selected points.
  */

  mesh.position.set(
    (p1.x+p2.x)/2,
    (p1.y+p2.y)/2,
    shapeMode==='3d'
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
        shapeMode==='3d'
          ? geometryDimensions(mesh).z
          : 0,
      hollow
    },
    color:SWATCHES[0],
    baseDimensions:
      storeDimensions(mesh)
  };


  active.shapes.push(rec);

  activeShapeId=rec.id;

  armUndo(
    active.id,
    rec.id
  );

  refreshShapeVisuals();

  pendingP2P=null;

  showToast(
    `${hollow?'Hollow':'Filled'} ${shapeKey} placed`
  );

  goToShape();
}


