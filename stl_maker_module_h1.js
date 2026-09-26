import { MODULES } from './stl_maker_data.js';
import { S } from './stl_maker_state.js';
import { svg } from './stl_maker_icons.js';
import { goToDrawingTools, goToLayersHome } from './stl_maker_navigation.js';
import { render } from './stl_maker_render.js';


/* ─────────────────────────────────────────────────────────────
   MODULE / H1
───────────────────────────────────────────────────────────── */

const h1=
  document.getElementById('h1');

export const MODULE_ORDER=[
  'tools',
  'layers',
  'settings',
  'help'
];

const MODULE_OVERRIDE={
  tools:{
    label:'Drawing Tools',
    icon:'pencil'
  }
};


export function renderH1(){

  const mods=
    MODULE_ORDER
      .map(
        id =>
          MODULES.find(
            m => m.id===id
          )
      )
      .filter(Boolean);

  h1.innerHTML=
    mods.map(
      m => {

        const o=
          MODULE_OVERRIDE[m.id] ||
          {};

        return `
          <button
            class="module-btn ${
              m.id===S.activeModule
                ? 'active-blue'
                : ''
            }"
            data-module="${m.id}">
            ${svg(o.icon||m.icon)}
            <span>${
              o.label||m.label
            }</span>
          </button>
        `;
      }
    ).join('');


  h1
    .querySelectorAll(
      '[data-module]'
    )
    .forEach(
      btn => {

        btn.addEventListener(
          'click',
          () => {

            const id=
              btn.dataset.module;

            S.activeModule=id;

            if(id==='layers')
              goToLayersHome();

            else if(id==='tools')
              goToDrawingTools();

            else if(id==='settings'){

              S.crumbs=['Settings'];
              S.crumbBack=null;

              render('settings');

              renderH1();

            }else if(id==='help'){

              S.crumbs=['Help'];
              S.crumbBack=null;

              render('help');

              renderH1();
            }
          }
        );
      }
    );
}
