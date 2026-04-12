'use client';

import { FONT_LIST } from './templates/templateShared';

export function FontLoader() {
  const fontQuery = FONT_LIST.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800;900`).join('&');
  const googleFontsUrl = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={googleFontsUrl} rel="stylesheet" />
    </>
  );
}
