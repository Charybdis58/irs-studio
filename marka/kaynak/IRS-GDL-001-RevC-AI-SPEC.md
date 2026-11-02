# IRS-GDL-001 Rev C - AI-SPEC (Tasarım Kuralları özeti)

**Rev C geçerli, 02.11.2026.** Kararlar ve koyu tema kuralları: `marka/MARKA.md`.

> Ekipten (Yusuf) gelen metin, 2 Kasım 2026'da olduğu gibi kaydedildi. Asıl PDF
> (IRS-GDL-001_Tasarim_Kurallari_RevC.pdf, 22 pafta, 04.10.2026) bu bilgisayarda yok.
> Paketin bu belgeyi nasıl uyguladığı: `marka/MARKA.md`.

Kaynak: IRS-GDL-001_Tasarim_Kurallari_RevC.pdf (22 pafta, 04.10.2026). Bu dosya PDF'teki 19–21. paftaların düz metin kopyasıdır. Çelişki olursa PDF'in en güncel revizyonu geçerlidir.

**Bu projede üretilen her görsel çıktı (sunum, sosyal medya, rapor, web/HTML, sponsorluk dosyası) bu kurallara uyar.**

Kural seviyeleri: ZORUNLU (esnetilmez) · ÖNERİ (gerekçeyle değişebilir) · SERBEST.

## Değerler

```
IRS-GDL-001 REV C / AI-SPEC / TOKENS
# Renk (HEX)
bg       = #EEF2F7   # zemin, alan %80
ink      = #071931   # metin+çizgi, %15
accent   = #2B598A   # vurgu, %5
line     = #D5E2EF   # grid, ince ayraç
muted    = #5B6B7C   # açıklama, >=14px
alert    = #D9481C   # yalnız uyarı, <=%2
dark.acc = #8FB3D9   # web + seçili sosyal gönderiler
yasak    = gradyan, neon, #000, palet dışı

# Font
head = Barlow Condensed 600/700, UPPERCASE
body = Barlow 400 (vurgu 500-600)
mono = IBM Plex Mono 400-600, UPPERCASE,
       letter-spacing 0.06-0.08em
office yedek = Bahnschrift Condensed /
               Arial / Courier New

# Çizgi
grid 1px #D5E2EF · ayraç 1px ink ·
ana sınır 2px ink · kesikli 6/4px
radius = 0 · shadow = none

# Pafta (1600x900 taban)
grid.cell      = 40px
frame.outer    = inset 32px, 2px ink
coord.band     = 20px, 1-6 / A-D, mono 11px
frame.inner    = inset 52px, 1px ink
content.x      = 80px .. 1520px
topband.h      = 36px (sol: IRS / seri,
                 orta: bölüm, sağ: REV)
titleblock.h   = 64-72px, 6 hücre:
  LOGO | BAŞLIK | ÇİZİM NO | REV | TARİH | PAFTA
layout         = başlık üst / görsel merkez /
                 açıklama + FIG. alt

# Sosyal (1080x1440)
outer 22 · inner 42 · content.x 102-978
label y110 mono 26 · H1 y150 96-150px
görsel y420-980 · gövde 32-40px <=25 kelime
titleblock 112px: logo + "03 / 07"
seri 5-7 sayfa · alt %12 boş

# Sunum (1600x900, PPT 13.33x7.5in)
H1 72-88px · H2 40-48 · body 30-36
label 16-20 mono · <=40 kelime/slayt
1 slayt = 1 fikir · görsel %40-60
px x 0.6 = pt

# Rapor (A4 dikey)
outer 5mm · inner 10mm · grid 5mm
metin kenarı 18mm · H1 28-32pt
H2 16-18pt · body 10.5-12pt
fig 8.5-9pt mono · antet 20mm
yapı: özet/yöntem/sonuç/sınırlılık/
      kaynak/ek

# Web
max-width 1200 · pad 16/40px
grid 40px (mobil 24px) · coord >=1024px
H1 48-64 · H2 28-32 · body 17-18
button: ink bg, bg text, mono, r=0
focus: 2px accent ring, 2px offset

# Kod
IRS-[DWG|PRE|RPT|SOC|GDL|WEB]-[###]
rev A,B,C · tarih GG.AA.YYYY
FIG. NN / KONU / GÖRÜNÜŞ
```

## Her zaman

1. Pafta 19'daki renk, font ve ölçüleri birebir kullan.
2. Her sayfaya kareli grid, çift çerçeve ve alt antet koy.
3. Başlık üstte, görsel merkezde, açıklama + FIG. altta.
4. Türkçe yaz; büyük harfte İ/I dönüşümünü kontrol et (HTML'de lang="tr").
5. Logo için yalnız verilen dosyayı kullan; yoksa [LOGO] yer tutucusu bırak.
6. Bilinmeyen veri için [TUTAR], [TARİH], [N] gibi köşeli yer tutucu kullan.
7. Çıktı sonunda: kullanılan format, varsayımlar, boş yer tutucular listesi.

## Asla

1. Gradyan, gölge, yuvarlak köşe, cam efekti, neon, emoji, ünlem.
2. Palet dışı renk veya Barlow Condensed / Barlow / IBM Plex Mono dışında font.
3. Logo çizmek, yeniden renklendirmek, esnetmek.
4. Rakam, sponsor, tarih, ölçü, yarışma sonucu uydurmak.
5. AI görselini gerçek robot / ekip fotoğrafı gibi sunmak.
6. Bir sayfaya birden fazla ana mesaj koymak.

## Format seçimi

- Instagram / LinkedIn → 1080×1440 carousel (pafta 13)
- Sunum, jüri, senato, sponsorluk → 1600×900 (pafta 14)
- Teknik rapor → A4 dikey (pafta 15)
- Web / HTML → pafta 16 + CSS şablonu (pafta 20)

## Belirsizlikte

Kılavuzda olmayan durumda en sade çözümü seç, ZORUNLU kuralı bozma, kararı çıktının sonunda "Varsayım" olarak yaz. Teslimden önce yayın öncesi kontrol listesindeki 12 maddeyi uygula.

## Açık konular (Rev D)

Gotham Black orijinal başlık fontu mu? · Yatay logonun negatif/tek renk sürümü yok · Sunum alternatif paleti kalsın mı? · Koyu tema vurgusu #8FB3D9 onay bekliyor · Ölçüler ilk gerçek işlerde test edilecek.

(HTML başlangıç şablonu özgün metinde vardı; pakette karşılığı `sunum/pafta.css`.)
