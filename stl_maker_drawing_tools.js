import { S } from './stl_maker_state.js';
import { activeLayer, createLayer, layers } from './stl_maker_layer_data.js';
import { menuScroll, setH2 } from './stl_maker_h2.js';
import { svg } from './stl_maker_icons.js';
import { goToDrawingTools, goToLayer } from './stl_maker_navigation.js';


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
    'Choose a tool category'
  );


  const activeLayerTile=`
    <div
      class="tile3 layer-active"
      data-tool-layer="${active.id}">

      ${svg('layers')}

      <span>
        ${active.name}
      </span>

    </div>
  `;


  menuScroll.innerHTML=`
    <div class="h3-stack">

      ${activeLayerTile}

      <div class="tile-row">

        <div
          class="tile"
          data-category="create">

          ${svg('shapes')}

          <span>
            Create
          </span>

        </div>

        <div
          class="tile"
          data-category="transform">

          ${svg('move')}

          <span>
            Transform
          </span>

        </div>

        <div
          class="tile"
          data-category="modify">

          ${svg('boolean')}

          <span>
            Modify
          </span>

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
      () => {

        S.activeModule='layers';

        goToLayer();

      }
    );


  menuScroll
    .querySelectorAll(
      '[data-category]'
    )
    .forEach(
      btn => {

        btn.addEventListener(
          'click',
          () => {

            const category=
              btn.dataset.category;


            if(category==='create'){

              S.crumbs=[
                'Drawing Tools',
                'Create'
              ];

            }


            else if(category==='transform'){

              S.crumbs=[
                'Drawing Tools',
                'Transform'
              ];

            }


            else if(category==='modify'){

              S.crumbs=[
                'Drawing Tools',
                'Modify'
              ];

            }

          }
        );

      }
    );

}