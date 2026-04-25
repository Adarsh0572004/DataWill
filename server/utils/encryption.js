import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

function getKey() {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    // Auto-generate a key in development (NOT secure for production)
    console.warn('⚠️  No ENCRYPTION_KEY set — using fallback. Set ENCRYPTION_KEY in .env for production.');
    return crypto.scryptSync('datawill-dev-fallback-key', 'salt', 32);
  }
  // Expect a 64-char hex string (32 bytes)
  return Buffer.from(key, 'hex');
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a string in format: iv:encrypted:authTag (all hex-encoded)
 */
export function encrypt(plaintext) {
  if (!plaintext) return '';
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${encrypted}:${authTag}`;
}

/**
 * Decrypts a string encrypted by the encrypt function.
 */
export function decrypt(encryptedText) {
  if (!encryptedText || !encryptedText.includes(':')) return '';
  const key = getKey();
  const parts = encryptedText.split(':');
  if (parts.length !== 3) return '';

  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const authTag = Buffer.from(parts[2], 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
