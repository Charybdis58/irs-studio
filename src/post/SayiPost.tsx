import { FONT } from '../marka/font';
import { useBelir } from '../pafta/hareket';
import { Alan, Baslik, baslikBoyutu, Etiket } from '../pafta/Ogeler';
import { ICERIK_GENISLIK, PAFTA, sigdir, useBuyuk, useTema } from '../pafta/olcu';
import { Pafta, type PaftaProps } from '../pafta/Pafta';

/**
 * Sayı postu: 1-3 büyük değer, her birinin birimi ve ne olduğu, altta kaynak. Rev C veri disiplini:
 * birim ve kaynak görünür; gerçek veri yoksa bu şablon kullanılmaz.
 */
export interface Sayi {
  deger: string;
  birim?: string;
  ne: string;
}

export interface SayiPostProps extends Omit<PaftaProps, 'children'> {
  etiket?: string;
  satirlar: string[];
  sayilar: Sayi[];
  /** Zorunlu: değerin kaynağı ve dönemi. */
  kaynak: string;
}

function SayiSatiri({ sayi, y, h, boyut, bas }: { sayi: Sayi; y: number; h: number; boyut: number; bas: number }) {
  const buyuk = useBuyuk();
  const t = useTema();
  const stil = useBelir(bas, 24);
  return (
    <Alan kutu={{ x: PAFTA.x0, y, w: ICERIK_GENISLIK, h }} stil={{ borderTop: `1px solid ${t.metin}`, ...stil }}>
      <div style={{ fontFamily: FONT.head, fontWeight: 700, lineHeight: 1, marginTop: 16, whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: boyut, color: t.vurgu }}>{sayi.deger}</span>
        {sayi.birim && <span style={{ fontSize: Math.round(boyut * 0.32), marginLeft: 14 }}>{buyuk(sayi.birim)}</span>}
      </div>
      <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 22, letterSpacing: '0.07em', marginTop: 10 }}>
        {buyuk(sayi.ne)}
      </div>
    </Alan>
  );
}

export function SayiPost({ etiket, satirlar, sayilar, kaynak, ...pafta }: SayiPostProps) {
  const buyuk = useBuyuk();
  const kaynakStil = useBelir(70, 8);
  const boyut = baslikBoyutu(satirlar, PAFTA.gorselY0 - 24 - PAFTA.baslikY);
  const y0 = PAFTA.gorselY0;
  const h = (PAFTA.icerikSonu - 60 - y0) / sayilar.length;
  const sayiBoyutu = Math.min(
    Math.floor(h * 0.62),
    sigdir(
      sayilar.map((s) => `${s.deger} ${s.birim ?? ''}`),
      { aile: 'head', boyut: 240, kalinlik: 700 },
      ICERIK_GENISLIK,
    ),
  );

  return (
    <Pafta {...pafta}>
      <Etiket metin={etiket} />
      <Baslik satirlar={satirlar} boyut={boyut} />
      {sayilar.map((s, i) => (
        <SayiSatiri key={i} sayi={s} y={y0 + i * h} h={h} boyut={sayiBoyutu} bas={40 + i * 10} />
      ))}
      <Alan kutu={{ x: PAFTA.x0, y: PAFTA.icerikSonu - 34, w: ICERIK_GENISLIK }} stil={{ ...kaynakStil }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 18, letterSpacing: '0.07em' }}>{`${buyuk('Kaynak')} / ${buyuk(kaynak)}`}</span>
      </Alan>
    </Pafta>
  );
}
