// Kullanım: npm run uret -- icerik/<dosya>.json [daha fazla .json] [--taslak]
// Bir içerik dosyası bir post, bir carousel ya da bir video tarif eder (biçim: icerik/OKU-BENI.md).
// Köşeli parantezli yer tutucu ("[BAŞLIK]") kalmışsa --taslak olmadan üretmez: yayına yer tutucu çıkmaz.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const taslak = argv.includes('--taslak');
const dosyalar = argv.filter((a) => !a.startsWith('--'));
if (!dosyalar.length) {
  console.error('Kullanım: npm run uret -- icerik/<dosya>.json [--taslak]');
  process.exit(1);
}

const remotion = (args) =>
  execFileSync(process.execPath, [join(KOK, 'node_modules/@remotion/cli/remotion-cli.js'), ...args, '--log=error'], {
    cwd: KOK,
    stdio: 'inherit',
  });

function yerTutucular(deger, yol = '') {
  if (typeof deger === 'string') return /\[[^\]]+\]/.test(deger) ? [`${yol}: ${deger}`] : [];
  if (Array.isArray(deger)) return deger.flatMap((d, i) => yerTutucular(d, `${yol}[${i}]`));
  if (deger && typeof deger === 'object') return Object.entries(deger).flatMap(([k, v]) => yerTutucular(v, yol ? `${yol}.${k}` : k));
  return [];
}

// Görseli verilmeyen şablon çizimde yer tutucu gösterir; JSON'da köşeli parantez olmasa da eksiktir.
const ZORUNLU_GORSEL = { SponsorPost: ['logo'] };
// Rev C: sosyal gövde en fazla 25 kelime.
const GOVDE_SINIRI = 25;

function sayfalariAl(tarif) {
  return (Array.isArray(tarif.icerik) ? tarif.icerik : [tarif.icerik]).map((s) => ({
    ...tarif.ortak,
    ...s,
    sablon: s.sablon ?? tarif.sablon,
  }));
}

function eksikGorseller(tarif) {
  return sayfalariAl(tarif).flatMap((s, i) => {
    const alanlar = ZORUNLU_GORSEL[s.sablon] ?? [];
    return alanlar.length && !alanlar.some((a) => s[a]) ? [`sayfa ${i + 1}: ${alanlar.join(' ya da ')} yok`] : [];
  });
}

function uyarilar(tarif) {
  return sayfalariAl(tarif).flatMap((s, i) => {
    const kelime = s.govde ? s.govde.trim().split(/\s+/).length : 0;
    return kelime > GOVDE_SINIRI ? [`sayfa ${i + 1}: gövde ${kelime} kelime (Rev C: en fazla ${GOVDE_SINIRI})`] : [];
  });
}

const isler = dosyalar.map((d) => {
  const tarif = JSON.parse(readFileSync(resolve(d), 'utf8'));
  const sorun = [...yerTutucular(tarif.icerik, 'icerik'), ...yerTutucular(tarif.ortak ?? {}, 'ortak'), ...eksikGorseller(tarif)];
  if (sorun.length && !taslak) {
    console.error(`${d}: yer tutucu var, üretilmedi (taslak için --taslak):\n  ${sorun.join('\n  ')}`);
    process.exit(1);
  }
  for (const u of uyarilar(tarif)) console.warn(`${d}: uyarı: ${u}`);
  return { dosya: d, tarif };
});

console.log('Paketleniyor...');
const PAKET = join(KOK, '.bundle');
rmSync(PAKET, { recursive: true, force: true });
remotion(['bundle', 'src/index.ts', '--out-dir', PAKET]);

const GECICI = join(KOK, '.gecici');
mkdirSync(GECICI, { recursive: true });

for (const { dosya, tarif } of isler) {
  const ad = basename(dosya, '.json');
  const hedefKlasor = join(KOK, 'cikti', ad);
  mkdirSync(hedefKlasor, { recursive: true });
  const propsYaz = (props, ek) => {
    const yol = join(GECICI, `${ad}${ek}.json`);
    writeFileSync(yol, JSON.stringify(props));
    return yol;
  };

  if (tarif.tur === 'video') {
    const komp = tarif.format === '9:16' ? 'Video916' : 'Video34';
    const cikti = join(hedefKlasor, `${ad}${tarif.format === '9:16' ? '-9x16' : ''}.mp4`);
    const props = { sablon: tarif.sablon, icerik: tarif.icerik, sure: tarif.sure ?? 8, ses: tarif.ses, sonundaSol: tarif.sonundaSol ?? true };
    console.log(`Video: ${cikti}`);
    remotion(['render', PAKET, komp, cikti, `--props=${propsYaz(props, '')}`, '--codec=h264', '--crf=18']);
    continue;
  }

  // Post ya da carousel: icerik bir dizi ise her öge bir sayfa; antetteki sayfa hücresi "02 / 05".
  const sayfalar = sayfalariAl(tarif);
  const iki = (n) => String(n).padStart(2, '0');
  sayfalar.forEach((props, i) => {
    if (sayfalar.length > 1 && !props.sayfa) props.sayfa = `${iki(i + 1)} / ${iki(sayfalar.length)}`;
    const cikti = join(hedefKlasor, sayfalar.length > 1 ? `${ad}-${iki(i + 1)}.png` : `${ad}.png`);
    console.log(`Post: ${cikti}`);
    const { sablon, ...icerik } = props;
    remotion(['still', PAKET, sablon, cikti, `--props=${propsYaz(icerik, `-${i}`)}`]);
  });
}

rmSync(GECICI, { recursive: true, force: true });
if (!existsSync(join(KOK, 'cikti'))) process.exit(1);
console.log('Bitti.');
