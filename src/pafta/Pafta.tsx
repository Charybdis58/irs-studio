import type { CSSProperties, ReactNode } from 'react';
import { Img, staticFile } from 'remotion';
import { FONT } from '../marka/font';
import { TEMA, type TemaAdi } from '../marka/renk';
import { useBelir, useIlerleme } from './hareket';
import { PAFTA, sigdir, TemaBaglami, useBuyuk, type Dil } from './olcu';

/**
 * Sosyal pafta iskeleti, IRS-GDL-001 Rev C (1080 x 1440): kareli grid, çift çerçeve, koordinat bandı
 * (1-6 / A-H), üst bant ve alt antet. İçerik `children` olarak tuval koordinatlarında mutlak konumlu
 * HTML verilir. Ölçüler post bazında değişmez.
 */
export interface PaftaProps {
  /** Rev C kodu: IRS-SOC-001 gibi. */
  kod: string;
  /** Antetteki başlık. */
  baslik: string;
  /** GG.AA.YYYY */
  tarih: string;
  /** Antetteki sayfa hücresi: "03 / 07". Tek postta boş kalabilir. */
  sayfa?: string;
  /** Üst bandın solu: "IRS / <seri>". */
  seri?: string;
  /** Revizyon harfi; yeniden paylaşılan düzeltmede B, C. */
  rev?: string;
  tema?: TemaAdi;
  dil?: Dil;
  /** Koyu temada logo yerine: fil sembolü ya da "IRS / <yıl>" yazısı (onaylı negatif logo yok). */
  koyuLogo?: 'sembol' | 'yazi';
  children?: ReactNode;
}

const { w: W, h: H, dis: DIS, ic: IC, ustBant: UST, antet: ANTET, grid: GRID } = PAFTA;
const IC_W = W - 2 * IC;
const IC_H = H - 2 * IC;
// Antetteki başlık hücresinin iç genişliği: kalan sütunlar ve 20 px dolgular düşülür.
const ANTET_BASLIK_W = IC_W - (200 + 190 + 172 + 120) - 40;

function Koordinatlar({ renk, t }: { renk: string; t: number }) {
  const kolon = IC_W / 6;
  const satir = IC_H / 8;
  const yazi = { fill: renk, fontFamily: FONT.mono, fontSize: 11, textAnchor: 'middle' as const, dominantBaseline: 'central' as const };
  return (
    <g opacity={t} stroke={renk} strokeWidth={1}>
      {Array.from({ length: 6 }, (_, i) => {
        const orta = IC + kolon * (i + 0.5);
        const sinir = IC + kolon * i;
        return (
          <g key={`k${i}`}>
            {i > 0 && <line x1={sinir} y1={IC - 6} x2={sinir} y2={IC} />}
            {i > 0 && <line x1={sinir} y1={H - IC} x2={sinir} y2={H - IC + 6} />}
            <text x={orta} y={(DIS + IC) / 2} stroke="none" {...yazi}>{i + 1}</text>
            <text x={orta} y={H - (DIS + IC) / 2} stroke="none" {...yazi}>{i + 1}</text>
          </g>
        );
      })}
      {Array.from({ length: 8 }, (_, i) => {
        const orta = IC + satir * (i + 0.5);
        const sinir = IC + satir * i;
        const harf = String.fromCharCode(65 + i);
        return (
          <g key={`s${i}`}>
            {i > 0 && <line x1={IC - 6} y1={sinir} x2={IC} y2={sinir} />}
            {i > 0 && <line x1={W - IC} y1={sinir} x2={W - IC + 6} y2={sinir} />}
            <text x={(DIS + IC) / 2} y={orta} stroke="none" {...yazi}>{harf}</text>
            <text x={W - (DIS + IC) / 2} y={orta} stroke="none" {...yazi}>{harf}</text>
          </g>
        );
      })}
    </g>
  );
}

