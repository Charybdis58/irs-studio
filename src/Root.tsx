import { Composition, Still, getRemotionEnvironment } from 'remotion';
import { FontKapisi } from './marka/font';
import { DilBaglami } from './pafta/olcu';
import { ORNEKLER, SABLONLAR, type SablonAdi } from './sablonlar';
import { Video, type VideoProps } from './video/Video';

const FPS = 30;

// Örnekler yalnızca Studio'da: render sırasında Remotion varsayılanları eksik alanlara doldurur,
// yer tutucu ("[SON BAŞVURU]") sessizce yayına girer. Renderda eksik alan eksik kalır.
const STUDIO = getRemotionEnvironment().isStudio;

function postBileseni<S extends SablonAdi>(ad: S) {
  const Sablon = SABLONLAR[ad] as React.ComponentType<(typeof ORNEKLER)[S]>;
  return function Post(props: (typeof ORNEKLER)[S]) {
    return (
      <FontKapisi>
        <DilBaglami.Provider value={props.dil ?? 'tr'}>
          <Sablon {...props} />
        </DilBaglami.Provider>
      </FontKapisi>
    );
  };
}

const videoOrnegi: VideoProps = { sablon: 'Post', icerik: ORNEKLER.Post, sure: 8 };

export function Root() {
  return (
    <>
      {(Object.keys(SABLONLAR) as SablonAdi[]).map((ad) => (
        <Still
          key={ad}
          id={ad}
          component={postBileseni(ad) as unknown as React.ComponentType<Record<string, unknown>>}
          width={1080}
          height={1440}
          defaultProps={(STUDIO ? ORNEKLER[ad] : {}) as unknown as Record<string, unknown>}
        />
      ))}
      <Composition
        id="Video34"
        component={Video as unknown as React.ComponentType<Record<string, unknown>>}
        width={1080}
        height={1440}
        fps={FPS}
        durationInFrames={8 * FPS}
        defaultProps={(STUDIO ? videoOrnegi : {}) as unknown as Record<string, unknown>}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(Number(props.sure ?? 8) * FPS) })}
      />
      <Composition
        id="Video916"
        component={Video as unknown as React.ComponentType<Record<string, unknown>>}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={8 * FPS}
        defaultProps={(STUDIO ? videoOrnegi : {}) as unknown as Record<string, unknown>}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(Number(props.sure ?? 8) * FPS) })}
      />
    </>
  );
}
