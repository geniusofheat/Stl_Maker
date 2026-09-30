import { S } from './stl_maker_state.js';
import { menuScroll, setH2 } from './stl_maker_h2.js';
import { svg } from './stl_maker_icons.js';


/* ─────────────────────────────────────────────────────────────
   DRAWING TOOLS
───────────────────────────────────────────────────────────── */

export function renderDrawingToolsHome(){

  setH2(
    'Choose a tool category'
  );


  menuScroll.innerHTML=`
    <div class="h3-stack">

      <div class="tile-row">

        <div
          class="tile"
          data-category="create">
          ${svg('shapes')}
          <span>Create</span>
        </div>

        <div
          class="tile"
          data-category="transform">
          ${svg('move')}
          <span>Transform</span>
        </div>

        <div
          class="tile"
          data-category="modify">
          ${svg('boolean')}
          <span>Modify</span>
        </div>

      </div>

    </div>
  `;


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