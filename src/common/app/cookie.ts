import Cookies from 'js-cookie';

/**
 * - function that saves cookie
 *
 * @param key - string (cookie key)
 * @param value - string
 */
export const saveCookie = (key: string, value: string) => {
  Cookies.set(key, value);
};

/**
 * - function that retrieves cookie
 *
 * @param key - string (cookie key)
 */
export const getCookie = (key: string) => {
  const cookie = Cookies.get(key) || '';
  return cookie;
};

/**
 * - function that clears access token and refresh token
 */
export const clearCookie = () => {
  Cookies.remove('t');
  // Cookies.remove('rt1');
  // Cookies.remove('rt2');
  // Cookies.remove('cookieID');
};
