// Kullanım: node araclar/woff-ttf.mjs <girdi.woff> <çıktı.ttf>
// FFmpeg'in altyazı motoru (libass) WOFF okuyamıyor, sistemde kurulu olmayan fontu da göremiyor.
// WOFF 1.0 yalnızca zlib ile sıkıştırılmış SFNT tablolarıdır; tabloları açıp TTF olarak yeniden dizer.
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const [girdi, cikti] = process.argv.slice(2);
const w = readFileSync(girdi);
if (w.toString('ascii', 0, 4) !== 'wOFF') throw new Error(`${girdi} WOFF 1.0 değil`);

const flavor = w.readUInt32BE(4);
const sayi = w.readUInt16BE(12);
const tablolar = Array.from({ length: sayi }, (_, i) => {
  const o = 44 + i * 20;
  const [ofset, sikisik, asil, toplam] = [w.readUInt32BE(o + 4), w.readUInt32BE(o + 8), w.readUInt32BE(o + 12), w.readUInt32BE(o + 16)];
  const ham = w.subarray(ofset, ofset + sikisik);
  return { etiket: w.subarray(o, o + 4), toplam, veri: sikisik < asil ? inflateSync(ham) : ham };
});

const us = Math.floor(Math.log2(sayi));
const aramaAraligi = 2 ** us * 16;
const basKismi = 12 + sayi * 16;
const hizali = (n) => (n + 3) & ~3;
const boyut = tablolar.reduce((t, x) => t + hizali(x.veri.length), basKismi);
const s = Buffer.alloc(boyut);
s.writeUInt32BE(flavor, 0);
s.writeUInt16BE(sayi, 4);
s.writeUInt16BE(aramaAraligi, 6);
s.writeUInt16BE(us, 8);
s.writeUInt16BE(sayi * 16 - aramaAraligi, 10);

let ofset = basKismi;
tablolar.forEach((t, i) => {
  const o = 12 + i * 16;
  t.etiket.copy(s, o);
  s.writeUInt32BE(t.toplam, o + 4);
  s.writeUInt32BE(ofset, o + 8);
  s.writeUInt32BE(t.veri.length, o + 12);
  t.veri.copy(s, ofset);
  ofset += hizali(t.veri.length);
});
writeFileSync(cikti, s);
console.log(`${cikti} (${sayi} tablo)`);
