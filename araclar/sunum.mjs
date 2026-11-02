// Kullanım: npm run sunum -- icerik/<dosya>.json [--taslak] [--png]
// Sunumu (1600 x 900, IRS-GDL-001 Rev C) HTML olarak kurar, başsız Chrome/Edge ile PDF'e basar.
// --png her slaytı ayrıca PNG olarak verir (denetim ve paylaşım için).
// Yer tutucu ("[TUTAR]") kalmışsa --taslak olmadan üretmez. Slayt tipleri: icerik/OKU-BENI.md.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const KOK = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const taslak = argv.includes('--taslak');
const png = argv.includes('--png');
const dosya = argv.find((a) => !a.startsWith('--'));
if (!dosya) {
  console.error('Kullanım: npm run sunum -- icerik/<dosya>.json [--taslak] [--png]');
  process.exit(1);
}

const TARAYICILAR = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];
const tarayici = TARAYICILAR.find(existsSync);
if (!tarayici) {
  console.error('Chrome ya da Edge bulunamadı.');
  process.exit(1);
}

const tarif = JSON.parse(readFileSync(resolve(dosya), 'utf8'));
const yt = JSON.stringify(tarif).match(/\[[^\]"]+\]/g);
if (yt && !taslak) {
  console.error(`${dosya}: yer tutucu var, üretilmedi (taslak için --taslak): ${[...new Set(yt)].join(', ')}`);
  process.exit(1);
}

const ad = basename(dosya, '.json');
const hedef = join(KOK, 'cikti', ad);
mkdirSync(hedef, { recursive: true });
const yol = (p) => relative(hedef, join(KOK, p)).replaceAll('\\', '/');

const kac = (s = '') =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// Gövdede yalnızca **kalın** biçimi; yer tutucular taslakta işaretlenir.
const metin = (s = '') =>
  kac(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[[^\]]+\]/g, (m) => `<span class="yt">${m}</span>`);
// Adres, e-posta ve @kullanıcı adı büyük harfe çevrilmez (src/pafta/olcu.ts ile aynı kural).
const DOKUNULMAZ = /(\S+@\S+\.\S+|@[\w.]+|(?:https?:\/\/)?[\w-]+(?:\.[\w-]+)*\.(?:com|org|net|edu|tr|io|dev)(?:\/\S*)?)/gi;
const ust = (s = '') =>
  s
    .split(DOKUNULMAZ)
    .map((p, i) => (i % 2 === 1 ? p : p.toLocaleUpperCase('tr-TR')))
    .join('');

const KOORD = {
  x: ['1', '2', '3', '4', '5', '6'],
  y: ['A', 'B', 'C', 'D'],
};
const koord = (sinif, dizi) => `<div class="koord ${sinif}" aria-hidden="true">${dizi.map((d) => `<span>${d}</span>`).join('')}</div>`;

function gorsel(s) {
  if (!s.gorsel) return `<div class="yer">${kac(s.gorselNotu ?? '[GÖRSEL]')}</div>`;
  return `<img src="${kac(yol(s.gorsel))}" alt="${kac(s.fig ?? '')}">`;
}

const fig = (s, n) => (s.fig ? `<div class="fig">FIG. ${String(n).padStart(2, '0')} / ${metin(ust(s.fig))}</div>` : '');
const bas = (s) =>
  `${s.etiket ? `<p class="etiket">${metin(s.etiket)}</p>` : ''}<h1>${metin(ust(s.baslik))}</h1>${s.govde ? `<p class="govde">${metin(s.govde)}</p>` : ''}`;

const TIPLER = {
  kapak: (s) =>
    `${bas(s)}<img class="sembol" src="${yol('marka/logo/logo-fil.svg')}" alt="">`,
  metin: (s) => bas(s),
  gorsel: (s, n) => `${bas(s)}<div class="ana">${gorsel(s)}${fig(s, n)}</div>`,
  iki: (s, n) =>
    `${s.etiket ? `<p class="etiket">${metin(s.etiket)}</p>` : ''}<h1>${metin(ust(s.baslik))}</h1>
     <div class="govdeler"><div><p class="govde">${metin(s.govde)}</p></div><div class="ana">${gorsel(s)}${fig(s, n)}</div></div>`,
  maddeler: (s) =>
    `${bas(s)}<ol>${(s.maddeler ?? []).map((m, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><div>${metin(m)}</div></li>`).join('')}</ol>`,
  sayilar: (s) =>
    `${bas(s)}<div class="kutular">${(s.sayilar ?? [])
      .map((x) => `<div class="kutu"><div><span class="deger">${metin(x.deger)}</span><span class="birim">${metin(x.birim ?? '')}</span></div><div class="ne">${metin(x.ne)}</div></div>`)
      .join('')}</div>${s.kaynak ? `<p class="fig">KAYNAK / ${metin(ust(s.kaynak))}</p>` : ''}`,
  kapanis: (s) => `${bas(s)}${s.cagri ? `<span class="cagri">${metin(s.cagri)}</span>` : ''}`,
};

const toplam = tarif.sayfalar.length;
const iki = (n) => String(n).padStart(2, '0');
const slaytlar = tarif.sayfalar
  .map((s, i) => {
    const cizici = TIPLER[s.tip];
    if (!cizici) throw new Error(`Bilinmeyen slayt tipi: ${s.tip} (tipler: ${Object.keys(TIPLER).join(', ')})`);
    const tip = s.tip === 'gorsel' ? 'gorselli' : s.tip === 'iki' ? 'iki gorselli' : s.tip;
    return `<section class="slayt ${tip}" id="s${i + 1}" lang="tr">
  <div class="dis"></div><div class="ic"></div>
  ${koord('ust', KOORD.x)}${koord('alt', KOORD.x)}${koord('sol', KOORD.y)}${koord('sag', KOORD.y)}
  <div class="ustbant"><span>IRS / ${metin(ust(tarif.seri ?? ''))}</span><span class="orta">${metin(ust(s.bolum ?? ''))}</span><span class="sag">REV ${kac(tarif.rev ?? 'A')}</span></div>
  <div class="icerik">${cizici(s, i + 1)}</div>
  <div class="antet">
    <div><img src="${yol('marka/logo/logo-yatay.svg')}" alt="IZTECH Robotic Systems"></div>
    <div><small>Başlık</small><b>${metin(ust(s.antet ?? s.baslik))}</b></div>
    <div><small>Çizim no.</small><b>${kac(tarif.kod)}</b></div>
    <div><small>Rev</small><b>${kac(tarif.rev ?? 'A')}</b></div>
    <div><small>Tarih</small><b>${metin(tarif.tarih)}</b></div>
    <div><small>Pafta</small><b>${iki(i + 1)} / ${iki(toplam)}</b></div>
  </div>
