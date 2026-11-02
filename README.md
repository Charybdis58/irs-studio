# irs-studio

IZTECH Robotic Systems'ın görsel üretim paketi: Instagram postları ve carousel'leri, feed ve Reels
videoları, anlatım animasyonları, sunumlar. Hepsi IRS-GDL-001 Rev C pafta dilinde, hepsi bir JSON
tariften tek komutla üretilir.

- Geçerli sistem ve kararlar: [`marka/MARKA.md`](marka/MARKA.md)
- Tarif biçimleri ve komutlar: [`icerik/OKU-BENI.md`](icerik/OKU-BENI.md)
- Kurallar (insan ve yapay zekâ için): [`AGENTS.md`](AGENTS.md)

## Ekip için

**Bu depo IRS tasarımının tek kaynağıdır.** IRS için yapılan her görsel iş buradaki araçlar ve
kurallarla yapılır; kural, şablon ya da araç değişikliği yalnızca bu depoda, pull request ile yapılır.

1. **Yapay zekâ asistanına talimatı ekle** (bir kez): [`AI-TALIMATI.md`](AI-TALIMATI.md). ChatGPT,
   Gemini, Claude ya da başka bir araç; IRS işi açıldığında kuralları bu deponun en güncel halinden
   okur.
2. **Claude Code kullanıyorsan** eklentiyi kur:
   `/plugin marketplace add Charybdis58/irs-studio`, sonra `/plugin install irs-studio@irs`. "Tanışma
   carousel'i hazırla", "bunu Reels'e çevir", "jüri sunumu hazırla" demek yeterli; eklenti depoyu
   kendisi indirir ve günceller.
3. **Elle çalışacaksan** aşağıdaki kurulumu yap; her işten önce `git pull`.

## Kurulum

Node 22+ ve FFmpeg gerekir (`winget install Gyan.FFmpeg`).

```bash
git clone https://github.com/Charybdis58/irs-studio.git
cd irs-studio
npm install
```

İlk render Remotion'ın başsız Chrome'unu bir kez indirir. Sunumlar sistemdeki Chrome ya da Edge ile basılır.

## Yapı

```
marka/        logolar, fontlar (altyazı için TTF), Rev C özeti (kaynak/), eski kılavuzlar (arsiv/), MARKA.md
src/          Remotion: pafta iskeleti (pafta/), post şablonları (post/), video (video/)
sunum/        sunum paftası (pafta.css, IRS-GDL-001 Rev C)
araclar/      uret (post/video), sunum, kareler (video denetimi), ff (FFmpeg kısayolları), woff-ttf
icerik/       tarifler (JSON); _ ile başlayanlar örnek
public/girdi/ fotoğraf, çizim, müzik gibi girdiler
cikti/        üretilenler (depoya girmez)
```

## Komutlar

| Komut                                   | Ne yapar                                              |
| --------------------------------------- | ----------------------------------------------------- |
| `npm run uret -- icerik/x.json`         | Post, carousel ya da video üretir (`--taslak`)         |
| `npm run sunum -- icerik/x.json --png`  | Sunumu PDF'e basar, slaytları PNG verir                |
| `npm run kareler -- video.mp4 1`        | Videodan saniyede bir karelik temas sayfası            |
| `npm run ff -- <iş> ...`                | kes, birlestir, olcekle, altyazi, ses, sessiz, sikistir, gif, kapak |
| `npm run studio`                        | Remotion Studio'da canlı önizleme ve ince ayar          |
| `npm run tip`                           | TypeScript denetimi                                    |

## Kurallar (kısa)

- Bilgi uydurulmaz: rakam, tarih, sponsor, ölçü bilinmiyorsa `[TARİH]` gibi yer tutucu; yer tutuculu
  tarif `--taslak` olmadan üretilmez.
- Yapay zekâ görseli gerçek robot ya da ekip fotoğrafı yerine kullanılmaz.
- Uzun tire (—) kullanılmaz. Logo çizilmez, yeniden renklendirilmez.
- Remotion bireysel kullanımda ücretsiz; topluluk adına 3 kişiden büyük bir şirket kullanacaksa lisans gerekir.
