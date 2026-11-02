# Yapay zekâ asistanına IRS talimatı

IRS ekibindeki herkes, kullandığı yapay zekâ aracına aşağıdaki metni **bir kez** ekler. Böylece IRS ile
ilgili bir tasarım işi açıldığında asistan kuralları hafızasından değil, bu deponun en güncel halinden
okur.

## Nereye eklenir

| Araç                      | Yer                                                                   |
| ------------------------- | --------------------------------------------------------------------- |
| Claude Code               | Aşağıdaki "Claude Code" bölümü (eklenti; metin gerekmez)               |
| Claude (claude.ai)        | Ayarlar -> Profil -> kişisel tercihler, ya da IRS için bir Proje -> proje talimatları |
| ChatGPT                   | Ayarlar -> Kişiselleştirme -> Özel talimatlar, ya da IRS için bir Proje / GPT |
| Gemini                    | Ayarlar -> Kayıtlı bilgiler, ya da IRS için bir Gem                    |
| Cursor, Copilot, Codex    | Bu depo açıldığında `AGENTS.md`'yi kendileri okur; başka yerde çalışırken kullanıcı kuralı olarak metni ekle |

## Yapıştırılacak metin

```text
IZTECH Robotic Systems (IRS) ile ilgili her görsel ve tasarım işinde (Instagram/LinkedIn gönderisi,
carousel, video, sunum, rapor, broşür, sponsorluk dosyası, logo, renk, font sorusu) şuna uy:

1. Kurallar hafızadan ya da eski sohbetlerden değil, her seferinde şu deponun EN GÜNCEL halinden
   alınır: https://github.com/Charybdis58/irs-studio (main dalı). Önce şu dosyaları oku:
   - https://raw.githubusercontent.com/Charybdis58/irs-studio/main/AGENTS.md
   - https://raw.githubusercontent.com/Charybdis58/irs-studio/main/marka/MARKA.md
   - https://raw.githubusercontent.com/Charybdis58/irs-studio/main/marka/kaynak/IRS-GDL-001-RevC-AI-SPEC.md
   - https://raw.githubusercontent.com/Charybdis58/irs-studio/main/icerik/OKU-BENI.md
   Bu dosyalara erişemiyorsan bunu söyle ve içeriğini benden iste; tasarım kuralını tahmin etme.
2. Geçerli sistem IRS-GDL-001 Rev C. marka/arsiv altındaki eski kılavuzlar referans alınmaz.
3. Bilgi uydurma: rakam, tarih, sponsor, ölçü, sonuç bilinmiyorsa [TARİH], [N] gibi yer tutucu bırak
   ve listele. Yapay zekâ görselini gerçek robot ya da ekip fotoğrafı yerine kullanma.
4. Kural, şablon ya da tasarım değişikliği önerirsen bunun yalnızca bu GitHub deposunda (pull request
   ya da issue) yapılacağını hatırlat; değişikliği sohbette bırakma.
5. Benimle Türkçe konuş. Uzun tire (—) kullanma.
```

## Claude Code

Depo bir Claude Code eklentisi olarak kurulabilir. Terminalde `claude` içinde bir kez:

```text
/plugin marketplace add Charybdis58/irs-studio
/plugin install irs-studio@irs
```

Eklenti, IRS ile ilgili bir iş açıldığında devreye girer; her seferinde depoyu GitHub'dan günceller
(`git pull`, yoksa `git clone`) ve kuralları oradan okur. Eklentinin kendisini güncellemek için ara
sıra `/plugin marketplace update irs`; güncellenmese bile skill depodaki en yeni talimatı okur.

Eklenti kurulamıyorsa: `claude-plugin/skills/irs-studio/` klasörünü `~/.claude/skills/` altına
kopyala. Kopya eskise bile ilk adımda depodaki güncel hali okur.
