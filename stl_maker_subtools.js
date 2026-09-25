import * as THREE from 'three';
import { SWATCHES } from './stl_maker_data.js';
import { S } from './stl_maker_state.js';
import { clampToPlate, geometryDimensions } from './stl_maker_geometry.js';
import { GRID_SQUARE, PLATE_SIZE, half } from './stl_maker_three.js';
import { menuScroll } from './stl_maker_h2.js';
import { beginRotate, currentIncrement, setAxis } from './stl_maker_object_manipulation.js';
import { refreshShapeVisuals } from './stl_maker_layer_data.js';


/* ─────────────────────────────────────────────────────────────
   SUBTOOLS
───────────────────────────────────────────────────────────── */

function getDimension(
  s,
  axis
){

  const key=
    axis.toLowerCase();

  const base=
    s.baseDimensions ||
    geometryDimensions(
      s.mesh
    );

  // the button must reflect the shape's CURRENT size, not the size
  // it was created at, or the − button looks like it stops working
  return (
    base[key] *
    (s.mesh.scale[key] || 1)
  );
}


function setDimension(
  s,
  axis,
  value
){

  const key=
    axis.toLowerCase();

  const base=
    s.baseDimensions ||
    geometryDimensions(
      s.mesh
    );

  if(!base[key])
    return;

  s.mesh.scale[key]=
    value/base[key];

  clampToPlate(
    s.mesh,
    true
  );
}


export function fillSubtool(
  tool,
  l,
  s
){

  const slot=
    document.getElementById(
      'subtoolSlot'
    );

  if(!slot)
    return;


  const axes=
    S.shapeMode==='2d'
      ? ['X','Y']
      : ['X','Y','Z'];


  if(tool==='move'){

    slot.innerHTML=`
      <div class="stepper-stack">
        ${
          axes.map(
            axis =>
              stepperRow(
                axis,
                s.mesh.position[
                  axis.toLowerCase()
                ],
                -half,
                half,
                'mm'
              )
          ).join('')
        }
      </div>
    `;


    wireAxisButtons(
      slot,
      axes
    );

    wireSteppers(
      slot,
      axes,
      (axis,val) => {

        s.mesh.position[
          axis.toLowerCase()
        ]=val;

        clampToPlate(
          s.mesh,
          true
        );

        fillSubtool(
          'move',
          l,
          s
        );
      }
    );


  }else if(tool==='rotate'){

    const rotateAxes=
      S.shapeMode==='2d'
        ? ['Z']
        : ['X','Y','Z'];

    // Keep the chosen axis valid (X by default, Z in 2D)
    if(!rotateAxes.includes(S.selectedAxis))
      S.selectedAxis=rotateAxes[0];


    slot.innerHTML=`
      <div class="stepper-stack">
        ${
          rotateAxes.map(
            axis =>
              stepperRow(
                axis,
                THREE.MathUtils.radToDeg(
                  s.mesh.rotation[
                    axis.toLowerCase()
                  ]
                ),
                -360,
                360,
                'deg'
              )
          ).join('')
        }
      </div>
    `;


    // The value button of an axis locks that axis for rotating
    wireAxisButtons(
      slot,
      rotateAxes
    );


    slot
      .querySelectorAll(
        '.stepper-row[data-axis]'
      )
      .forEach(
        row => {

          row
            .querySelectorAll(
              '[data-step]'
            )
            .forEach(
              btn => {

                btn.addEventListener(
                  'click',
                  () => {

                    const axis=
                      row.dataset.axis;

                    const key=
                      axis.toLowerCase();

                    const current=
                      THREE.MathUtils.radToDeg(
                        s.mesh.rotation[key]
                      );

                    const v=
                      current+
                      parseFloat(
                        btn.dataset.step
                      )*5;

                    s.mesh.rotation[key]=
                      THREE.MathUtils.degToRad(
                        v
                      );

                    fillSubtool(
                      'rotate',
                      l,
                      s
                    );
                  }
                );
              }
            );
        }
      );


    menuScroll
      .querySelector(
        '[data-action="rotate"]'
      )
      ?.classList.add(
        'active'
      );


    beginRotate();


  }else if(tool==='scale'){

    slot.innerHTML=`
      <div class="stepper-stack">

        ${
          axes.map(
            axis =>
              stepperRow(
                axis,
                getDimension(
                  s,
                  axis
                ),
                GRID_SQUARE,
                PLATE_SIZE,
                'mm'
              )
          ).join('')
        }

      </div>
    `;


    wireAxisButtons(
      slot,
      axes
    );


    wireSteppers(
      slot,
      axes,
      (axis,val) => {

        setDimension(
          s,
          axis,
          val
        );

        fillSubtool(
          'scale',
          l,
          s
        );
      }
    );


  }else if(tool==='color'){

    slot.innerHTML=`
      <div class="swatch-row">
        ${
          SWATCHES.map(
            c => `
              <div
                class="swatch ${
                  s.color===c
                    ? 'selected'
                    : ''
                }"
                data-c="${c}"
                style="background:${c}">
              </div>
            `
          ).join('')
        }
      </div>
    `;


    slot
      .querySelectorAll(
        '[data-c]'
      )
      .forEach(
        sw => {

          sw.addEventListener(
            'click',
            () => {

              s.color=
                sw.dataset.c;

              refreshShapeVisuals();

              fillSubtool(
                'color',
                l,
                s
              );
            }
          );
        }
      );
  }
}


function stepperRow(
  axis,
  val,
  min,
  max,
  unit
){

  const display=
    unit==='mm'
      ? `${Number(val).toFixed(2)} mm`
      : `${Number(val).toFixed(1)}°`;


  // Two lines so it fits the narrow panel:
  // line 1 = axis + value (tap to lock the axis), line 2 = − and +
  return `
    <div
      class="stepper-row"
      data-axis="${axis}">

      <div
        class="value-button ${
          S.selectedAxis===axis
            ? 'axis-active'
            : ''
        }"
        data-axis="${axis}"
        data-min="${min}"
        data-max="${max}">
        <b class="ax">${axis}</b>
        <span>${display}</span>
      </div>

      <div class="step-btns">

        <button
          data-step="-1">
          −
        </button>

        <button
          data-step="1">
          +
        </button>

      </div>

    </div>
  `;
}


function wireAxisButtons(
  scope,
  axes
){

  scope
    .querySelectorAll(
      '.value-button[data-axis]'
    )
    .forEach(
      v => {

        v.addEventListener(
          'click',
          e => {

            e.stopPropagation();

            setAxis(
              v.dataset.axis
            );
          }
        );
      }
    );
}


function wireSteppers(
  scope,
  axes,
  onChange
){

  axes.forEach(
    axis => {

      const row=
        scope.querySelector(
          `.stepper-row[data-axis="${axis}"]`
        );

      if(!row)
        return;


      const valueEl=
        row.querySelector(
          '.value-button'
        );

      const min=
        parseFloat(
          valueEl.dataset.min
        );

      const max=
        parseFloat(
          valueEl.dataset.max
        );


      row
        .querySelectorAll(
          '[data-step]'
        )
        .forEach(
          btn => {

            btn.addEventListener(
              'click',
              () => {

                const current=
                  parseFloat(
                    valueEl.textContent
                      .replace(
                        /[^0-9.-]/g,
                        ''
                      )
                  )||0;


                const step=
                  currentIncrement();


                const v=
                  Math.min(
                    max,
                    Math.max(
                      min,
                      current+
                      parseFloat(
                        btn.dataset.step
                      )*step
                    )
                  );


                onChange(
                  axis,
                  v
                );
              }
            );
          }
        );
    }
  );
}
