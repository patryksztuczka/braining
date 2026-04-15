import { Hono } from 'hono';
import { env, waitUntil } from 'cloudflare:workers';
import { requireAuth, type AuthenticatedUser } from '../../middleware/require-auth';

type ResourcesEnv = {
  Bindings: {
    R2_BUCKET: R2Bucket;
  };
  Variables: {
    authUser: AuthenticatedUser;
  };
};

type CachedResourcesPayload = {
  data: { name: string; prefix: string }[];
  meta: { truncated: boolean; cursor: string | null };
};

const RESOURCES_CACHE_TTL_SECONDS = 60;
const resourcesCacheKey = (userId: string) => `resources:${userId}`;

export class ResourcesRoutes {
  public build() {
    const router = new Hono<ResourcesEnv>();

    router.use('*', requireAuth);

    router.get('/', async (c) => {
      try {
        const cacheKey = resourcesCacheKey(c.get('authUser').id);
        const cached = await env.BRAINING_KV.get(cacheKey);
        if (cached) {
          return c.json(JSON.parse(cached) as CachedResourcesPayload);
        }

        const result = await c.env.R2_BUCKET.list({
          delimiter: '/',
        });

        const directories = result.delimitedPrefixes
          .map((directoryPrefix) => ({
            name: this.getDirectoryName(directoryPrefix),
            prefix: directoryPrefix,
          }))
          .sort((left, right) => left.prefix.localeCompare(right.prefix));

        const payload: CachedResourcesPayload = {
          data: directories,
          meta: {
            truncated: result.truncated,
            cursor: result.truncated ? (result.cursor ?? null) : null,
          },
        };

        waitUntil(
          env.BRAINING_KV.put(cacheKey, JSON.stringify(payload), {
            expirationTtl: RESOURCES_CACHE_TTL_SECONDS,
          }),
        );

        return c.json(payload);
      } catch (error) {
        console.error(error);
        return c.json({ error: 'Internal server error' }, 500);
      }
    });

    return router;
  }

  private getDirectoryName(directoryPrefix: string) {
    return directoryPrefix.replace(/\/$/, '');
  }
}
