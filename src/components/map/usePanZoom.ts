"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export type View = { x: number; y: number; w: number; h: number };

type Options = {
  mapW: number;
  mapH: number;
  /** Larghezza minima visibile (zoom massimo), in unità mappa */
  minW?: number;
  /** Centro iniziale (unità mappa) */
  initialCenter?: { x: number; y: number };
};

/**
 * Pan & zoom di un <svg> tramite viewBox.
 * - trascina (mouse o un dito, quando ingrandita) per spostare
 * - rotellina: zoom continuo verso il cursore
 * - pinch con due dita, doppio clic/tap per ingrandire
 * - `wasDrag()` permette ai marker di ignorare il "clic" che chiude un trascinamento
 */
export function usePanZoom(ref: RefObject<SVGSVGElement | null>, { mapW, mapH, minW = 160, initialCenter }: Options) {
  const [size, setSize] = useState({ w: 900, h: 600 });
  const [view, setView] = useState<View>({ x: 0, y: 0, w: mapW, h: mapH });
  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);
  const drag = useRef<{ moved: number; last: Map<number, { x: number; y: number }>; pinch?: number } | null>(null);
  const dragged = useRef(false);
  const anim = useRef<number | null>(null);

  // vista "tutto": copre l'elemento senza bordi vuoti
  const fit = useCallback(
    (elW: number, elH: number) => {
      const aspect = elH / elW;
      const w = Math.min(mapW, mapH / aspect);
      return { w, h: w * aspect };
    },
    [mapW, mapH],
  );

  const clamp = useCallback(
    (v: View, elW: number, elH: number): View => {
      const aspect = elH / elW;
      const maxW = fit(elW, elH).w;
      const w = Math.min(maxW, Math.max(minW, v.w));
      const h = w * aspect;
      return {
        w,
        h,
        x: Math.min(mapW - w, Math.max(0, v.x)),
        y: Math.min(mapH - h, Math.max(0, v.y)),
      };
    },
    [fit, mapW, mapH, minW],
  );

  // dimensioni dell'elemento e vista iniziale
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let first = true;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      if (!width || !height) return;
      setSize({ w: width, h: height });
      setView((v) => {
        if (first) {
          first = false;
          const f = fit(width, height);
          const c = initialCenter ?? { x: mapW / 2, y: mapH / 2 };
          return clamp({ x: c.x - f.w / 2, y: c.y - f.h / 2, w: f.w, h: f.h }, width, height);
        }
        // mantiene il centro al ridimensionamento
        const cx = v.x + v.w / 2;
        const cy = v.y + v.h / 2;
        const w = v.w;
        const h = w * (height / width);
        return clamp({ x: cx - w / 2, y: cy - h / 2, w, h }, width, height);
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [clamp, fit, initialCenter, mapW, mapH, ref]);

  const toMap = useCallback((clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    const v = viewRef.current;
    return { x: v.x + ((clientX - r.left) / r.width) * v.w, y: v.y + ((clientY - r.top) / r.height) * v.h };
  }, [ref]);

  const stopAnim = () => {
    if (anim.current) cancelAnimationFrame(anim.current);
    anim.current = null;
  };

  /** Zoom di un fattore attorno a un punto della mappa (default: centro). */
  const zoomAt = useCallback(
    (factor: number, at?: { x: number; y: number }) => {
      stopAnim();
      setView((v) => {
        const p = at ?? { x: v.x + v.w / 2, y: v.y + v.h / 2 };
        const w = v.w / factor;
        const h = v.h / factor;
        return clamp({ x: p.x - ((p.x - v.x) * w) / v.w, y: p.y - ((p.y - v.y) * h) / v.h, w, h }, size.w, size.h);
      });
    },
    [clamp, size],
  );

  /** Animazione morbida verso un punto (e zoom opzionale). */
  const flyTo = useCallback(
    (p: { x: number; y: number }, targetW?: number) => {
      stopAnim();
      const from = viewRef.current;
      const w = Math.min(from.w, targetW ?? from.w);
      const h = w * (size.h / size.w);
      const to = clamp({ x: p.x - w / 2, y: p.y - h / 2, w, h }, size.w, size.h);
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 450);
        const e = 1 - Math.pow(1 - k, 3);
        setView({
          x: from.x + (to.x - from.x) * e,
          y: from.y + (to.y - from.y) * e,
          w: from.w + (to.w - from.w) * e,
          h: from.h + (to.h - from.h) * e,
        });
        if (k < 1) anim.current = requestAnimationFrame(step);
      };
      anim.current = requestAnimationFrame(step);
    },
    [clamp, size],
  );

  const reset = useCallback(() => {
    stopAnim();
    const f = fit(size.w, size.h);
    const c = initialCenter ?? { x: mapW / 2, y: mapH / 2 };
    setView(clamp({ x: c.x - f.w / 2, y: c.y - f.h / 2, w: f.w, h: f.h }, size.w, size.h));
  }, [clamp, fit, initialCenter, mapW, mapH, size]);

  // rotellina (listener non passivo per bloccare lo scroll della pagina)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018));
      zoomAt(factor, toMap(e.clientX, e.clientY));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ref, toMap, zoomAt]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    stopAnim();
    if (!drag.current) drag.current = { moved: 0, last: new Map() };
    drag.current.last.set(e.pointerId, { x: e.clientX, y: e.clientY });
    dragged.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !d.last.has(e.pointerId)) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const prev = d.last.get(e.pointerId)!;
    d.last.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (d.last.size >= 2) {
      // pinch
      const [a, b] = [...d.last.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (d.pinch) zoomAt(dist / d.pinch, toMap((a.x + b.x) / 2, (a.y + b.y) / 2));
      d.pinch = dist;
      d.moved += 10;
      dragged.current = true;
      return;
    }
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    d.moved += Math.abs(dx) + Math.abs(dy);
    if (d.moved > 6) dragged.current = true;
    setView((v) => clamp({ ...v, x: v.x - (dx / r.width) * v.w, y: v.y - (dy / r.height) * v.h }, size.w, size.h));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    d.last.delete(e.pointerId);
    if (d.last.size < 2) d.pinch = undefined;
    if (d.last.size === 0) drag.current = null;
  };

  const onDoubleClick = (e: React.MouseEvent) => zoomAt(1.8, toMap(e.clientX, e.clientY));

  const maxW = fit(size.w, size.h).w;
  const zoomed = view.w < maxW * 0.98;

  return {
    view,
    viewBox: `${view.x} ${view.y} ${view.w} ${view.h}`,
    /** unità mappa per pixel sullo schermo */
    unitsPerPx: view.w / size.w,
    zoomed,
    canZoomIn: view.w > minW * 1.01,
    zoomAt,
    flyTo,
    reset,
    toMap,
    wasDrag: () => dragged.current,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onPointerLeave: onPointerUp,
      onDoubleClick,
    },
    /** a vista intera la pagina scorre normalmente; ingrandita, il dito sposta la mappa */
    touchAction: zoomed ? "none" : "pan-y",
  };
}
