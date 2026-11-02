// FFmpeg kısayolları. Kullanım: npm run ff -- <iş> <argümanlar>
//   kes       <girdi> <baş> <son> <çıktı>      ör. kes ham.mp4 00:00:05 00:00:12 klip.mp4
//   birlestir <çıktı> <girdi1> <girdi2> ...    aynı çözünürlükte olmalı; değilse önce olcekle
//   olcekle   <girdi> <format> <çıktı>          format: 3:4 | 9:16 | 1:1 (kırpıp doldurur)
//   altyazi   <girdi> <srt> <çıktı>             altyazıyı videoya gömer (Barlow)
//   ses       <video> <ses> <çıktı> [düzey]     müziği ekler; düzey 0-1 (varsayılan 0.6), video kadar sürer
//   sessiz    <girdi> <çıktı>                   sesi kaldırır
//   sikistir  <girdi> <çıktı> [crf]             Instagram için H.264, crf varsayılan 23
//   gif       <girdi> <çıktı> [genişlik]        paletli GIF (varsayılan 540)
//   kapak     <girdi> <saniye> <çıktı.png>      tek kare
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [is, ...a] = process.argv.slice(2);
const ff = (...args) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
const H264 = ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];
const OLCU = { '3:4': [1080, 1440], '9:16': [1080, 1920], '1:1': [1080, 1080] };

const isler = {
  kes: ([g, bas, son, c]) => ff('-ss', bas, '-to', son, '-i', g, ...H264, '-crf', '18', '-c:a', 'aac', c),
  birlestir: ([c, ...girdiler]) => {
    const gecici = mkdtempSync(join(tmpdir(), 'irs-'));
    const liste = join(gecici, 'liste.txt');
    writeFileSync(liste, girdiler.map((g) => `file '${resolve(g).replaceAll("'", "'\\''")}'`).join('\n'));
    ff('-f', 'concat', '-safe', '0', '-i', liste, ...H264, '-crf', '18', '-c:a', 'aac', c);
    rmSync(gecici, { recursive: true, force: true });
  },
  olcekle: ([g, format, c]) => {
    const [w, h] = OLCU[format] ?? OLCU['3:4'];
    ff('-i', g, '-vf', `scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},setsar=1`, ...H264, '-crf', '18', '-c:a', 'copy', c);
  },
  altyazi: ([g, srt, c]) => {
    // Windows yolunda sürücü iki noktası filtre sözdizimini bozar; kaçışla verilir.
    const kacir = (y) => resolve(y).replaceAll('\\', '/').replace(':', '\\:');
    // Barlow sistemde kurulu değil; libass'e paketteki font klasörü gösterilir.
    const fontlar = kacir(join(KOK, 'marka/font'));
    const stil = "FontName=Barlow Medium,FontSize=9,PrimaryColour=&H00F7F2EE,OutlineColour=&H00311907,BackColour=&H00311907,BorderStyle=3,Outline=6,Shadow=0,MarginV=40";
    ff('-i', g, '-vf', `subtitles='${kacir(srt)}':fontsdir='${fontlar}':force_style='${stil}'`, ...H264, '-crf', '18', '-c:a', 'copy', c);
  },
  ses: ([v, s, c, duzey = '0.6']) =>
    ff('-i', v, '-i', s, '-filter_complex', `[1:a]volume=${duzey}[m]`, '-map', '0:v', '-map', '[m]', '-c:v', 'copy', '-c:a', 'aac', '-shortest', c),
  sessiz: ([g, c]) => ff('-i', g, '-c:v', 'copy', '-an', c),
  sikistir: ([g, c, crf = '23']) => ff('-i', g, ...H264, '-crf', crf, '-preset', 'slow', '-c:a', 'aac', '-b:a', '128k', c),
  gif: ([g, c, w = '540']) =>
    ff('-i', g, '-vf', `fps=15,scale=${w}:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse`, c),
  kapak: ([g, sn, c]) => ff('-ss', sn, '-i', g, '-frames:v', '1', c),
};

if (!isler[is]) {
  console.error(`Bilinmeyen iş: ${is ?? '(yok)'}. İşler: ${Object.keys(isler).join(', ')}`);
  process.exit(1);
}
isler[is](a);
