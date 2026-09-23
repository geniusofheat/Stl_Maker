/* STL Maker subsystem — generated from stl_maker_engine2.js */

const layers=[];

let nextLayerId=1;
let activeLayerId=null;
let activeShapeId=null;

const GRAY=0x777788;


function findLayer(id){
  return layers.find(
    l => l.id===id
  );
}


function activeLayer(){
  return findLayer(
    activeLayerId
  );
}


function activeShape(){

  const l=activeLayer();

  return l
    ? l.shapes.find(
        s => s.id===activeShapeId
      )
    : null;
}


function createLayer(){

  const l={
    id:nextLayerId++,
    name:`Layer ${layers.length+1}`,
    shapes:[]
  };

  layers.push(l);

  return l;
}


function refreshShapeVisuals(){

  layers.forEach(
    l => {

      l.shapes.forEach(
        s => {

          const active =
            l.id===activeLayerId &&
            s.id===activeShapeId;

          if(
            s.mesh.material &&
            s.mesh.material.color
          ){

            s.mesh.material.color.set(
              active
                ? s.color
                : GRAY
            );
          }

          if(
            s.mesh.userData.outline
          ){

            s.mesh.userData.outline.visible =
              !active;
          }
        }
      );
    }
  );
}



const raycaster=
  new THREE.Raycaster();

const ndc=
  new THREE.Vector2();


function trySelectAt(
  clientX,
  clientY
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

  const all=[];

  layers.forEach(
    l =>
      l.shapes.forEach(
        s =>
          all.push({l,s})
      )
  );

  const hits=
    raycaster.intersectObjects(
      all.map(
        x => x.s.mesh
      ),
      false
    );

  if(hits.length){

    const hit=
      all.find(
        x =>
          x.s.mesh===
          hits[0].object
      );

    activeLayerId=
      hit.l.id;

    activeShapeId=
      hit.s.id;

    refreshShapeVisuals();

    goToShape();

    return true;
  }

  return false;
}


let crosshairActive=false;

const crosshairEl=
  document.createElement(
    'div'
  );

crosshairEl.id=
  'crosshairCursor';

crosshairEl.textContent='➤';

document
  .getElementById('plate')
  .appendChild(
    crosshairEl
  );


function activateCrosshair(){

  crosshairActive=true;

  crosshairEl.style.display=
    'flex';

  showToast(
    'Tap a shape on the plate to select it'
  );

  function move(e){

    const rect=
      canvas.getBoundingClientRect();

    crosshairEl.style.left=
      (e.clientX-
       rect.left-
       17)+'px';

    crosshairEl.style.top=
      (e.clientY-
       rect.top-
       38)+'px';
  }

  function up(e){

    const found=
      trySelectAt(
        e.clientX,
        e.clientY
      );

    if(found)
      deactivate();
  }

  function deactivate(){

    crosshairActive=false;

    crosshairEl.style.display=
      'none';

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


canvas.addEventListener(
  'pointerup',
  e => {

    if(!crosshairActive &&
       !manipulationActive){

      trySelectAt(
        e.clientX,
        e.clientY
      );
    }
  }
);


function shapeLabel(s){

  if(!s || !s.geomId)
    return 'Shape';

  return (
    s.geomId[0].toUpperCase()+
    s.geomId.slice(1)+
    ` #${s.num}`
  );
}



function wireLayerDelete(){

  let armedId=null;
  let armTimer=null;


  menuScroll
    .querySelectorAll(
      '[data-del]'
    )
    .forEach(
      btn => {

        btn.addEventListener(
          'click',
          e => {

            e.stopPropagation();

            const id=
              parseInt(
                btn.dataset.del,
                10
              );


            if(armedId!==id){

              menuScroll
                .querySelectorAll(
                  '.tile-del'
                )
                .forEach(
                  b =>
                    b.classList.remove(
                      'armed'
                    )
                );

              armedId=id;

              btn.classList.add(
                'armed'
              );

              clearTimeout(
                armTimer
              );

              armTimer=
                setTimeout(
                  () => {

                    armedId=null;

                    btn.classList.remove(
                      'armed'
                    );

                  },
                  3000
                );

            }else{

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
      }
    );


  menuScroll
    .querySelectorAll(
      '[data-del-tool]'
    )
    .forEach(
      btn => {

        btn.addEventListener(
          'click',
          e => {

            e.stopPropagation();

            const id=
              parseInt(
                btn.dataset.delTool,
                10
              );

            showConfirm(
              'Delete this layer?',
              () => {

                deleteLayer(id);

                if(!layers.length){

                  const l=
                    createLayer();

                  activeLayerId=l.id;
                }

                renderDrawingToolsHome();
              }
            );
          }
        );
      }
    );
}


