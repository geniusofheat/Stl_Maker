import { S } from './stl_maker_state.js';
import { activeLayer, activeShape, layers, refreshShapeVisuals } from './stl_maker_layer_data.js';
import { goToDrawingTools, goToShape, goToSubtool } from './stl_maker_navigation.js';
import { menuScroll, setH2 } from './stl_maker_h2.js';
import { svg } from './stl_maker_icons.js';
import { activateCrosshair, shapeLabel } from './stl_maker_selection.js';
import { deleteShape } from './stl_maker_geometry.js';
import { showToast } from './stl_maker_toast.js';
import { render } from './stl_maker_render.js';
import { fillSubtool } from './stl_maker_subtools.js';
import { cleanupManipulation } from './stl_maker_object_manipulation.js';


/* ─────────────────────────────────────────────────────────────
   SHAPE PANEL
───────────────────────────────────────────────────────────── */

const ACTIONS=[
  {
    id:'select',
    label:'Select',
    icon:'select'
  },
  {
    id:'move',
    label:'Move',
    icon:'move'
  },
  {
    id:'rotate',
    label:'Rotate',
    icon:'rotate'
  },
  {
    id:'scale',
    label:'Size',
    icon:'scale'
  },
  {
    id:'color',
    label:'Color',
    icon:'color'
  },
  {
    id:'boolean',
    label:'Boolean',
    icon:'boolean'
  },
  {
    id:'delete',
    label:'Delete',
    icon:'trash'
  }
];


export function renderShapePanel(
  subtool
){

  const l=
    activeLayer();

  const s=
    activeShape();


  if(!l || !s){

    goToDrawingTools();

    return;
  }


  setH2('');


  const totalShapes=
    layers.reduce(
      (n,ly) =>
        n+ly.shapes.length,
      0
    );


  const booleanDisabled=
    totalShapes<2 ||
    !s.mesh.isMesh;


  menuScroll.innerHTML=`
    <div class="tile-row">

      <div
        class="tile3 layer-active"
        data-selected-shape>
        ${svg('shapes')}
        <span>${shapeLabel(s)}</span>
      </div>

    </div>

    <div
      class="action-col"
      style="margin-top:8px;">

      ${
        ACTIONS.map(
          a => `
            <button
              data-action="${a.id}"
              class="${
                a.id===subtool
                  ? 'active'
                  : ''
              }"
              ${
                a.id==='boolean' &&
                booleanDisabled
                  ? 'disabled'
                  : ''
              }>
              ${svg(a.icon)}
              <span>${a.label}</span>
            </button>
          `
        ).join('')
      }

    </div>

    <div
      id="subtoolSlot"
      style="margin-top:8px;">
    </div>
  `;


  menuScroll
    .querySelector(
      '[data-selected-shape]'
    )
    .addEventListener(
      'click',
      () => {

        S.activeShapeId=s.id;

        refreshShapeVisuals();

        renderShapePanel(
          subtool
        );
      }
    );


  menuScroll
    .querySelectorAll(
      '[data-action]'
    )
    .forEach(
      b => {

        b.addEventListener(
          'click',
          () => {

            const id=
              b.dataset.action;

            if(id!=='rotate')
              cleanupManipulation();

            // Rotate always starts on the X axis (Z in 2D)
            if(id==='rotate')
              S.selectedAxis=
                S.shapeMode==='2d'
                  ? 'Z'
                  : 'X';


            if(id==='delete'){

              deleteShape(
                l.id,
                s.id
              );

              goToDrawingTools();

              showToast(
                'Shape deleted'
              );

              return;
            }


            if(id==='select'){

              activateCrosshair();

              return;
            }


            if(id==='boolean'){

              S.crumbs=[
                'Drawing Tools',
                shapeLabel(s),
                'Boolean'
              ];

              S.crumbBack=
                () =>
                  goToShape();

              render(
                'booleanPick'
              );

              return;
            }


            goToSubtool(
              id[0].toUpperCase()+
              id.slice(1)
            );
          }
        );
      }
    );


  if(
    subtool &&
    subtool!=='boolean' &&
    subtool!=='select'
  ){

    fillSubtool(
      subtool,
      l,
      s
    );
  }
}
