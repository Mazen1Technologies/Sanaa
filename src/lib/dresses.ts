export const HAIR_CATEGORY = 'قصات الشعر';
export const CATEGORIES = ['سهرة', 'أعراس', 'يومي', 'أعياد', 'مناسبات', 'صيفي', 'شتوي', HAIR_CATEGORY] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Dress {
  id: number;
  name: string;
  category: Category;
  note: string;
  liked: boolean;
  imageUrl: string;
  createdAt: string;
}

async function ensureOk(response: Response) {
  if (response.ok) return response;
  const body = (await response.json().catch(() => null)) as { error?: string } | null;
  throw new Error(body?.error ?? 'حدث خطأ، حاول مرة أخرى');
}

export async function fetchDresses(): Promise<Dress[]> {
  const response = await ensureOk(await fetch('/api/dresses', { cache: 'no-store' }));
  return response.json();
}

export async function addDress(input: { image: Blob; category: Category; note: string }) {
  const form = new FormData();
  form.append('image', input.image, 'dress.jpg');
  form.append('category', input.category);
  form.append('note', input.note);
  const response = await ensureOk(await fetch('/api/dresses', { method: 'POST', body: form }));
  return (await response.json()) as Dress;
}

export async function setDressLiked(id: number, liked: boolean) {
  const response = await ensureOk(
    await fetch(`/api/dresses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ liked }),
    })
  );
  return (await response.json()) as Dress;
}

export async function deleteDress(id: number) {
  await ensureOk(await fetch(`/api/dresses/${id}`, { method: 'DELETE' }));
}

const MAX_SIDE = 1600;

/** Shrinks phone photos (often 5–12 MB) to a sharp JPEG that uploads quickly. */
export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('تعذّر قراءة الصورة'))), 'image/jpeg', 0.85)
  );
}
