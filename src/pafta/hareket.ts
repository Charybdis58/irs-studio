import { createContext, useContext } from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';

/**
 * Aynı bileşen hem post (durağan) hem video olarak çizilir. Durağanda her şey son halinde;
 * videoda öğeler sırayla belirir. Hareket yalnızca opaklık, kaydırma ve çizgi çizilmesi:
 * sakin, teknik çizim hissi. Zıplama, dönme, parlama yok.
 */
export const HareketAcik = createContext(false);

const yumusak = Easing.bezier(0.2, 0, 0, 1);

/** 0'dan 1'e ilerleme: `bas` karesinde başlar, `sure` kare sürer. Durağanda hep 1. */
export function useIlerleme(bas: number, sure = 18): number {
  const acik = useContext(HareketAcik);
  const kare = useCurrentFrame();
  if (!acik) return 1;
  return interpolate(kare, [bas, bas + sure], [0, 1], {
    easing: yumusak,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

/** Belirme: opaklık + aşağıdan `mesafe` px kayma. SVG `<g>`ye verilir. */
export function useBelir(bas: number, mesafe = 24, sure = 18) {
  const t = useIlerleme(bas, sure);
  return { opacity: t, transform: `translate(0px, ${(1 - t) * mesafe}px)` };
}
