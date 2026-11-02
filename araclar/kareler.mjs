// Kullanım: npm run kareler -- <video> [saniye aralığı, varsayılan 1]
// Videodan eşit aralıklı kareler alıp tek bir temas sayfasına (PNG) dizer. Claude videoyu
// izleyemez; çıktıyı bu sayfaya bakarak denetler. Çıktı: cikti/_kontrol/<ad>-kareler.png
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [video, aralikArg = '1'] = process.argv.slice(2);
if (!video) {
  console.error('Kullanım: npm run kareler -- <video> [saniye aralığı]');
  process.exit(1);
}
const aralik = Number(aralikArg);
const sure = Number(
  execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', video], { encoding: 'utf8' }).trim(),
);
const adet = Math.max(1, Math.floor(sure / aralik));
const sutun = Math.min(6, adet);
const satir = Math.ceil(adet / sutun);
const klasor = join(KOK, 'cikti', '_kontrol');
mkdirSync(klasor, { recursive: true });
const cikti = join(klasor, `${basename(video, extname(video))}-kareler.png`);

execFileSync(
  'ffmpeg',
  [
    '-loglevel', 'error', '-y', '-i', resolve(video),
    '-vf', `fps=1/${aralik},scale=320:-1,drawtext=fontfile=marka/font/Barlow_600SemiBold.ttf:text='%{pts\\:hms}':x=8:y=8:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.6,tile=${sutun}x${satir}:padding=4:color=white`,
    '-frames:v', '1', cikti,
  ],
  // fontfile göreli yol: Windows sürücü harfindeki iki nokta filtre sözdizimini bozar.
  { stdio: 'inherit', cwd: KOK },
);
console.log(`${adet} kare (${sure.toFixed(1)} sn, ${aralik} sn aralık): ${cikti}`);
