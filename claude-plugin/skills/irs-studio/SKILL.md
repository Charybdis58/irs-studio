---
name: irs-studio
description: IZTECH Robotic Systems (IRS) ile ilgili her görsel ve tasarım işi; kurallar ve araçlar github.com/Charybdis58/irs-studio deposunda (IRS-GDL-001 Rev C). Instagram/LinkedIn postu, carousel, Reels/Story ya da feed videosu, anlatım animasyonu, sunum (jüri, senato, sponsorluk, tanışma), rapor, broşür, sponsorluk dosyası, logo kullanımı, video kesme/altyazı istendiğinde ya da IRS tasarım kuralları sorulduğunda kullan. "post yap", "duyuru", "carousel", "reels", "video", "sunum", "slayt", "broşür", "IRS tasarımı", "renkler", "font" gibi isteklerde. Web sitesi (irs-web) kodu için değil; o kendi docs/DESIGN.md'sine uyar.
---

# IRS Studio

IRS'nin tasarım kurallarının, şablonlarının ve görsel üretim araçlarının **tek doğru kaynağı**
https://github.com/Charybdis58/irs-studio deposunun `main` dalıdır. Hafızadaki ya da eski bir
sohbetteki bilgiye değil, deponun **en güncel haline** göre çalış.

## 0. Önce depoyu güncelle (her seferinde)

Yerel kopya: `IRS_STUDIO` ortam değişkeni varsa o klasör, yoksa ev klasöründe `irs-studio`
(Windows: `C:\Users\<kullanıcı>\irs-studio`).

- **Klasör yoksa:** `git clone https://github.com/Charybdis58/irs-studio.git <klasör>`, sonra içinde
  `npm install`. Node 22+ ve FFmpeg gerekir; eksikse kullanıcıya söyle (FFmpeg: `winget install Gyan.FFmpeg`).
- **Klasör varsa:** `git -C <klasör> pull --ff-only`. Kaydedilmemiş yerel değişiklik ya da çakışma
  varsa üzerine yazma, durumu kullanıcıya göster. `package.json` değiştiyse `npm install`.
- **Terminal yoksa** (web sohbeti): dosyaları doğrudan oku:
  `https://raw.githubusercontent.com/Charybdis58/irs-studio/main/<yol>`.
- Güncelleme yapılamadıysa (ağ yok) bunu kullanıcıya söyle; eski kopyayla çalıştığını belirt.

Depodaki `claude-plugin/skills/irs-studio/SKILL.md` bu dosyadan farklıysa (bu kopya eski kalmış
olabilir) depodakini oku ve ona uy.

## 1. Kuralları oku

1. `AGENTS.md`: tek kaynak ve düzenleme kuralı, kesin kurallar.
2. `marka/MARKA.md`: geçerli sistem (Rev C), koyu tema, kodlar, Rev D'ye taşınan açık konular.
3. `icerik/OKU-BENI.md`: şablonlar, alanlar, slayt tipleri, diyagram öğeleri.
4. Ölçü ya da değer gerekiyorsa `marka/kaynak/IRS-GDL-001-RevC-AI-SPEC.md`.
   `marka/arsiv/` emekli; referans alma.

## 2. Hangi iş, hangi araç

| İstek                                       | Yol                                                                  |
| ------------------------------------------- | -------------------------------------------------------------------- |
| Instagram / LinkedIn postu, carousel        | `"tur": "post"`, şablon `Post` / `SayiPost` / `KapanisPost` / `SponsorPost` -> `npm run uret` |
| Feed videosu (3:4) / Reels, Story (9:16)    | `"tur": "video"`, `format`, `sure`, aynı post şablonu -> `npm run uret` |
| Anlatım animasyonu, robot anatomisi, şema   | `Post` + `diyagram` (+ `kapak`), video olarak                         |
| Sunum, jüri, senato, sponsorluk (16:9)      | `"tur": "sunum"` -> `npm run sunum -- ... --png` (PDF + PNG)            |
| Çekilmiş videoyu kes, birleştir, altyazı, müzik, sıkıştır, GIF | `npm run ff -- <iş>`                               |
| Rapor (A4), broşür, web                     | Pakette şablonu yok. Rev C ölçüleriyle yapılabilir; önce kullanıcıya sor. |
| Yalnızca kural sorusu ("renklerimiz ne?")   | MARKA.md ve AI-SPEC'ten cevapla, kaynağı belirt.                      |

