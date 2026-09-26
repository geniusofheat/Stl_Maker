import { S } from './stl_maker_state.js';
import { menuScroll, setH2 } from './stl_maker_h2.js';
import { svg } from './stl_maker_icons.js';
import { goToDrawingTools } from './stl_maker_navigation.js';
import { startDragToSize } from './stl_maker_shape_drag.js';


/* ─────────────────────────────────────────────────────────────
   SHAPE DRAW
───────────────────────────────────────────────────────────── */

const DIVISIONS={
  circle:[
    ['full','Full'],
    ['half','Half'],
    ['quarter','Quarter']
  ],

  square:[
    ['full','Full'],
    ['quarter','Quarter']
  ],

  rectangle:[
    ['full','Full'],
    ['eighth','Eighth']
  ],

  triangle:[
    ['full','Full'],
    ['half','Half']
  ],

  octagon:[
    ['full','Full'],
    ['quarter','Quarter']
  ],

  oval:[
    ['full','Full'],
    ['half','Half']
  ]
};


export function renderDrawShapePick(){

  setH2(
    'Pick a shape to divide, or use it whole'
  );

  menuScroll.innerHTML=`
    <div class="tile-row">
      ${
        Object.keys(DIVISIONS)
          .map(
            k => `
              <div
                class="tile3"
                data-dshape="${k}">
                ${svg('shapes')}
                <span>${
                  k[0].toUpperCase()+
                  k.slice(1)
                }</span>
              </div>
            `
          ).join('')
      }
    </div>
  `;


  menuScroll
    .querySelectorAll(
      '[data-dshape]'
    )
    .forEach(
      el => {

        el.addEventListener(
          'click',
          () => {

            const key=
              el.dataset.dshape;

            S.crumbs=[
              'Drawing Tools',
              key[0].toUpperCase()+
              key.slice(1)
            ];

            S.crumbBack=
              () =>
                goToDrawingTools();

            startDragToSize(
              key
            );
          }
        );
      }
    );
}
