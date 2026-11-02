// Palet: IRS-GDL-001 Rev C (marka/kaynak/IRS-GDL-001-RevC-AI-SPEC.md). Başka renk kullanılmaz.
export const RENK = {
  bg: '#EEF2F7', // zemin, alanın yaklaşık yüzde 80'i
  ink: '#071931', // metin ve çizgi, yüzde 15
  accent: '#2B598A', // vurgu, yüzde 5
  line: '#D5E2EF', // grid, ince ayraç
  muted: '#5B6B7C', // açıklama, 14 px ve üstü
  alert: '#D9481C', // yalnız uyarı, en fazla yüzde 2
  koyuAccent: '#8FB3D9', // yalnız koyu tema vurgusu
} as const;

export type TemaAdi = 'acik' | 'koyu';

export interface Tema {
  zemin: string;
  metin: string;
  vurgu: string;
  grid: string;
  soluk: string;
}

/**
 * Koyu tema seçili sosyal gönderiler için (son başvuru, duyuru, kapanış); ardışık iki gönderi koyu olmaz.
 * Koyuda yalnızca üç renk: zemin, metin, vurgu. Grid ve açıklama metin renginin opaklığıyla çizilir.
 */
export const TEMA: Record<TemaAdi, Tema> = {
  acik: { zemin: RENK.bg, metin: RENK.ink, vurgu: RENK.accent, grid: RENK.line, soluk: RENK.muted },
  koyu: {
    zemin: RENK.ink,
    metin: RENK.bg,
    vurgu: RENK.koyuAccent,
    grid: 'rgb(238 242 247 / 10%)',
    soluk: 'rgb(238 242 247 / 70%)',
  },
};