export function Pafta({ kod, baslik, tarih, sayfa, seri, rev = 'A', tema = 'acik', dil = 'tr', koyuLogo = 'yazi', children }: PaftaProps) {
  const buyuk = useBuyuk();
  const t = TEMA[tema];
  const cerceve = useIlerleme(0, 24);
  const ust = useBelir(8, 0, 14);
  const antet = useBelir(14, 16);

  // Antet başlığı hücreye sığana kadar küçülür (34 -> en az 22 px); kesilmez.
  const antetBaslik = buyuk(baslik);
  const antetBoyut = Math.max(22, sigdir([antetBaslik], { aile: 'head', boyut: 34, kalinlik: 700 }, ANTET_BASLIK_W));

  const disCevre = 2 * (W - 2 * DIS + H - 2 * DIS);
  const icCevre = 2 * (IC_W + IC_H);
  const yil = tarih.match(/\d{4}/)?.[0] ?? '';

  const hucre: CSSProperties = {
    borderLeft: `1px solid ${t.metin}`,
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minWidth: 0,
  };
  const hucreEtiket: CSSProperties = { fontFamily: FONT.mono, fontSize: 11, letterSpacing: '0.07em', color: t.soluk };
  const hucreDeger: CSSProperties = {
    fontFamily: FONT.mono,
    fontWeight: 600,
    fontSize: 18,
    letterSpacing: '0.06em',
    whiteSpace: 'nowrap',
  };

  let logo: ReactNode;
  if (tema === 'acik') {
    logo = <Img src={staticFile('marka/logo-yatay.svg')} style={{ height: 40, width: 'auto', display: 'block' }} />;
  } else if (koyuLogo === 'sembol') {
    logo = <Img src={staticFile('marka/logo-fil.svg')} style={{ height: 70, width: 'auto', display: 'block' }} />;
  } else {
    logo = <span style={{ ...hucreDeger, fontSize: 22 }}>{yil ? `IRS / ${yil}` : 'IRS'}</span>;
  }

  return (
    <div
      lang={dil}
      style={{
        position: 'relative',
        width: W,
        height: H,
        overflow: 'hidden',
        color: t.metin,
        backgroundColor: t.zemin,
        backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`,
        backgroundSize: `${GRID}px ${GRID}px`,
      }}
    >
      <TemaBaglami.Provider value={tema}>{children}</TemaBaglami.Provider>

      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <rect
          x={DIS + 1}
          y={DIS + 1}
          width={W - 2 * DIS - 2}
          height={H - 2 * DIS - 2}
          fill="none"
          stroke={t.metin}
          strokeWidth={2}
          strokeDasharray={disCevre}
          strokeDashoffset={disCevre * (1 - cerceve)}
        />
        <rect
          x={IC + 0.5}
          y={IC + 0.5}
          width={IC_W - 1}
          height={IC_H - 1}
          fill="none"
          stroke={t.metin}
          strokeWidth={1}
          strokeDasharray={icCevre}
          strokeDashoffset={icCevre * (1 - cerceve)}
        />
        <Koordinatlar renk={t.metin} t={cerceve} />
      </svg>

      {/* Üst bant: 36 px. Solda IRS / seri, sağda kod ve revizyon. */}
      <div
        style={{
          position: 'absolute',
          top: IC,
          left: IC,
          width: IC_W,
          height: UST,
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${t.metin}`,
          fontFamily: FONT.mono,
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: '0.07em',
          ...ust,
        }}
      >
        <span>{buyuk(seri ? `IRS / ${seri}` : 'IRS')}</span>
        <span>{`${kod} / REV ${rev}`}</span>
      </div>

      {/* Antet: 112 px. Logo, başlık, numara, tarih, sayfa. */}
      <div
        style={{
          position: 'absolute',
          left: IC,
          bottom: IC,
          width: IC_W,
          height: ANTET,
          display: 'grid',
          gridTemplateColumns: '200px 1fr 190px 172px 120px',
          borderTop: `1px solid ${t.metin}`,
          backgroundColor: t.zemin,
          ...antet,
        }}
      >
        <div style={{ ...hucre, borderLeft: 0, justifyContent: 'center' }}>{logo}</div>
        <div style={hucre}>
          <span style={hucreEtiket}>{buyuk('Başlık')}</span>
          <span
            style={{
              fontFamily: FONT.head,
              fontWeight: 700,
              fontSize: antetBoyut,
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            {antetBaslik}
          </span>
        </div>
        <div style={hucre}>
          <span style={hucreEtiket}>NO.</span>
          <span style={hucreDeger}>{kod}</span>
        </div>
        <div style={hucre}>
          <span style={hucreEtiket}>{buyuk('Tarih')}</span>
          <span style={hucreDeger}>{tarih}</span>
        </div>
        <div style={hucre}>
          <span style={hucreEtiket}>{buyuk('Sayfa')}</span>
          <span style={hucreDeger}>{sayfa ?? ''}</span>
        </div>
      </div>
    </div>
  );
}
