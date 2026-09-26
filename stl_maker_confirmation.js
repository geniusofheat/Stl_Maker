/* ─────────────────────────────────────────────────────────────
   CONFIRMATION
───────────────────────────────────────────────────────────── */

const confirmOverlay=
  document.createElement(
    'div'
  );

confirmOverlay.id=
  'confirmOverlay';

confirmOverlay.classList.add(
  'hidden'
);

confirmOverlay.innerHTML=`
  <div class="confirm-box">

    <p id="confirmMsg"></p>

    <div class="confirm-row">

      <button
        class="confirm-no"
        id="confirmNo">
        No
      </button>

      <button
        class="confirm-yes"
        id="confirmYes">
        Yes
      </button>

    </div>

  </div>
`;

document
  .getElementById('main')
  .appendChild(
    confirmOverlay
  );


export function showConfirm(
  msg,
  onYes
){

  document
    .getElementById(
      'confirmMsg'
    )
    .textContent=msg;


  confirmOverlay
    .classList.remove(
      'hidden'
    );


  const yes=
    document.getElementById(
      'confirmYes'
    );

  const no=
    document.getElementById(
      'confirmNo'
    );


  const cleanup=() => {

    confirmOverlay
      .classList.add(
        'hidden'
      );

    yes.replaceWith(
      yes.cloneNode(true)
    );

    no.replaceWith(
      no.cloneNode(true)
    );
  };


  document
    .getElementById(
      'confirmYes'
    )
    .addEventListener(
      'click',
      () => {

        cleanup();

        onYes();
      }
    );


  document
    .getElementById(
      'confirmNo'
    )
    .addEventListener(
      'click',
      cleanup
    );
}
