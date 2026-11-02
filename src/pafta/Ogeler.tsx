import type { CSSProperties, ReactNode } from 'react';
import { Img, staticFile } from 'remotion';
import { FONT } from '../marka/font';
import { useBelir } from './hareket';
import { ICERIK_GENISLIK, PAFTA, sigdir, useBuyuk, useTema, type Kutu } from './olcu';

/** Postların ortak parçaları. Hepsi tuval koordinatlarında mutlak konumlu; ölçüler Rev C sosyal. */

const mutlak = (k: Partial<Kutu>): CSSProperties => ({
  position: 'absolute',
  left: k.x ?? PAFTA.x0,
  top: k.y,
  width: k.w ?? ICERIK_GENISLIK,
  height: k.h,
});

/** Üst etiket: y 110, Plex Mono 26, vurgu rengi. */
export function Etiket({ metin, bas = 20 }: { metin?: string; bas?: number }) {
  const buyuk = useBuyuk();
  const t = useTema();
  const stil = useBelir(bas, 12);
  if (!metin) return null;
  return (
    <div
      style={{
        ...mutlak({ y: PAFTA.etiketY }),
        fontFamily: FONT.mono,
        fontWeight: 600,
        fontSize: 26,
        lineHeight: '26px',
        letterSpacing: '0.07em',
        color: t.vurgu,
        ...stil,
      }}
    >
      {buyuk(metin)}
    </div>
  );
}

export const BASLIK_SATIR = 0.92;

/**
 * Başlık boyutu: satırlar içerik genişliğine ve `yukseklik`e sığar; Rev C aralığı 96-150 px.
 * 96'nın altına düşerse metin fazla uzundur (üretim betiği uyarır).
 */
export function baslikBoyutu(satirlar: string[], yukseklik: number, en = 150): number {
  const genislige = sigdir(satirlar, { aile: 'head', boyut: en, kalinlik: 700 }, ICERIK_GENISLIK);
  return Math.min(genislige, Math.floor(yukseklik / (BASLIK_SATIR * satirlar.length)));
}

/** Dev başlık: y 150'den başlar, Barlow Condensed 700, büyük harf. `vurguSon` son satırı vurgu rengine boyar. */
export function Baslik({
  satirlar,
  boyut,
  y = PAFTA.baslikY,
  vurguSon = false,
  bas = 26,
}: {
  satirlar: string[];
  boyut: number;
  y?: number;
  vurguSon?: boolean;
  bas?: number;
}) {
  const buyuk = useBuyuk();
  const t = useTema();
  const stil = useBelir(bas, 40, 22);
  return (
    <div
      style={{
        ...mutlak({ y }),
        fontFamily: FONT.head,
        fontWeight: 700,
        fontSize: boyut,
        lineHeight: BASLIK_SATIR,
        ...stil,
      }}
    >
      {satirlar.map((s, i) => (
        <div key={i} style={{ color: vurguSon && i === satirlar.length - 1 ? t.vurgu : t.metin, whiteSpace: 'nowrap' }}>
          {buyuk(s)}
        </div>
      ))}
    </div>
  );
}

/** Gövde: Barlow 34 px, en fazla 25 kelime. `**kalın**` 600 olur. */
export function Govde({ metin, y, boyut = 34, bas = 40 }: { metin?: string; y: number; boyut?: number; bas?: number }) {
  const stil = useBelir(bas, 16);
  if (!metin) return null;
  const parcalar = metin.split(/\*\*(.+?)\*\*/g);
  return (
    <div style={{ ...mutlak({ y }), fontFamily: FONT.body, fontSize: boyut, lineHeight: 1.3, ...stil }}>
      {parcalar.map((p, i) => (i % 2 === 1 ? <strong key={i} style={{ fontWeight: 600 }}>{p}</strong> : p))}
    </div>
  );
}

/** FIG. NN / KONU / GÖRÜNÜŞ: görselin altında, Plex Mono 20. */
export function Fig({ metin, no = 1, y, bas = 60 }: { metin?: string; no?: number; y: number; bas?: number }) {
  const buyuk = useBuyuk();
  const stil = useBelir(bas, 8);
  if (!metin) return null;
  return (
    <div style={{ ...mutlak({ y }), fontFamily: FONT.mono, fontSize: 20, letterSpacing: '0.07em', ...stil }}>
      {`FIG. ${String(no).padStart(2, '0')} / ${buyuk(metin)}`}
    </div>
  );
}

/**
 * Görsel: `public/` altındaki yol (ör. "girdi/robot.jpg"). Kenarı 1 px çizgi, köşe 90°.
 * Yoksa kesik çerçeveli yer tutucu (yayına çıkmaz; üretim betiği engeller).
 */
export function Gorsel({
  kaynak,
  kutu,
  sigdirma = 'cover',
  cerceve = true,
  yerTutucu = '[GÖRSEL]',
}: {
  kaynak?: string;
  kutu: Kutu;
  sigdirma?: 'cover' | 'contain';
  cerceve?: boolean;
  yerTutucu?: string;
}) {
  const t = useTema();
  if (!kaynak) {
    return (
      <div
        style={{
          ...mutlak(kutu),
          border: `1px dashed ${t.metin}`,
          display: 'grid',
          placeItems: 'center',
          fontFamily: FONT.mono,
          fontWeight: 600,
          fontSize: 18,
          letterSpacing: '0.07em',
          color: t.soluk,
        }}
      >
        {yerTutucu}
      </div>
    );
  }
  return (
    <Img
      src={/^(https?:|data:)/.test(kaynak) ? kaynak : staticFile(kaynak)}
      style={{
        ...mutlak(kutu),
        objectFit: sigdirma,
        display: 'block',
        boxSizing: 'border-box',
        border: cerceve ? `1px solid ${t.metin}` : undefined,
      }}
    />
  );
}

/** Mutlak konumlu kap; içine serbest öğe koymak için. Genişlik verilmezse içerik genişliği, yükseklik içerikten. */
export function Alan({ kutu, children, stil }: { kutu: Partial<Kutu>; children: ReactNode; stil?: CSSProperties }) {
  return <div style={{ ...mutlak(kutu), ...stil }}>{children}</div>;
}
