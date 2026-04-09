import { env } from 'cloudflare:workers';

function parseOrigins(value: string | undefined, fallback: string) {
  return (value || fallback)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function getAllowedCorsOrigins() {
  return parseOrigins(env.CORS_ORIGIN, 'http://localhost:5173');
}

export function getTrustedOrigins() {
  return parseOrigins(env.TRUSTED_ORIGINS, 'http://localhost:5173');
}

export function resolveCorsOrigin(requestOrigin: string | undefined | null) {
  if (!requestOrigin) {
    return '';
  }

  return getAllowedCorsOrigins().includes(requestOrigin) ? requestOrigin : '';
}
