// App-layer encryption for secrets at rest (OAuth access/refresh tokens).
// AES-256-GCM with a key derived from TOKEN_ENCRYPTION_KEY. Server-only.
// Format: base64(iv).base64(authTag).base64(ciphertext)

import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

function key(): Buffer {
  const material = process.env.TOKEN_ENCRYPTION_KEY;
  if (!material) throw new Error('TOKEN_ENCRYPTION_KEY is not set');
  return createHash('sha256').update(material).digest(); // 32 bytes
}

export function encryptToken(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString('base64'), tag.toString('base64'), enc.toString('base64')].join('.');
}

export function decryptToken(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split('.');
  if (!ivB64 || !tagB64 || !dataB64) throw new Error('malformed encrypted token');
  const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()]).toString('utf8');
}
