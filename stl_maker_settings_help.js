import { MODULES } from './stl_maker_data.js';
import { menuScroll, setH2 } from './stl_maker_h2.js';
import { GRID_SQUARE, PLATE_SIZE } from './stl_maker_three.js';
import { svg } from './stl_maker_icons.js';
import { exportSTL, saveSceneJSON } from './stl_maker_export_save.js';
import { showToast } from './stl_maker_toast.js';
import { MODULE_ORDER } from './stl_maker_module_h1.js';


/* ─────────────────────────────────────────────────────────────
   SETTINGS / HELP
───────────────────────────────────────────────────────────── */

export function renderSettings(){

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


export function renderHelp(){

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
