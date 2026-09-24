import { S } from './stl_maker_state.js';


/* ─────────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────────── */


export function showToast(msg){

  const t=
    document.getElementById(
      'toast'
    );

  t.textContent=msg;

  t.classList.add(
    'show'
  );

  clearTimeout(
    S.toastTimer
  );

  S.toastTimer=
    setTimeout(
      () =>
        t.classList.remove(
          'show'
        ),
      1800
    );
}
