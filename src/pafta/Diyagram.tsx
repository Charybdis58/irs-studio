import { useContext } from 'react';
import { useVideoConfig } from 'remotion';
import { FONT } from '../marka/font';
import { HareketAcik, useIlerleme } from './hareket';
import { useBuyuk, useTema, type Kutu } from './olcu';

/**
 * JSON ile tarif edilen teknik çizim. Rev C: ana çizgi 2 px, ayraç ve yardımcı 1 px, kesikli 6/4 px,
 * bağlantılar 90° / 45°, parça numaraları daire içinde. Koordinatlar çizim alanının sol üstüne göre.
 * Videoda her öğe sırayla kendini çizer; durağan postta hepsi çizili.
 */
type Nokta = [number, number];

interface Ortak {
  /** Videoda çizime başlama anı, saniye (diyagramın başından). Yoksa sırayla 0,4 sn arayla. */
  an?: number;
  /** Çizilme süresi, saniye. */
  sure?: number;
  /** Yardımcı çizgi: 1 px. Varsayılan ana çizgi: 2 px. */
  ince?: boolean;
  /** Gizli kenar ya da planlanan kapsam (anlamı açıklamada yazılır). */
  kesik?: boolean;
  /** Vurgu rengi; yalnız işlev vurgusunda. */
  vurgu?: boolean;
}

export type Oge =
  | (Ortak & { tip: 'cizgi'; noktalar: Nokta[] })
  | (Ortak & { tip: 'ok'; noktalar: Nokta[] })
  | (Ortak & { tip: 'kutu'; x: number; y: number; w: number; h: number })
  | (Ortak & { tip: 'daire'; merkez: Nokta; r: number })
  | (Ortak & { tip: 'yazi'; konum: Nokta; metin: string; boyut?: number; hiza?: 'start' | 'middle' | 'end' })
  | (Ortak & { tip: 'balon'; nokta: Nokta; balon: Nokta; numara: number | string; metin?: string })
  | (Ortak & { tip: 'olcu'; bas: Nokta; son: Nokta; metin: string });

export interface Diyagram {
  ogeler: Oge[];
  /** Diyagramın videoda başladığı an, saniye. */
  baslangic?: number;
}

/** pathLength=1 ile her şekil 0'dan 1'e çizilir; kesikli çizgi ise belirerek gelir. */
function cizgiStili(o: Ortak, t: number) {
  if (o.kesik) return { strokeDasharray: '6 4', opacity: t };
  return { strokeDasharray: '1 1', strokeDashoffset: 1 - t };
}

function OkUcu({ a, b, renk }: { a: Nokta; b: Nokta; renk: string }) {
  const aci = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const u = 14;
  const k = Math.PI / 7;
  const p1: Nokta = [b[0] - u * Math.cos(aci - k), b[1] - u * Math.sin(aci - k)];
  const p2: Nokta = [b[0] - u * Math.cos(aci + k), b[1] - u * Math.sin(aci + k)];
  return <polyline points={`${p1.join(',')} ${b.join(',')} ${p2.join(',')}`} fill="none" stroke={renk} strokeWidth={2} />;
}

function Ciz({ oge, bas, fps }: { oge: Oge; bas: number; fps: number }) {
  const buyuk = useBuyuk();
  const tema = useTema();
  const t = useIlerleme(bas, Math.round((oge.sure ?? 0.8) * fps));
  const renk = oge.vurgu ? tema.vurgu : tema.metin;
  const ortak = { fill: 'none', stroke: renk, strokeWidth: oge.ince ? 1 : 2, pathLength: 1, style: cizgiStili(oge, t) };
  const yazi = { fill: tema.metin, fontFamily: FONT.mono, fontWeight: 600, letterSpacing: '0.07em' };

  switch (oge.tip) {
    case 'cizgi':
    case 'ok': {
      const n = oge.noktalar;
      return (
        <g>
          <polyline points={n.map((p) => p.join(',')).join(' ')} strokeLinejoin="miter" {...ortak} />
          {oge.tip === 'ok' && t > 0.98 && <OkUcu a={n[n.length - 2]} b={n[n.length - 1]} renk={renk} />}
        </g>
      );
    }
    case 'kutu':
      return <rect x={oge.x} y={oge.y} width={oge.w} height={oge.h} {...ortak} />;
    case 'daire':
      return <circle cx={oge.merkez[0]} cy={oge.merkez[1]} r={oge.r} {...ortak} />;
    case 'yazi':
      return (
        <text x={oge.konum[0]} y={oge.konum[1]} textAnchor={oge.hiza ?? 'start'} fontSize={oge.boyut ?? 20} opacity={t} {...yazi}>
          {buyuk(oge.metin)}
        </text>
      );
    case 'balon': {
      const [nx, ny] = oge.nokta;
      const [bx, by] = oge.balon;
      const sag = bx >= nx;
      return (
        <g>
          <line x1={nx} y1={ny} x2={bx} y2={by} {...ortak} strokeWidth={1} />
          <circle cx={nx} cy={ny} r={3.5} fill={tema.metin} opacity={t} />
          <g opacity={t}>
            <circle cx={bx} cy={by} r={20} fill={tema.zemin} stroke={renk} strokeWidth={1} />
            <text x={bx} y={by + 7} textAnchor="middle" fontSize={20} {...yazi}>
              {oge.numara}
            </text>
            {oge.metin && (
              <text x={sag ? bx + 32 : bx - 32} y={by + 7} textAnchor={sag ? 'start' : 'end'} fontSize={20} {...yazi}>
                {buyuk(oge.metin)}
              </text>
            )}
          </g>
        </g>
      );
    }
    case 'olcu': {
      // Ölçü çizgisi: iki uçta dik çentik, ortada değer. Değer gerçek ölçüm olmalı.
      const [a, b] = [oge.bas, oge.son];
      const aci = Math.atan2(b[1] - a[1], b[0] - a[0]) + Math.PI / 2;
      const c = (p: Nokta) =>
        `${p[0] - 8 * Math.cos(aci)},${p[1] - 8 * Math.sin(aci)} ${p[0] + 8 * Math.cos(aci)},${p[1] + 8 * Math.sin(aci)}`;
      const orta: Nokta = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      return (
        <g>
          <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} {...ortak} strokeWidth={1} />
          <polyline points={c(a)} stroke={renk} strokeWidth={1} opacity={t} />
          <polyline points={c(b)} stroke={renk} strokeWidth={1} opacity={t} />
          <text x={orta[0]} y={orta[1] - 12} textAnchor="middle" fontSize={18} opacity={t} {...yazi}>
            {buyuk(oge.metin)}
          </text>
        </g>
      );
    }
  }
}

/** Diyagramı `kutu` içine çizer; diyagram koordinatları kutunun sol üstüne göredir. */
export function DiyagramCiz({ diyagram, kutu, varsayilanBas }: { diyagram: Diyagram; kutu: Kutu; varsayilanBas: number }) {
  const { fps } = useVideoConfig();
  const hareket = useContext(HareketAcik);
  const bas0 = diyagram.baslangic !== undefined ? diyagram.baslangic * fps : varsayilanBas;
  return (
    <svg
      width={kutu.w}
      height={kutu.h}
      viewBox={`0 0 ${kutu.w} ${kutu.h}`}
      style={{ position: 'absolute', left: kutu.x, top: kutu.y, overflow: 'visible' }}
    >
      {diyagram.ogeler.map((o, i) => (
        <Ciz key={i} oge={o} fps={fps} bas={hareket ? bas0 + Math.round((o.an ?? i * 0.4) * fps) : 0} />
      ))}
    </svg>
  );
}
