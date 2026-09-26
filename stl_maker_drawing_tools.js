import { S } from './stl_maker_state.js';
import { activeLayer, createLayer, layers } from './stl_maker_layer_data.js';
import { menuScroll, setH2 } from './stl_maker_h2.js';
import { svg } from './stl_maker_icons.js';
import { goToDrawingTools, goToLayer, goToP2POptions } from './stl_maker_navigation.js';
import { startFreehand } from './stl_maker_freehand.js';
import { render } from './stl_maker_render.js';


/* ─────────────────────────────────────────────────────────────
   DRAWING TOOLS
───────────────────────────────────────────────────────────── */

export function renderDrawingToolsHome(){

  if(!layers.length){

    const l=
      createLayer();

    S.activeLayerId=l.id;
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

        S.activeModule='layers';

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

        S.crumbs=[
          'Drawing Tools',
          'Shape'
        ];

        S.crumbBack=
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
