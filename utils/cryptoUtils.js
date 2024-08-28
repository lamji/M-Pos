

import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16 bytes

// Ensure CRYPTO_SECRET_KEY is defined in your environment variables
const CRYPTO_SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

export function encrypt(text) {
  if (!text || !CRYPTO_SECRET_KEY) {
    throw new Error('Text or secret key is missing');
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(CRYPTO_SECRET_KEY, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Return as a single string
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text) {
  if (!text || !CRYPTO_SECRET_KEY) {
    throw new Error('Text or secret key is missing');
  }

  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(CRYPTO_SECRET_KEY, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
