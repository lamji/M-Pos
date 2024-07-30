// import crypto from 'crypto';

// const algorithm = 'aes-256-cbc'; // Choose your algorithm
// const key = Buffer.from(process.env.CRYPTO_SECRET_KEY, 'hex'); // Ensure your key is the correct length
// const iv = crypto.randomBytes(16); // Initialization vector

// const CRYPTO_SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

// export function encrypt(text) {
//   if (!text || !CRYPTO_SECRET_KEY) {
//     throw new Error('Text or secret key is missing');
//   }

//   const iv = crypto.randomBytes(IV_LENGTH);
//   const cipher = crypto.createCipheriv(algorithm, Buffer.from(CRYPTO_SECRET_KEY, 'hex'), iv);
//   let encrypted = cipher.update(text);
//   encrypted = Buffer.concat([encrypted, cipher.final()]);

//   // Return as a single string
//   return iv.toString('hex') + ':' + encrypted.toString('hex');
// }

// export function decrypt(text) {
//   if (!text || !CRYPTO_SECRET_KEY) {
//     throw new Error('Text or secret key is missing');
//   }

//   const textParts = text.split(':');
//   const iv = Buffer.from(textParts.shift(), 'hex');
//   const encryptedText = Buffer.from(textParts.join(':'), 'hex');
//   const decipher = crypto.createDecipheriv(algorithm, Buffer.from(CRYPTO_SECRET_KEY, 'hex'), iv);
//   let decrypted = decipher.update(encryptedText);
//   decrypted = Buffer.concat([decrypted, decipher.final()]);

//   return decrypted.toString();
// }

// export function decrypt(encrypted) {
//   let decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(encrypted.iv, 'hex'));
//   let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
//   return decrypted;
// }

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
