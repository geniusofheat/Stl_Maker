/* STL Maker subsystem — generated from stl_maker_engine2.js */

function renderBooleanPick(){

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
              l.id===activeLayerId &&
              sh.id===activeShapeId
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


    activeLayerId=
      aLayer.id;

    activeShapeId=
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



function renderSettings(){

  setH2(
    `Plate fixed at ${PLATE_SIZE}×${PLATE_SIZE}mm, ${GRID_SQUARE}mm grid`
  );


  menuScroll.innerHTML=`
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
    .getElementById(
      'saveBtn'
    )
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
    .getElementById(
      'loadBtn'
    )
    .addEventListener(
      'click',
      () =>
        showToast(
          'Load Scene is coming in a future update'
        )
    );


  document
    .getElementById(
      'stlBtn'
    )
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


  menuScroll.innerHTML=`
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
                style="opacity:.6">
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



const confirmOverlay=
  document.createElement(
    'div'
  );

confirmOverlay.id=
  'confirmOverlay';

confirmOverlay.classList.add(
  'hidden'
);

confirmOverlay.innerHTML=`
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
    .getElementById(
      'confirmMsg'
    )
    .textContent=msg;


  confirmOverlay
    .classList.remove(
      'hidden'
    );


  const yes=
    document.getElementById(
      'confirmYes'
    );

  const no=
    document.getElementById(
      'confirmNo'
    );


  const cleanup=() => {

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
    .getElementById(
      'confirmYes'
    )
    .addEventListener(
      'click',
      () => {

        cleanup();

        onYes();
      }
    );


  document
    .getElementById(
      'confirmNo'
    )
    .addEventListener(
      'click',
      cleanup
    );
}



function exportSTL(){

  const meshes=[];

  layers.forEach(
    l =>
      l.shapes.forEach(
        s => {

          if(s.mesh.isMesh)
            meshes.push(
              s.mesh
            );
        }
      )
  );


  if(!meshes.length){

    showToast(
      'Nothing to export'
    );

    return;
  }


  const group=
    new THREE.Group();


  meshes.forEach(
    m => {

      const c=
        m.clone();

      c.remove(
        ...c.children
      );

      group.add(c);
    }
  );


  const exporter=
    new STLExporter();


  const result=
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
        type:
          'application/octet-stream'
      }
    ),
    'stl-maker-model.stl'
  );
}


function saveSceneJSON(){

  const data=
    layers.map(
      l => ({
        name:l.name,

        shapes:
          l.shapes.map(
            s => ({
              geomId:s.geomId,
              fields:s.fields,
              color:s.color,
              position:
                s.mesh.position.toArray(),
              rotation:[
                s.mesh.rotation.x,
                s.mesh.rotation.y,
                s.mesh.rotation.z
              ],
              scale:
                s.mesh.scale.toArray(),
              baseDimensions:
                s.baseDimensions
            })
          )
      })
    );


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

  const url=
    URL.createObjectURL(
      blob
    );

  const a=
    document.createElement(
      'a'
    );

  a.href=url;

  a.download=filename;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  setTimeout(
    () =>
      URL.revokeObjectURL(
        url
      ),
    2000
  );
}



let toastTimer=null;


function showToast(msg){

  const t=
    document.getElementById(
      'toast'
    );

  t.textContent=msg;

  t.classList.add(
    'show'
  );

  clearTimeout(
    toastTimer
  );

  toastTimer=
    setTimeout(
      () =>
        t.classList.remove(
          'show'
        ),
      1800
    );
}


