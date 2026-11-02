import type { CSSProperties } from 'react';
import { FONT } from '../marka/font';
import { TEMA } from '../marka/renk';
import { useBelir } from '../pafta/hareket';
import { Alan, Baslik, baslikBoyutu, Etiket, Gorsel } from '../pafta/Ogeler';
import { ICERIK_GENISLIK, PAFTA, useBuyuk } from '../pafta/olcu';
import { Pafta, type PaftaProps } from '../pafta/Pafta';

/**
 * Sponsor duyurusu. Logo doğrudan zeminde (beyaz kutu, çerçeve, gölge yok), kendi renkleriyle,
 * alan genişliğinin en fazla yüzde 60'ı. Altta veri satırı. Gerçek sponsor ve katkı olmadan kullanılmaz.
 */
export interface SponsorPostProps extends Omit<PaftaProps, 'children'> {
  etiket?: string;
  satirlar: string[];
  /** `public/` altındaki sponsor logosu (sponsorun verdiği dosya). */
  logo: string;
  sponsorAdi: string;
  katki: string;
  baslangic: string;
}

export function SponsorPost({ etiket, satirlar, logo, sponsorAdi, katki, baslangic, ...pafta }: SponsorPostProps) {
  const buyuk = useBuyuk();
  // Tema bağlamı Pafta'nın içinde kurulur; bu bileşen Pafta'nın dışında, temayı proptan okur.
  const t = TEMA[pafta.tema ?? 'acik'];
  const logoStil = useBelir(30, 0, 24);
  const veriStil = useBelir(50, 12);
  const boyut = baslikBoyutu(satirlar, PAFTA.gorselY0 - 24 - PAFTA.baslikY);
  const logoW = Math.round(ICERIK_GENISLIK * 0.6);
  const hucre: CSSProperties = { padding: '18px 20px', borderLeft: `1px solid ${t.metin}` };

  return (
    <Pafta {...pafta}>
      <Etiket metin={etiket} />
      <Baslik satirlar={satirlar} boyut={boyut} />
      <div style={logoStil}>
        <Gorsel
          kaynak={logo.startsWith('[') ? undefined : logo}
          yerTutucu={logo}
          kutu={{ x: PAFTA.x0 + (ICERIK_GENISLIK - logoW) / 2, y: PAFTA.gorselY0 + 40, w: logoW, h: 480 }}
          sigdirma="contain"
          cerceve={false}
        />
      </div>
      <Alan
        kutu={{ x: PAFTA.x0, y: PAFTA.gorselY1 + 60, w: ICERIK_GENISLIK, h: 112 }}
        stil={{ display: 'grid', gridTemplateColumns: '1.3fr 1.3fr 1fr', borderTop: `1px solid ${t.metin}`, borderBottom: `1px solid ${t.metin}`, ...veriStil }}
      >
        {[
          ['Sponsor', sponsorAdi],
          ['Katkı', katki],
          ['Başlangıç', baslangic],
        ].map(([etiketi, deger], i) => (
          <div key={etiketi} style={{ ...hucre, borderLeft: i ? hucre.borderLeft : 0, paddingLeft: i ? 20 : 0 }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 14, letterSpacing: '0.07em', color: t.soluk }}>{buyuk(etiketi)}</div>
            <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 24, letterSpacing: '0.04em', marginTop: 16 }}>{buyuk(deger)}</div>
          </div>
        ))}
      </Alan>
    </Pafta>
  );
}
