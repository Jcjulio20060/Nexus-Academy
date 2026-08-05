import { createHmac, timingSafeEqual } from 'crypto';

const SECRET = process.env['AUTH_SECRET'] ?? 'please-change-this-secret';
const ALGORITHM = 'HS256';

function base64url(input: Buffer) {
  return input.toString('base64url');
}

function serialize(obj: unknown) {
  return base64url(Buffer.from(JSON.stringify(obj), 'utf8'));
}

function deserialize(tokenPart: string) {
  return JSON.parse(Buffer.from(tokenPart, 'base64url').toString('utf8')) as Record<string, unknown>;
}

export function signToken(payload: Record<string, string | number>) {
  const header = serialize({ alg: ALGORITHM, typ: 'JWT' });
  const body = serialize(payload);
  const signature = createHmac('sha256', SECRET).update(`${header}.${body}`).digest();
  return `${header}.${body}.${base64url(signature)}`;
}

export function verifyToken(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');
  const [header, body, signature] = parts;
  const expected = createHmac('sha256', SECRET).update(`${header}.${body}`).digest();
  const received = Buffer.from(signature, 'base64url');
  if (received.length !== expected.length || !timingSafeEqual(expected, received)) {
    throw new Error('Invalid token signature');
  }

  const data = deserialize(body);
  return data;
}
