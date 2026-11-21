"use client";

import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
}

/**
 * Ora corrente (in secondi), aggiornata ogni secondo.
 * Sul server e durante l'idratazione restituisce `null`, così l'HTML
 * prerenderizzato non dipende dall'orario della build.
 */
export function useNowSeconds(): number | null {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 1000),
    () => null,
  );
}
