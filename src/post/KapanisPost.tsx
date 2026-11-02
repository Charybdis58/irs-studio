import { FONT } from '../marka/font';
import { TEMA } from '../marka/renk';
import { useBelir } from '../pafta/hareket';
import { Alan, Baslik, BASLIK_SATIR, baslikBoyutu, Etiket } from '../pafta/Ogeler';
import { PAFTA } from '../pafta/olcu';
import { Pafta, type PaftaProps } from '../pafta/Pafta';

/**
 * Kapanış / çağrı postu: carousel'in son sayfası ya da son başvuru duyurusu. Tek çağrı.
 * Koyu tema için uygun (seçili gönderi; ardışık iki koyu gönderi olmaz).
 */
export interface KapanisPostProps extends Omit<PaftaProps, 'children'> {
  etiket?: string;
  satirlar: string[];
  vurguSon?: boolean;
  govde?: string;
  /** Tek çağrı: adres, "Bio'daki bağlantı" gibi. Yazıldığı gibi kalır, büyük harfe çevrilmez. */
  cagri?: string;
}

export function KapanisPost({ etiket, satirlar, vurguSon = true, govde, cagri, ...pafta }: KapanisPostProps) {
  // Tema bağlamı Pafta'nın içinde kurulur; bu bileşen Pafta'nın dışında, temayı proptan okur.
  const t = TEMA[pafta.tema ?? 'acik'];
  const govdeStil = useBelir(40, 16);
  const cagriStil = useBelir(56, 16);
  const boyut = baslikBoyutu(satirlar, 560);
  const baslikSonu = PAFTA.baslikY + boyut * BASLIK_SATIR * satirlar.length;

  return (
    <Pafta {...pafta}>
      <Etiket metin={etiket} />
      <Baslik satirlar={satirlar} boyut={boyut} vurguSon={vurguSon} />
      {/* Gövde ve çağrı tek akışta: gövde kaç satır olursa çağrı hemen altına gelir. */}
      <Alan kutu={{ x: PAFTA.x0, y: baslikSonu + 48 }}>
        {govde && <p style={{ margin: 0, fontFamily: FONT.body, fontSize: 34, lineHeight: 1.3, ...govdeStil }}>{govde}</p>}
        {cagri && (
          <div style={{ marginTop: 56, ...cagriStil }}>
            <span
              style={{
                display: 'inline-block',
                backgroundColor: t.metin,
                color: t.zemin,
                fontFamily: FONT.mono,
                fontWeight: 600,
                fontSize: 30,
                letterSpacing: '0.04em',
                padding: '22px 30px',
              }}
            >
              {cagri}
            </span>
          </div>
        )}
      </Alan>
    </Pafta>
  );
}
