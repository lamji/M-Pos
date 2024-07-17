/**
 * Reference: https://nextjs.org/docs/basic-features/font-optimization
 * More fonts: https://fonts.google.com/
 * Also, you can use local fonts: https://nextjs.org/docs/basic-features/font-optimization#local-fonts
 */
import { Red_Hat_Text, Raleway } from 'next/font/google';

// Primary font
export const primary = Red_Hat_Text({
  variable: '--primary-font',
  subsets: ['latin'],
  display: 'swap',
});

// Secondary font
export const secondary = Raleway({
  variable: '--secondary-font',
});

/**
 * Defined variables are available throughout your css file.
 * e.g: { font-family: var(--secondary-font) }
 */
export const fonts: string = [primary.className, primary.variable, secondary.variable].join(' ');
