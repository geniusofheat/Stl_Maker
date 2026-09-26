import * as THREE from 'three';
import { SWATCHES } from './stl_maker_data.js';
import { S } from './stl_maker_state.js';
import { armUndo, menuScroll, setH2 } from './stl_maker_h2.js';
import { plateHit } from './stl_maker_plate_hit.js';
import { canvas, controls, refreshLockBtn, scene } from './stl_maker_three.js';
import { showToast } from './stl_maker_toast.js';
import { activeLayer, refreshShapeVisuals } from './stl_maker_layer_data.js';
import { attachOutline, storeDimensions } from './stl_maker_geometry.js';
import { goToShape } from './stl_maker_navigation.js';


/* ─────────────────────────────────────────────────────────────
   FREEHAND
───────────────────────────────────────────────────────────── */

export function startFreehand(){

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

    if(S.shapeMode==='2d')
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

    S.rotationLocked=true;

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


    if(S.shapeMode==='2d'){

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

    S.activeShapeId=rec.id;

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
