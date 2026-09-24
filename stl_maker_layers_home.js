import { S } from './stl_maker_state.js';
import { activeLayer, createLayer, layers, refreshShapeVisuals } from './stl_maker_layer_data.js';
import { menuScroll, setH2 } from './stl_maker_h2.js';
import { refreshModeToggle } from './stl_maker_three.js';
import { svg } from './stl_maker_icons.js';
import { goToLayer, goToShape } from './stl_maker_navigation.js';
import { wireLayerDelete } from './stl_maker_layer_delete.js';


/* ─────────────────────────────────────────────────────────────
   LAYERS HOME
───────────────────────────────────────────────────────────── */

export function renderLayersHome(){

  if(!layers.length){

    const l=
      createLayer();

    S.activeLayerId=l.id;
  }

  const active=
    activeLayer();

  setH2(
    active
      ? `${active.name} : ${active.shapes.length} shapes`
      : 'Tap Add Layer for a layer'
  );

  refreshModeToggle();


  const activeTile=
    active
      ? `
        <div
          class="tile3 layer-active"
          data-layer="${active.id}">
          ${svg('layers')}
          <span>${active.name}</span>
          <button
            class="tile-del"
            data-del="${active.id}">
            ${svg('trash')}
          </button>
        </div>
      `
      : '';


  const otherLayers=
    layers
      .filter(
        l =>
          !active ||
          l.id!==active.id
      )
      .map(
        l => `
          <div
            class="tile3"
            data-layer="${l.id}">
            ${svg('layers')}
            <span>${l.name}</span>
            <button
              class="tile-del"
              data-del="${l.id}">
              ${svg('trash')}
            </button>
          </div>
        `
      ).join('');


  const addLayer=
    `<button
      class="add-rect"
      id="addLayerTile">
      ${svg('add')}Add Layer +
    </button>`;


  let shapeTiles='';

  if(
    active &&
    active.shapes.length
  ){

    shapeTiles=
      active.shapes.map(
        s => `
          <div
            class="tile3"
            data-shape="${s.id}">
            ${svg('shapes')}
            <span>${s.geomId}</span>
            <span class="tile-num">
              ${s.num}
            </span>
          </div>
        `
      ).join('');
  }


  menuScroll.innerHTML=`
    <div class="h3-stack">

      ${activeTile}

      ${addLayer}

      ${
        otherLayers
          ? `<div class="tile-row">
              ${otherLayers}
            </div>`
          : ''
      }

      ${
        shapeTiles
          ? `<div class="tile-row">
              ${shapeTiles}
            </div>`
          : ''
      }

    </div>
  `;


  document
    .getElementById(
      'addLayerTile'
    )
    .addEventListener(
      'click',
      () => {

        const l=
          createLayer();

        S.activeLayerId=l.id;
        S.activeShapeId=null;

        goToLayer();
      }
    );


  menuScroll
    .querySelectorAll(
      '[data-layer]'
    )
    .forEach(
      el => {

        el.addEventListener(
          'click',
          e => {

            if(
              e.target.closest(
                '[data-del]'
              )
            )
              return;

            const id=
              parseInt(
                el.dataset.layer,
                10
              );

            S.activeLayerId=id;
            S.activeShapeId=null;

            refreshShapeVisuals();

            goToLayer();
          }
        );
      }
    );


  menuScroll
    .querySelectorAll(
      '[data-shape]'
    )
    .forEach(
      el => {

        el.addEventListener(
          'click',
          () => {

            S.activeShapeId=
              parseFloat(
                el.dataset.shape
              );

            refreshShapeVisuals();

            goToShape();
          }
        );
      }
    );


  wireLayerDelete();
}
