import type { ComponentType } from 'react';
import { KapanisPost, type KapanisPostProps } from './post/KapanisPost';
import { Post, type PostProps } from './post/Post';
import { SayiPost, type SayiPostProps } from './post/SayiPost';
import { SponsorPost, type SponsorPostProps } from './post/SponsorPost';

/** Bütün post şablonları. Video da aynı şablonları hareketli çizer, yeni şablon yalnızca buraya eklenir. */
export const SABLONLAR = {
  Post,
  SayiPost,
  KapanisPost,
  SponsorPost,
} as const satisfies Record<string, ComponentType<never>>;

export type SablonAdi = keyof typeof SABLONLAR;

export interface SablonPropsHaritasi {
  Post: PostProps;
  SayiPost: SayiPostProps;
  KapanisPost: KapanisPostProps;
  SponsorPost: SponsorPostProps;
}

const ORTAK = { kod: 'IRS-SOC-000', baslik: '[BAŞLIK]', tarih: '[TARİH]', seri: '[SERİ]', sayfa: '01 / 05' };

/** Remotion Studio'da görünen örnekler (yalnızca Studio; renderda kullanılmaz). */
export const ORNEKLER: SablonPropsHaritasi = {
  Post: {
    ...ORTAK,
    etiket: '[ÜST ETİKET]',
    satirlar: ['[BAŞLIK]'],
    gorsel: '[GÖRSEL]',
    fig: '[KONU / GÖRÜNÜŞ]',
    govde: '[Kısa açıklama, en fazla 25 kelime.]',
  },
  SayiPost: {
    ...ORTAK,
    etiket: '[ÜST ETİKET]',
    satirlar: ['[BAŞLIK]'],
    sayilar: [{ deger: '[N]', birim: '[BİRİM]', ne: '[NE]' }],
    kaynak: '[KAYNAK]',
  },
  KapanisPost: {
    ...ORTAK,
    etiket: '[ÜST ETİKET]',
    satirlar: ['[SATIR 1]', '[SATIR 2]'],
    govde: '[Kısa açıklama.]',
    cagri: '[ÇAĞRI]',
  },
  SponsorPost: {
    ...ORTAK,
    etiket: '[ÜST ETİKET]',
    satirlar: ['[BAŞLIK]'],
    logo: '[SPONSOR LOGOSU]',
    sponsorAdi: '[SPONSOR]',
    katki: '[KATKI]',
    baslangic: '[YIL]',
  },
};
