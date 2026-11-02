import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import { useEffect, useState, type ReactNode } from 'react';
import { continueRender, delayRender } from 'remotion';

// Rev C: başlık Barlow Condensed, gövde Barlow, etiket IBM Plex Mono. Başka font yok.
export const FONT = {
  head: "'Barlow Condensed', 'Bahnschrift Condensed', sans-serif",
  body: "'Barlow', Arial, sans-serif",
  mono: "'IBM Plex Mono', 'Courier New', monospace",
} as const;

// Türkçe harfler latin-ext dosyasında; örnek metin vermezsek o dosya yüklenmeden kare alınabilir.
const ORNEK = 'AZaz09İıŞşĞğÜüÖöÇç';
const YUKLENECEK = [
  `700 100px ${FONT.head}`,
  `600 100px ${FONT.head}`,
  `400 34px ${FONT.body}`,
  `500 34px ${FONT.body}`,
  `600 34px ${FONT.body}`,
  `400 20px ${FONT.mono}`,
  `500 20px ${FONT.mono}`,
  `600 20px ${FONT.mono}`,
];

/** Fontlar yüklenene kadar içeriği çizmez; ölçümler (sigdir) ancak bundan sonra doğru çıkar. */
export function FontKapisi({ children }: { children: ReactNode }) {
  const [hazir, setHazir] = useState(false);
  const [tutamak] = useState(() => delayRender('fontlar'));
  useEffect(() => {
    Promise.all(YUKLENECEK.map((f) => document.fonts.load(f, ORNEK))).then(() => {
      setHazir(true);
      continueRender(tutamak);
    });
  }, [tutamak]);
  return hazir ? <>{children}</> : null;
}
