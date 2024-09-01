/**
 * Reference: https://nextjs.org/docs/basic-features/font-optimization
 * More fonts: https://fonts.google.com/
 * Also, you can use local fonts: https://nextjs.org/docs/basic-features/font-optimization#local-fonts
 */
import { Red_Hat_Text, Raleway } from 'next/font/google';
import localFont from 'next/font/local';

// Primary font (Google font)
export const primary = Red_Hat_Text({
  variable: '--primary-font',
  subsets: ['latin'],
  display: 'swap',
});

// Secondary font (Google font)
export const secondary = Raleway({
  variable: '--secondary-font',
});

// Local font
export const localPrimary = localFont({
  src: [
    {
      path: '/fonts/MyLocalFont-Regular.woff2', // Adjust this path to the correct location of your local font files
      weight: '400',
      style: 'normal',
    },
    {
      path: '/fonts/MyLocalFont-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--local-primary-font',
  display: 'swap',
});

/**
 * Defined variables are available throughout your CSS file.
 * e.g: { font-family: var(--local-primary-font) }
 */
export const fonts: string = [
  primary.className,
  primary.variable,
  secondary.variable,
  localPrimary.variable,
].join(' ');
