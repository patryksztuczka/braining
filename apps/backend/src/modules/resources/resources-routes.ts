import { Hono } from 'hono';
import { requireAuth, type AuthenticatedUser } from '../../middleware/require-auth';

type ResourcesEnv = {
  Bindings: {
    R2_BUCKET: R2Bucket;
  };
  Variables: {
    authUser: AuthenticatedUser;
  };
};

export class ResourcesRoutes {
  public build() {
    const router = new Hono<ResourcesEnv>();

    router.use('*', requireAuth);

    router.get('/', async (c) => {
      try {
        const result = await c.env.R2_BUCKET.list({
          delimiter: '/',
        });

        const directories = result.delimitedPrefixes
          .map((directoryPrefix) => ({
            name: this.getDirectoryName(directoryPrefix),
            prefix: directoryPrefix,
          }))
          .sort((left, right) => left.prefix.localeCompare(right.prefix));

        return c.json({
          data: directories,
          meta: {
            truncated: result.truncated,
            cursor: result.truncated ? result.cursor : null,
          },
        });
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
