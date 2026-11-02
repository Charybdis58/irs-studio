# İçerik dosyaları

Her üretim bir JSON dosyasıdır: `icerik/<kod-ya-da-ad>.json`. Dosya adı çıktı klasörünün adı olur
(`cikti/<ad>/`). `_` ile başlayanlar örnektir. Köşeli parantezli yer tutucu (`[TARİH]`) kalan dosya
`--taslak` olmadan üretilmez.

```bash
npm run uret -- icerik/IRS-SOC-002.json          # post, carousel ya da video
npm run uret -- icerik/IRS-SOC-002.json --taslak # yer tutucuyla dene
npm run sunum -- icerik/IRS-PRE-003.json --png   # sunum: PDF + slayt PNG'leri
npm run kareler -- cikti/x/x.mp4 1               # videodan temas sayfası (denetim)
npm run studio                                   # Remotion Studio: canlı önizleme
```

Görseller `public/girdi/` altına konur ve `"girdi/robot.jpg"` gibi verilir. Sunumda görsel yolu
proje köküne göredir (`"public/girdi/robot.jpg"`).

## Post (`"tur": "post"`)

Sistem: IRS-GDL-001 Rev C (`marka/MARKA.md`). 1080 x 1440, kareli grid, çift çerçeve, üst bant, antet.

```json
{ "tur": "post", "sablon": "Post", "icerik": { ... } }
```

Ortak alanlar (hepsi): `kod` (IRS-SOC-001), `baslik` (antetteki başlık), `tarih` (GG.AA.YYYY),
`seri` (üst bant: "IRS / Tanışma"), `sayfa` ("03 / 07"; carousel'de kendiliğinden), `rev` (A, B, C),
`tema` (`acik` varsayılan; `koyu` yalnızca seçili gönderide), `koyuLogo` (`yazi`: "IRS / 2026",
`sembol`: fil), `dil` (`tr` varsayılan, `en`).

| Şablon        | Ne için                                  | Alanlar                                                                 |
| ------------- | ---------------------------------------- | ----------------------------------------------------------------------- |
| `Post`        | Duyuru, anlatım, fotoğraf, metin sayfası  | `etiket`, `satirlar` (1-3), `vurguSon`, `gorsel` ya da `diyagram`, `sigdirma` (`cover`/`contain`), `fig`, `figNo`, `govde` (en fazla 25 kelime), `kapak` |
| `SayiPost`    | Gerçek veri: sayı, birim, kaynak          | `etiket`, `satirlar`, `sayilar` [{`deger`, `birim`, `ne`}] 1-3, `kaynak` (zorunlu) |
| `KapanisPost` | Son sayfa, son başvuru, tek çağrı         | `etiket`, `satirlar`, `vurguSon` (varsayılan açık), `govde`, `cagri` (yazıldığı gibi kalır) |
| `SponsorPost` | Sponsor duyurusu                          | `etiket`, `satirlar`, `logo` (zorunlu, doğrudan zeminde), `sponsorAdi`, `katki`, `baslangic` |

`Post` düzeni: etiket y 110, başlık y 150 (96-150 px), görsel y 420-980, altında `FIG. NN / ...`,
gövde y 1040. Görsel yoksa gövde başlığın altına gelir. `kapak: true`: gövde yok, görsel y 420-1210.
`gorsel` "[" ile başlarsa yer tutucu çizilir (taslak).

**Carousel:** `icerik` bir dizi olur; her öğe bir sayfa (Rev C: 5-7 sayfa, kapak / anlatım / kapanış).
Ortak alanlar `ortak` içine, sayfaya özel şablon `sablon` ile. Antetteki sayfa hücresi kendiliğinden
"02 / 05" olur. Örnek: `_ornek-carousel.json`.

**Koyu tema:** zemin `#071931`, metin `#EEF2F7`, vurgu `#8FB3D9`; logo yok (yerine "IRS / yıl" ya da
fil). Ardışık iki gönderi koyu olmaz: üretmeden önce bir önceki gönderiye bak.

**Alt seriler** (ör. `CLEANUP: 02 / IRS`) kendi sayacını kullanır; ana seri kodunu (`IRS-SOC-###`)
ilerletmez. Alt seri etiketi `etiket` alanına yazılır.

## Video (`"tur": "video"`)

```json
{ "tur": "video", "format": "3:4", "sablon": "Post", "sure": 8, "ses": "girdi/muzik.mp3", "icerik": { ... } }
```

`format`: `3:4` (feed, 1080 x 1440) ya da `9:16` (Reels/Story, 1080 x 1920; pafta ortada, üst ve
altta 240 px arayüz payı, grid kesintisiz). Şablon aynı post şablonudur; çerçeve kendini çizer,
öğeler sırayla belirir, diyagram öğe öğe çizilir.

## Diyagram (`Post` içinde `diyagram`)

Koordinatlar görsel alanının sol üstüne göre: standart 876 x 560, `kapak: true` ile 876 x 790.
Videoda her öğe `an` saniyesinde (yoksa sırayla 0,4 sn arayla) `sure` boyunca çizilir.
Rev C: bağlantılar 90° / 45°, parça numaraları daire içinde, her kesikli çizginin anlamı açıklamada.

| `tip`   | Alanlar                                               |
| ------- | ----------------------------------------------------- |
| `cizgi` | `noktalar` [[x,y], ...]                               |
| `ok`    | `noktalar`; son noktada ok ucu                        |
| `kutu`  | `x`, `y`, `w`, `h`                                    |
| `daire` | `merkez`, `r`                                         |
| `yazi`  | `konum`, `metin`, `boyut` (20), `hiza`                |
| `balon` | `nokta`, `balon`, `numara`, `metin` (parça numarası)  |
| `olcu`  | `bas`, `son`, `metin` (ölçü çizgisi; değer gerçek olmalı) |

Hepsinde: `an`, `sure`, `ince` (1 px), `kesik` (6/4 px), `vurgu` (vurgu rengi, yalnız işlev
vurgusunda). Örnek: `_ornek-anlatim.json`.

## Sunum (`"tur": "sunum"`, `npm run sunum`)

```json
{ "tur": "sunum", "kod": "IRS-PRE-003", "rev": "A", "tarih": "02.11.2026", "seri": "Jüri sunumu",
  "sayfalar": [ { "tip": "kapak", ... } ] }
```

Her slaytta: `baslik`, isteğe bağlı `etiket` (mavi mono üst etiket), `govde` (`**kalın**` olur),
`bolum` (üst bant ortası, "02 / Ekip"), `antet` (antetteki başlık; yoksa `baslik`).

| `tip`      | Ek alanlar                                               |
| ---------- | -------------------------------------------------------- |
| `kapak`    | (fil sembolü sağda)                                      |
| `metin`    | -                                                        |
| `gorsel`   | `gorsel`, `fig`, `gorselNotu` (görsel yokken yer tutucu)  |
| `iki`      | `govde` solda, `gorsel` + `fig` sağda                    |
| `maddeler` | `maddeler` [metin] (en fazla 4-5)                         |
| `sayilar`  | `sayilar` [{`deger`, `birim`, `ne`}], `kaynak` (zorunlu say) |
| `kapanis`  | `cagri` (tek çağrı, yazıldığı gibi kalır)                 |

Örnek: `_ornek-sunum.json`.
