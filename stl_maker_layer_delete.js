import { S } from './stl_maker_state.js';
import { menuScroll } from './stl_maker_h2.js';
import { showConfirm } from './stl_maker_confirmation.js';
import { deleteLayer } from './stl_maker_geometry.js';
import { goToLayersHome } from './stl_maker_navigation.js';
import { createLayer, layers } from './stl_maker_layer_data.js';
import { renderDrawingToolsHome } from './stl_maker_drawing_tools.js';


/* ─────────────────────────────────────────────────────────────
   LAYER DELETE
───────────────────────────────────────────────────────────── */

export function wireLayerDelete(){

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

                  S.activeLayerId=l.id;
                }

                renderDrawingToolsHome();
              }
            );
          }
        );
      }
    );
}
