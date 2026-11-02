# AGENTS.md

IZTECH Robotic Systems (IRS) görsel üretim paketi. Bu dosyayı bu depoda çalışan herkes okur: insan ya
da yapay zekâ asistanı (Claude, ChatGPT/Codex, Gemini, Cursor, Copilot...). `CLAUDE.md` yalnızca bu
dosyayı içe aktarır.

## 1. Tek kaynak bu depo

**IRS'nin tasarım kuralları, şablonları ve görsel üretim araçlarının tek doğru kaynağı
https://github.com/Charybdis58/irs-studio deposunun `main` dalıdır.**

- IRS ile ilgili her görsel işte (Instagram/LinkedIn gönderisi, carousel, video, Reels, sunum, rapor,
  broşür, sponsorluk dosyası, logo kullanımı) işe başlamadan önce bu deponun **en güncel hali** alınır
  (`git pull`) ve aşağıdaki dosyalar okunur. Hafızadaki, eski bir sohbetteki ya da başka bir
  klasördeki kopya geçerli sayılmaz.
- Geçerli tasarım sistemi: **IRS-GDL-001 Rev C**. Sırayla oku:
  1. [`marka/MARKA.md`](marka/MARKA.md): geçerli sistem, kararlar, koyu tema kuralları, kodlar.
  2. [`marka/kaynak/IRS-GDL-001-RevC-AI-SPEC.md`](marka/kaynak/IRS-GDL-001-RevC-AI-SPEC.md): renk,
     font, ölçü değerleri.
  3. [`icerik/OKU-BENI.md`](icerik/OKU-BENI.md): şablonlar, tarif biçimi, komutlar.
- `marka/arsiv/` altındaki belgeler (Kılavuz v1.0, Rev B) emeklidir; referans alınmaz.
- İrs-web (site) kodu bu kuralın dışındadır; site kendi deposundaki `docs/DESIGN.md`'ye uyar.

## 2. Düzenlemeler yalnızca burada

- Kural, renk, font, şablon ya da araç değişikliği **bu depoda** yapılır: ayrı bir dal açılır,
  pull request ile `main`e gelir. Yerel kopyada, bir sohbette ya da başka bir dosyada yapılan değişiklik
  geçerli değildir.
- Kural değişikliği önerisi (Rev D için) GitHub'da issue olarak açılır. Rev C'nin söylemediği bir yerde
  karar verildiyse `marka/MARKA.md` içindeki "Rev D'ye girdi" tablosuna eklenir.
- Tek seferlik içerik (bir gönderinin metni) için kod değişmez: `icerik/<kod>.json` tarifi yazılır.
  Yayınlanan işlerin tarifleri de depoya eklenir; böylece numaralar ve geçmiş burada izlenir.
- Commit mesajları Türkçe, kısa, ne değiştiğini söyler.

## 3. Kesin kurallar

1. **Bilgi uydurma.** Rakam, tarih, sponsor, ölçü, yarışma sonucu bilinmiyorsa `[TARİH]`, `[N]` gibi
   yer tutucu yazılır ve kullanıcıya listelenir. Yer tutuculu tarif `--taslak` olmadan üretilmez.
2. Yapay zekâ ile üretilmiş görsel gerçek robot, ekip ya da yapılmış iş yerine kullanılmaz.
3. Logo yalnızca `marka/logo/` dosyaları; çizilmez, esnetilmez, yeniden renklendirilmez. Koyu zeminde
   logo yok (onaylı negatif sürüm gelene kadar).
4. Fontlar yalnızca Barlow Condensed, Barlow, IBM Plex Mono. Palet dışı renk, gradyan, gölge, yuvarlak
   köşe, neon, emoji, ünlem yok.
5. Uzun tire (—) yok: metinde, kodda, commit mesajında.
6. Kişisel telefon numarası yayınlanmaz. İletişim: iztechroboticsystems@gmail.com,
   @iztechroboticsystems, iztechroboticsystems.com.
7. Yeni npm paketi ya da dış servis eklemeden önce sorulur.
8. Kullanıcıyla Türkçe konuşulur.

## 4. Çalışma

Kurulum, komutlar ve yapı: [`README.md`](README.md). Kısaca:

```bash
git pull
npm install
npm run uret -- icerik/<kod>.json --taslak   # dene, çıktıya bak
npm run uret -- icerik/<kod>.json            # son çıktı (yer tutucu kalmadıysa)
npm run sunum -- icerik/<kod>.json --png
npm run tip                                  # kod değiştiyse
```

Çıktı kontrolü: PNG'ye bakılır; video `npm run kareler` ile kare sayfasına dökülüp incelenir (yapay zekâ
videoyu izleyemez, ses ve zamanlama için kullanıcıya izletilir). Teslimde: kullanılan format,
varsayımlar ve boş kalan yer tutucular söylenir.

Claude için ayrıntılı iş akışı: [`claude-plugin/skills/irs-studio/SKILL.md`](claude-plugin/skills/irs-studio/SKILL.md).
Diğer yapay zekâ araçlarına talimat: [`AI-TALIMATI.md`](AI-TALIMATI.md).
