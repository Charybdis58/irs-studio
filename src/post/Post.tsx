import { DiyagramCiz, type Diyagram } from '../pafta/Diyagram';
import { Baslik, BASLIK_SATIR, baslikBoyutu, Etiket, Fig, Gorsel, Govde } from '../pafta/Ogeler';
import { ICERIK_GENISLIK, PAFTA, type Kutu } from '../pafta/olcu';
import { Pafta, type PaftaProps } from '../pafta/Pafta';

/**
 * Genel sosyal post, Rev C düzeni: başlık üstte, görsel ortada (y 420-980), FIG. ve kısa açıklama
 * altta. Kapak (`kapak: true`): tek güçlü görsel, gövde yok, görsel alanı aşağı uzar.
 * Görsel yoksa gövde başlığın altına gelir (metin ağırlıklı iç sayfa).
 */
export interface PostProps extends Omit<PaftaProps, 'children'> {
  etiket?: string;
  /** Başlık, 1-3 satır; 2-6 kelime önerilir. */
  satirlar: string[];
  /** Son satır vurgu renginde. */
  vurguSon?: boolean;
  /** `public/` altındaki görsel. "[...]" ile başlarsa yer tutucu çizilir. */
  gorsel?: string;
  /** cover: alanı doldurur (fotoğraf), contain: sığdırır (çizim, render). */
  sigdirma?: 'cover' | 'contain';
  /** Görsel yerine diyagram; koordinatlar görsel alanının sol üstüne göre. */
  diyagram?: Diyagram;
  /** FIG. NN / sonrası: "KONU / GÖRÜNÜŞ". */
  fig?: string;
  figNo?: number;
  /** En fazla 25 kelime. */
  govde?: string;
  kapak?: boolean;
}

/** Görsel alanı ölçüleri: standart 876 x 560, kapakta 876 x 790. Diyagram koordinatları için. */
export const GORSEL_ALANI = {
  standart: { x: PAFTA.x0, y: PAFTA.gorselY0, w: ICERIK_GENISLIK, h: PAFTA.gorselY1 - PAFTA.gorselY0 },
  kapak: { x: PAFTA.x0, y: PAFTA.gorselY0, w: ICERIK_GENISLIK, h: PAFTA.icerikSonu - 40 - PAFTA.gorselY0 },
} satisfies Record<string, Kutu>;

export function Post({ etiket, satirlar, vurguSon, gorsel, sigdirma = 'cover', diyagram, fig, figNo, govde, kapak = false, ...pafta }: PostProps) {
  const gorselVar = Boolean(gorsel || diyagram);
  const yukseklik = gorselVar ? PAFTA.gorselY0 - 24 - PAFTA.baslikY : kapak ? 520 : 420;
  const boyut = baslikBoyutu(satirlar, yukseklik);
  const baslikSonu = PAFTA.baslikY + boyut * BASLIK_SATIR * satirlar.length;
  const kutu = kapak ? GORSEL_ALANI.kapak : GORSEL_ALANI.standart;

  return (
    <Pafta {...pafta}>
      <Etiket metin={etiket} />
      <Baslik satirlar={satirlar} boyut={boyut} vurguSon={vurguSon} />
      {diyagram ? (
        <DiyagramCiz diyagram={diyagram} kutu={kutu} varsayilanBas={46} />
      ) : (
        gorsel && <Gorsel kaynak={gorsel.startsWith('[') ? undefined : gorsel} yerTutucu={gorsel} kutu={kutu} sigdirma={sigdirma} />
      )}
      {gorselVar && <Fig metin={fig} no={figNo} y={kutu.y + kutu.h + 14} />}
      {!kapak && <Govde metin={govde} y={gorselVar ? PAFTA.gorselY1 + 60 : baslikSonu + 48} />}
    </Pafta>
  );
}