</section>`;
  })
  .join('\n');

const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<title>${kac(tarif.kod)} ${kac(tarif.seri ?? '')}</title>
<link rel="stylesheet" href="${yol('sunum/pafta.css')}">
</head>
<body>
${slaytlar}
<script>
  // PNG önizleme: adres #3 ise yalnızca 3. slayt gösterilir.
  const n = location.hash.slice(1);
  if (n) { document.body.classList.add('tek'); document.getElementById('s' + n)?.classList.add('secili'); }
</script>
</body>
</html>
`;

const htmlYolu = join(hedef, `${ad}.html`);
writeFileSync(htmlYolu, html);
const adres = pathToFileURL(htmlYolu).href;
const ortak = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--virtual-time-budget=8000'];

const pdf = join(hedef, `${ad}.pdf`);
execFileSync(tarayici, [...ortak, '--no-pdf-header-footer', `--print-to-pdf=${pdf}`, adres], { stdio: 'ignore' });
console.log(`PDF: ${pdf}`);

if (png) {
  for (let i = 1; i <= toplam; i++) {
    const cikti = join(hedef, `${ad}-${iki(i)}.png`);
    execFileSync(tarayici, [...ortak, '--window-size=1600,900', `--screenshot=${cikti}`, `${adres}#${i}`], { stdio: 'ignore' });
    console.log(`PNG: ${cikti}`);
  }
}
