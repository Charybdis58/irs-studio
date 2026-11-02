import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FontKapisi } from '../marka/font';
import { TEMA } from '../marka/renk';
import { HareketAcik } from '../pafta/hareket';
import { DilBaglami, PAFTA } from '../pafta/olcu';
import { SABLONLAR, type SablonAdi, type SablonPropsHaritasi } from '../sablonlar';

/**
 * Bir post şablonunu hareketli çizer. 3:4 feed videosu (1080 x 1440) ya da 9:16 Reels/Story
 * (1080 x 1920). 9:16'da pafta ortalanır; üstte ve altta Instagram arayüzü için 240 px boşluk kalır.
 */
export interface VideoProps<S extends SablonAdi = SablonAdi> {
  sablon: S;
  icerik: SablonPropsHaritasi[S];
  /** Saniye. Giriş animasyonu yaklaşık 3 saniye, kalanı bekleme. */
  sure: number;
  /** `public/` altındaki müzik ya da seslendirme dosyası. */
  ses?: string;
  /** Son yarım saniyede içerik zemine karışarak kaybolur (döngü için yumuşak bitiş). */
  sonundaSol?: boolean;
}

export function Video({ sablon, icerik, ses, sonundaSol = true }: VideoProps) {
  const kare = useCurrentFrame();
  const { height, durationInFrames, fps } = useVideoConfig();
  const Sablon = SABLONLAR[sablon] as React.ComponentType<SablonPropsHaritasi[SablonAdi]>;
  const sonOpaklik = sonundaSol
    ? interpolate(kare, [durationInFrames - fps / 2, durationInFrames - 1], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  // 9:16'da paftanın dışı da aynı zemin ve grid; 240 px 40'ın katı, grid kesintisiz sürer.
  const t = TEMA[icerik.tema ?? 'acik'];
  return (
    <AbsoluteFill
      style={{
        backgroundColor: t.zemin,
        backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`,
        backgroundSize: `${PAFTA.grid}px ${PAFTA.grid}px`,
      }}
    >
      <FontKapisi>
        <HareketAcik.Provider value>
          <div style={{ position: 'absolute', top: (height - 1440) / 2, left: 0, opacity: sonOpaklik }}>
            <DilBaglami.Provider value={icerik.dil ?? 'tr'}>
              <Sablon {...icerik} />
            </DilBaglami.Provider>
          </div>
        </HareketAcik.Provider>
      </FontKapisi>
      {ses && <Audio src={staticFile(ses)} />}
    </AbsoluteFill>
  );
}
