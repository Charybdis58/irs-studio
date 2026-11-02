import { createContext, useContext } from 'react';
import { FONT } from '../marka/font';
import { TEMA, type Tema, type TemaAdi } from '../marka/renk';

/**
 * Sosyal pafta, Rev C (1080 x 1440): dış çerçeve 22 px, iç çerçeve 42 px, içerik x 102-978,
 * etiket y 110, başlık y 150, görsel y 420-980, antet 112 px. Alt yüzde 12 boş kalır.
 */
export const PAFTA = {
  w: 1080,
  h: 1440,
  dis: 22,
  ic: 42,
  ustBant: 36,
  x0: 102,
  x1: 978,
  etiketY: 110,
  baslikY: 150,
  gorselY0: 420,
  gorselY1: 980,
  icerikSonu: 1250,
  antet: 112,
  grid: 40,
} as const;

export const ICERIK_GENISLIK = PAFTA.x1 - PAFTA.x0;

export interface Kutu {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface YaziStili {
  aile: keyof typeof FONT;
  boyut: number;
  kalinlik?: number;
  aralik?: number; // letter-spacing, em
}

let tuval: CanvasRenderingContext2D | null = null;

/** Metnin piksel genişliği. Yalnızca FontKapisi içinde çağrılır. */
export function genislik(metin: string, s: YaziStili): number {
  tuval ??= document.createElement('canvas').getContext('2d');
  if (!tuval) return metin.length * s.boyut * 0.5;
  tuval.font = `${s.kalinlik ?? 400} ${s.boyut}px ${FONT[s.aile]}`;
  tuval.letterSpacing = `${(s.aralik ?? 0) * s.boyut}px`;
  return tuval.measureText(metin).width;
}

/** Satırların hepsi `maksGenislik`e sığacak en büyük font boyutu (en fazla `s.boyut`). */
export function sigdir(satirlar: string[], s: YaziStili, maksGenislik: number): number {
  const enGenis = Math.max(1, ...satirlar.map((t) => genislik(t, s)));
  return Math.min(s.boyut, Math.floor((s.boyut * maksGenislik) / enGenis));
}

// Adres, e-posta ve @kullanıcı adı büyük harfe çevrilmez: Türkçe dönüşüm i'yi İ yapar, adres bozulur.
const DOKUNULMAZ = /(\S+@\S+\.\S+|@[\w.]+|(?:https?:\/\/)?[\w-]+(?:\.[\w-]+)*\.(?:com|org|net|edu|tr|io|dev)(?:\/\S*)?)/gi;

export type Dil = 'tr' | 'en';

/** Başlık ve etiketler büyük harf; Türkçede i -> İ doğru dönsün diye yerel ayarla. */
export function buyuk(metin: string, dil: Dil = 'tr'): string {
  const yerel = dil === 'tr' ? 'tr-TR' : 'en-US';
  return metin
    .split(DOKUNULMAZ)
    .map((parca, i) => (i % 2 === 1 ? parca : parca.toLocaleUpperCase(yerel)))
    .join('');
}

/** Postun dili. İngilizce postta büyük harf dönüşümü i -> I olur (Türkçede i -> İ). */
export const DilBaglami = createContext<Dil>('tr');

/** Bileşenler `buyuk`u bu kancadan alır; dil postun `dil` alanından gelir. */
export function useBuyuk() {
  const dil = useContext(DilBaglami);
  return (metin: string, zorla?: Dil) => buyuk(metin, zorla ?? dil);
}

/** Pafta temasını alt bileşenlere (diyagram, görsel) taşır. */
export const TemaBaglami = createContext<TemaAdi>('acik');

export function useTema(): Tema {
  return TEMA[useContext(TemaBaglami)];
}
