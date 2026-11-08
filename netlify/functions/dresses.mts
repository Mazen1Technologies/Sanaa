import type { Config } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { dresses } from '../../db/schema.js';

const CATEGORIES = ['سهرة', 'أعراس', 'يومي', 'أعياد', 'مناسبات', 'صيفي', 'شتوي', 'قصات الشعر'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function toJson(row: typeof dresses.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    note: row.note,
    liked: row.liked,
    imageUrl: `/api/dress-image/${encodeURIComponent(row.imageKey)}`,
    createdAt: row.createdAt,
  };
}

function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export default async (req: Request) => {
  const match = new URL(req.url).pathname.match(/^\/api\/dresses\/(\d+)$/);
  const id = match ? Number(match[1]) : null;

  if (req.method === 'GET' && id === null) {
    const rows = await db.select().from(dresses).orderBy(desc(dresses.createdAt));
    return Response.json(rows.map(toJson));
  }

  if (req.method === 'POST' && id === null) {
    const form = await req.formData();
    const image = form.get('image');
    const name = String(form.get('name') ?? '').trim().slice(0, 80);
    const category = String(form.get('category') ?? '');
    const note = String(form.get('note') ?? '').trim().slice(0, 500);

    if (!(image instanceof File) || !image.type.startsWith('image/')) return badRequest('الصورة مطلوبة');
    if (image.size > MAX_IMAGE_BYTES) return badRequest('الصورة كبيرة جداً');
    if (!CATEGORIES.includes(category)) return badRequest('تصنيف غير معروف');

    const imageKey = `${Date.now()}-${crypto.randomUUID()}`;
    await getStore('dress-images').set(imageKey, image);

    const [row] = await db
      .insert(dresses)
      .values({ name, category, note, imageKey })
      .returning();
    return Response.json(toJson(row), { status: 201 });
  }

  if (req.method === 'PATCH' && id !== null) {
    const body = (await req.json().catch(() => null)) as { liked?: unknown } | null;
    if (typeof body?.liked !== 'boolean') return badRequest('قيمة غير صحيحة');
    const [row] = await db.update(dresses).set({ liked: body.liked }).where(eq(dresses.id, id)).returning();
    if (!row) return new Response('Not found', { status: 404 });
    return Response.json(toJson(row));
  }

  if (req.method === 'DELETE' && id !== null) {
    const [row] = await db.delete(dresses).where(eq(dresses.id, id)).returning();
    if (!row) return new Response('Not found', { status: 404 });
    await getStore('dress-images').delete(row.imageKey);
    return new Response(null, { status: 204 });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config: Config = {
  path: ['/api/dresses', '/api/dresses/:id'],
};
