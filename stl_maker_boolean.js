import * as THREE from 'three';
import { S } from './stl_maker_state.js';
import { activeLayer, activeShape, findLayer, layers, refreshShapeVisuals } from './stl_maker_layer_data.js';
import { goToDrawingTools, goToShape } from './stl_maker_navigation.js';
import { menuScroll, setH2 } from './stl_maker_h2.js';
import { svg } from './stl_maker_icons.js';
import { shapeLabel } from './stl_maker_selection.js';
import { attachOutline, clampToPlate, deleteShape, storeDimensions } from './stl_maker_geometry.js';
import { scene } from './stl_maker_three.js';
import { showToast } from './stl_maker_toast.js';


/* ─────────────────────────────────────────────────────────────
   BOOLEAN
───────────────────────────────────────────────────────────── */

export function renderBooleanPick(){

  const s=
    activeShape();

  if(!s){

    goToDrawingTools();

    return;
  }


  setH2(
    'Pick a second shape, then an operation'
  );


  const others=[];

  layers.forEach(
    l =>
      l.shapes.forEach(
        sh => {

          if(
            !(
              l.id===S.activeLayerId &&
              sh.id===S.activeShapeId
            )
          ){

            others.push({
              l,
              sh
            });
          }
        }
      )
  );


  let targetId=null;


  menuScroll.innerHTML=`
    <div class="tile-row">
      ${
        others.map(
          o => `
            <div
              class="tile3"
              data-target="${
                o.l.id
              }:${o.sh.id}">
              ${svg('shapes')}
              <span>${
                shapeLabel(o.sh)
              }</span>
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
    .forEach(
      b => {

        b.addEventListener(
          'click',
          () => {

            targetId=
              b.dataset.target;

            menuScroll
              .querySelectorAll(
                '[data-target]'
              )
              .forEach(
                x =>
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
                x =>
                  x.disabled=false
              );
          }
        );
      }
    );


  menuScroll
    .querySelectorAll(
      '[data-op]'
    )
    .forEach(
      b => {

        b.addEventListener(
          'click',
          () => {

            if(!targetId)
              return;

            const parts=
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
      }
    );
}


async function runBoolean(
  mode,
  targetLayerId,
  targetShapeId
){

  const a=
    activeShape();

  const aLayer=
    activeLayer();

  const bLayer=
    findLayer(
      targetLayerId
    );

  const b=
    bLayer
      ? bLayer.shapes.find(
          s =>
            s.id===targetShapeId
        )
      : null;


  if(!a || !b)
    return;


  try{

    const {
      Evaluator,
      Brush,
      ADDITION,
      SUBTRACTION,
      INTERSECTION
    }=
      await import(
        'https://unpkg.com/three-bvh-csg@0.0.16/build/index.module.js'
      );


    const opMap={
      union:ADDITION,
      subtract:SUBTRACTION,
      intersect:INTERSECTION
    };


    a.mesh.updateMatrixWorld();
    b.mesh.updateMatrixWorld();


    const brushA=
      new Brush(
        a.mesh.geometry.clone()
      );

    brushA.position.copy(
      a.mesh.position
    );

    brushA.rotation.copy(
      a.mesh.rotation
    );

    brushA.scale.copy(
      a.mesh.scale
    );

    brushA.updateMatrixWorld();


    const brushB=
      new Brush(
        b.mesh.geometry.clone()
      );

    brushB.position.copy(
      b.mesh.position
    );

    brushB.rotation.copy(
      b.mesh.rotation
    );

    brushB.scale.copy(
      b.mesh.scale
    );

    brushB.updateMatrixWorld();


    const result=
      new Evaluator().evaluate(
        brushA,
        brushB,
        opMap[mode]
      );


    result.geometry
      .computeVertexNormals();


    const mesh=
      new THREE.Mesh(
        result.geometry,
        new THREE.MeshStandardMaterial({
          color:a.color,
          metalness:.15,
          roughness:.55
        })
      );


    clampToPlate(
      mesh,
      false
    );

    attachOutline(mesh);

    scene.add(mesh);


    const rec={
      id:Date.now()+Math.random(),
      num:aLayer.shapes.length,
      mesh,
      geomId:'solid',
      fields:null,
      color:a.color,
      baseDimensions:
        storeDimensions(mesh)
    };


    deleteShape(
      aLayer.id,
      a.id
    );

    deleteShape(
      bLayer.id,
      b.id
    );


    aLayer.shapes.push(
      rec
    );

    aLayer.shapes.forEach(
      (s2,i) =>
        s2.num=i+1
    );


    S.activeLayerId=
      aLayer.id;

    S.activeShapeId=
      rec.id;


    refreshShapeVisuals();

    showToast(
      `${
        mode[0].toUpperCase()+
        mode.slice(1)
      } created`
    );

    goToShape();

  }catch(err){

    console.error(err);

    showToast(
      'Boolean tool could not load — check your connection'
    );
  }
}
