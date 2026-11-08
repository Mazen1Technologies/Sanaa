import type { Config, Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

export default async (_req: Request, context: Context) => {
  const key = context.params.key;
  if (!key) return new Response('Not found', { status: 404 });

  const image = await getStore('dress-images').get(key, { type: 'blob' });
  if (!image) return new Response('Not found', { status: 404 });

  return new Response(image, {
    headers: {
      'Content-Type': image.type || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};

export const config: Config = {
  path: '/api/dress-image/:key',
};
