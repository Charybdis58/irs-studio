# Marka kaynakları ve kararlar

## Geçerli sistem: IRS-GDL-001 Rev C (04.10.2026)

Karar tarihi 02.11.2026. Tüm yeni çıktılar (Instagram, sunum, rapor, broşür, web) Rev C'ye göre
yapılır. Değerler: [`kaynak/IRS-GDL-001-RevC-AI-SPEC.md`](kaynak/IRS-GDL-001-RevC-AI-SPEC.md).
Tam PDF (22 pafta) henüz projede yok; elde yalnızca 19-21. paftaların özeti var. PDF gelince
`kaynak/` altına konur ve özetle çelişen yerde PDF geçerlidir.

| Belge                                        | Durum                                                                |
| -------------------------------------------- | -------------------------------------------------------------------- |
| Rev C (`kaynak/IRS-GDL-001-RevC-AI-SPEC.md`)  | **Geçerli.**                                                         |
| Rev B (`arsiv/IRS_Tasarim_Kurallari_v3.pdf`)  | Emekli. Geriye doğru çıkarılmış özet; referans alınmaz.               |
| Kılavuz v1.0 (`arsiv/`, Archivo)              | Yalnızca Eylül'de yayınlanan ARCC carousel'inin arşivi. O gönderi yeniden yapılmaz. |
| Sponsorluk dosyası 14.10 (Helvetica dar)      | Gönderilen sürüme dokunulmaz; sonraki revizyon Rev C'ye göre.         |

## Fontlar

Başlık Barlow Condensed 600/700, büyük harf. Gövde Barlow 400 (vurgu 500-600). Etiket IBM Plex Mono
400-600, büyük harf. Yeni gönderilerde başlık tek yüz: Barlow Condensed. Eski geniş ve ağır başlıklı
gönderiler olduğu gibi kalır, feed'e dönüp düzeltme yapılmaz. "Gotham Black orijinal font mu?" sorusu
Rev D'de kapanır; o zamana kadar karar değişmez.

## Renk

Açık (varsayılan): zemin `#EEF2F7`, metin ve çizgi `#071931`, vurgu `#2B598A`, grid `#D5E2EF`,
açıklama `#5B6B7C` (14 px ve üstü), uyarı `#D9481C` (yalnız uyarı, en fazla yüzde 2).
Alan oranı yaklaşık 80 / 15 / 5. Gradyan, neon, saf siyah, palet dışı renk yok.

## Koyu tema (sosyal medya, seçili gönderiler)

Varsayılan açık zemin. Koyu yalnızca vurgu gerektiren seçili gönderilerde: son başvuru, duyuru, kapanış.

- Zemin `#071931`, metin `#EEF2F7`, vurgu `#8FB3D9`. Başka renk eklenmez.
- Kareli grid, çerçeve, antet ve mono etiket yapısı aynen kalır.
- Yatay logonun onaylı negatif sürümü olana kadar koyu zeminde logo kullanılmaz. Yerine sembol (fil)
  ya da "IRS / 2026" yazısı. (Sitedeki `logo-yatay-beyaz.svg` onaylı değil, pakette kullanılmaz.)
- Gradyan, parlama, neon yok. Rakam ve başlıklar düz dolgu ya da tek çizgi ağırlığında kontur.
- **Ardışık iki gönderi koyu olmaz;** feed'de açık zemin baskın kalır. Üretmeden önce son gönderiye bak.

## Her temada

Gölge, efekt, çerçeveli beyaz logo kutusu yok. Radius 0, shadow none, logo doğrudan zeminde.
Logo yalnızca `logo/` altındaki dosyalar; çizilmez, yeniden renklendirilmez, esnetilmez.

## Kodlar ve seriler

Rev C: `IRS-[DWG|PRE|RPT|SOC|GDL|WEB]-[###]`, rev A/B/C, tarih GG.AA.YYYY, `FIG. NN / KONU / GÖRÜNÜŞ`.
Alt seri etiketleri (ör. `CLEANUP: 02 / IRS`) kendi sayacını kullanır, ana serinin numarasıyla
karıştırılmaz.

## Rev C testi ve Rev D

Rev C'nin ölçüleri ilk işlerde test edilir. İlk üç iş bu testi sayılır: tanışma carousel'i, tanışma
sunumu, broşür. Çıkan sapmalar ve açık konular Rev D'ye taşınır:

- Gotham Black asıl başlık fontu mu?
- Yatay logonun negatif / tek renk sürümü
- Sunum alternatif paleti (`#F0F4F9`, `#14395F`, `#3976AD`) kalsın mı?

### Pakette Rev C'nin söylemediği yerlerde verilen kararlar (Rev D'ye girdi)

| Konu                         | Pakette                                                                   |
| ---------------------------- | ------------------------------------------------------------------------- |
| Sosyal üst bant              | Sunumdaki gibi 36 px: solda "IRS / seri", sağda kod ve REV                  |
| Sosyal antet hücreleri       | Logo, başlık, no., tarih, sayfa ("03 / 07"); 112 px                        |
| Sosyal koordinat bandı       | 1-6 / A-H (dikey format), mono 11 px                                       |
| Koyu temada grid çizgisi     | Metin rengi `#EEF2F7`, yüzde 10 opaklık (yeni renk eklememek için)          |
| Fotoğraf kenarı              | 1 px mürekkep çizgi, köşe 90°                                              |
| FIG. etiketi (sosyal)        | Plex Mono 20 px                                                           |
| Gövde uzunluğu               | 25 kelimeyi geçerse üretim uyarı verir                                     |
