import * as THREE from 'three';
import { S } from './stl_maker_state.js';
import { camera, canvas } from './stl_maker_three.js';
import { plateHit } from './stl_maker_plate_hit.js';
import { activeShape, refreshShapeVisuals } from './stl_maker_layer_data.js';
import { setH2 } from './stl_maker_h2.js';
import { clampToPlate } from './stl_maker_geometry.js';
import { showToast } from './stl_maker_toast.js';


/* ─────────────────────────────────────────────────────────────
   OBJECT MANIPULATION
───────────────────────────────────────────────────────────── */


const moveCursor=
  document.createElement(
    'div'
  );

moveCursor.id='moveCursor';

moveCursor.innerHTML=
  '<span>➤</span>';

document
  .getElementById('plate')
  .appendChild(
    moveCursor
  );


const CURSOR_OFFSET_X=30;
const CURSOR_OFFSET_Y=42;


export function setAxis(axis){

  S.selectedAxis=axis;

  document
    .querySelectorAll(
      '.step-lbl[data-axis]'
    )
    .forEach(
      b =>
        b.classList.toggle(
          'axis-active',
          b.dataset.axis===axis
        )
    );
}


export function currentIncrement(){

  return S.mmState==='2.5'
    ? 2.5
    : 5;
}


function updateMoveCursor(
  clientX,
  clientY
){

  const rect=
    canvas.getBoundingClientRect();

  moveCursor.style.left=
    (
      clientX-
      rect.left-
      CURSOR_OFFSET_X
    )+'px';

  moveCursor.style.top=
    (
      clientY-
      rect.top-
      CURSOR_OFFSET_Y
    )+'px';
}


function cursorWorldPoint(
  clientX,
  clientY
){

  return plateHit(
    clientX-CURSOR_OFFSET_X,
    clientY-CURSOR_OFFSET_Y
  );
}