Kod: `IRS-[DWG|PRE|RPT|SOC|GDL|WEB]-[###]`; sosyal gönderi SOC, sunum PRE. Numarayı uydurma:
depodaki `icerik/` tariflerine bak, emin değilsen sor. Alt seri etiketleri (ör. `CLEANUP: 02 / IRS`)
kendi sayacını kullanır.

## 3. Çalışma sırası

1. İçeriği kullanıcıyla netleştir: ne duyuruluyor, hangi tarih, hangi görsel, açık mı koyu mu.
   Bilmediğin bilgiyi `[TARİH]`, `[N]` gibi yer tutucuyla yaz ve listele. Rakam, sponsor, tarih,
   ölçü, sonuç uydurma.
2. Koyu tema yalnızca seçili gönderide (son başvuru, duyuru, kapanış); bir önceki gönderi de koyuysa
   söyle (ardışık iki koyu gönderi olmaz).
3. Tarifi `icerik/<kod>.json` olarak yaz; görselleri `public/girdi/`ye kopyala.
4. Önce `--taslak` ile üret ve çıktıya bak: PNG'yi aç; carousel'de sayfaları ffmpeg `hstack` ile
   birleştir; videoda `npm run kareler -- <mp4> 0.5`. Videoyu izleyemezsin; ses ve zamanlama için
   kullanıcıdan izlemesini iste.
5. Taşma, üst üste binme, yer tutucu, yanlış büyük harf (İngilizcede `dil: "en"`), gövdede 25 kelime
   sınırı; düzelt, yeniden üret.
6. Yer tutucu kalmayınca `--taslak` olmadan üret. Teslimde: dosya yolu, format, varsayımlar,
   kontrol edemediklerin.
7. Yayınlanacak işin tarifini depoya ekle (dal + pull request ya da kullanıcı izin verdiyse commit);
   numaralar ve geçmiş depoda izlenir.

## 4. Düzenleme kuralı

Kural, şablon, renk, font ya da araç değişikliği **yalnızca bu depoda**: yeni dal, değişiklik,
`npm run tip`, örneklerle üretip bakma, pull request. Commit ya da push için kullanıcıdan onay al.
Yerel kopyada bırakılan ya da yalnızca sohbette kalan değişiklik geçerli değildir. Rev C'nin
söylemediği bir yerde karar verdiysen `marka/MARKA.md` "Rev D'ye girdi" tablosuna ekle.

## 5. Kesin kurallar (Rev C)

- Fontlar yalnızca Barlow Condensed (başlık, büyük harf), Barlow (gövde), IBM Plex Mono (etiket).
- Palet dışı renk, gradyan, gölge, yuvarlak köşe, cam efekti, neon, emoji, ünlem yok.
- Her sayfada kareli grid, çift çerçeve, antet. Başlık üstte, görsel ortada, açıklama ve FIG. altta.
  Bir sayfada tek ana mesaj.
- Logo yalnızca `marka/logo/` dosyaları, doğrudan zeminde. Koyu zeminde logo yok.
- Yapay zekâ görseli gerçek robot, ekip ya da yapılmış iş yerine kullanılmaz.
- Uzun tire (—) yok. Kişisel telefon numarası yazılmaz.
- Yeni npm paketi ya da dış servis eklemeden önce sor. Kullanıcıyla Türkçe konuş.

## 6. Şablon geliştirme

Yeni şablon: `src/post/<Ad>Post.tsx`; iskelet `src/pafta/Pafta.tsx`, ölçüler `PAFTA`
(`src/pafta/olcu.ts`), ortak parçalar `src/pafta/Ogeler.tsx`, büyük harf `useBuyuk()`, hareket
`useBelir` / `useIlerleme`. Şablonun kendi gövdesinde tema `TEMA[pafta.tema]` ile okunur;
`useTema()` yalnızca Pafta'nın içinde çizilen bileşenlerde doğru çalışır. `src/sablonlar.tsx`'e ekle,
`npm run tip`, açık ve koyu temada üretip bak.