function beginMove(){

  const s=
    activeShape();

  if(!s)
    return;


  cleanupManipulation();

  S.manipulationActive=true;

  moveCursor.style.display=
    'block';

  setH2(
    'Press and drag the cursor to move the selected object'
  );


  let dragging=false;
  let pointerId=null;
  let startFingerX=0;
  let startFingerY=0;
  let startPosition=
    s.mesh.position.clone();

  let startCursorPoint=null;

  let zPlane=null;


  function onDown(e){

    pointerId=e.pointerId;

    startFingerX=e.clientX;
    startFingerY=e.clientY;

    updateMoveCursor(
      e.clientX,
      e.clientY
    );

    const cp=
      cursorWorldPoint(
        e.clientX,
        e.clientY
      );

    if(!cp)
      return;


    dragging=true;

    startPosition=
      s.mesh.position.clone();

    startCursorPoint=
      cp.clone();


    if(
      S.shapeMode==='3d' &&
      S.selectedAxis==='Z'
    ){

      const normal=
        new THREE.Vector3();

      camera.getWorldDirection(
        normal
      );

      zPlane=
        new THREE.Plane()
          .setFromNormalAndCoplanarPoint(
            normal,
            s.mesh.position
          );
    }


    canvas.setPointerCapture(
      e.pointerId
    );

    e.preventDefault();
  }


  function onMove(e){

    updateMoveCursor(
      e.clientX,
      e.clientY
    );

    if(!dragging)
      return;


    let cp=
      cursorWorldPoint(
        e.clientX,
        e.clientY
      );


    if(!cp)
      return;


    if(
      S.shapeMode==='3d' &&
      S.selectedAxis==='Z'
    ){

      const rect=
        canvas.getBoundingClientRect();

      const x=
        ((e.clientX-rect.left)/
          rect.width)*2-1;

      const y=
        -((e.clientY-rect.top)/
          rect.height)*2+1;

      const r=
        new THREE.Raycaster();

      r.setFromCamera(
        new THREE.Vector2(
          x,
          y
        ),
        camera
      );

      const hit=
        new THREE.Vector3();

      if(
        !r.ray.intersectPlane(
          zPlane,
          hit
        )
      )
        return;

      cp=hit;
    }


    const dx=
      cp.x-startCursorPoint.x;

    const dy=
      cp.y-startCursorPoint.y;

    const dz=
      cp.z-startCursorPoint.z;


    if(S.selectedAxis==='X'){

      s.mesh.position.x=
        startPosition.x+dx;

    }else if(
      S.selectedAxis==='Y'
    ){

      s.mesh.position.y=
        startPosition.y+dy;

    }else if(
      S.selectedAxis==='Z'
    ){

      if(S.shapeMode==='3d'){

        s.mesh.position.z=
          startPosition.z+dz;

      }
    }


    clampToPlate(
      s.mesh,
      true
    );

    refreshShapeVisuals();
  }


  function onUp(){

    dragging=false;

    if(pointerId!==null){

      try{
        canvas.releasePointerCapture(
          pointerId
        );
      }catch(_){}
    }

    showToast(
      'Object moved'
    );
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

    moveCursor.style.display=
      'none';

    S.manipulationActive=false;

    if(
      S.manipulationCleanup===
      cleanup
    )
      S.manipulationCleanup=null;
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

  S.manipulationCleanup=
    cleanup;
}


export function beginRotate(){

  const s=
    activeShape();

  if(!s)
    return;


  cleanupManipulation();

  S.manipulationActive=true;

  moveCursor.style.display=
    'block';

  setH2(
    'Press and drag to rotate the selected object'
  );


  let dragging=false;
  let pointerId=null;
  let startAngle=0;
  let startRotation=
    s.mesh.rotation.clone();


  function screenAngle(
    clientX,
    clientY
  ){

    const rect=
      canvas.getBoundingClientRect();

    const center=
      s.mesh.position.clone()
        .project(camera);

    const cx=
      rect.left+
      (center.x+1)*
      rect.width/2;

    const cy=
      rect.top+
      (1-center.y)*
      rect.height/2;

    return Math.atan2(
      clientY-cy,
      clientX-cx
    );
  }


  function onDown(e){

    pointerId=e.pointerId;

    updateMoveCursor(
      e.clientX,
      e.clientY
    );

    startAngle=
      screenAngle(
        e.clientX,
        e.clientY
      );

    startRotation=
      s.mesh.rotation.clone();

    dragging=true;

    canvas.setPointerCapture(
      e.pointerId
    );

    e.preventDefault();
  }


  function onMove(e){

    updateMoveCursor(
      e.clientX,
      e.clientY
    );

    if(!dragging)
      return;


    const angle=
      screenAngle(
        e.clientX,
        e.clientY
      );

    let delta=
      angle-startAngle;


    while(delta>Math.PI)
      delta-=Math.PI*2;

    while(delta<-Math.PI)
      delta+=Math.PI*2;


    if(S.selectedAxis==='X'){

      s.mesh.rotation.x=
        startRotation.x+delta;

    }else if(
      S.selectedAxis==='Y'
    ){

      s.mesh.rotation.y=
        startRotation.y+delta;

    }else if(
      S.selectedAxis==='Z'
    ){

      s.mesh.rotation.z=
        startRotation.z+delta;
    }

    refreshShapeVisuals();
  }


  function onUp(){

    dragging=false;

    if(pointerId!==null){

      try{
        canvas.releasePointerCapture(
          pointerId
        );
      }catch(_){}
    }

    showToast(
      'Object rotated'
    );
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

    moveCursor.style.display=
      'none';

    S.manipulationActive=false;

    if(
      S.manipulationCleanup===
      cleanup
    )
      S.manipulationCleanup=null;
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

  S.manipulationCleanup=
    cleanup;
}


function cleanupManipulation(){

  if(S.manipulationCleanup){

    S.manipulationCleanup();

    S.manipulationCleanup=null;
  }
}
