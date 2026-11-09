import type { Category, Dress } from '@/lib/dresses';

const CATEGORY_BY_FOLDER: Record<string, Category> = {
  اعراس: 'أعراس',
  سهرة: 'سهرة',
  شتوي: 'شتوي',
  صيفي: 'صيفي',
  أعياد: 'أعياد',
  مناسبات: 'مناسبات',
  يومي: 'يومي',
};

const imageModules = import.meta.glob(
  [
    '/اعراس/*.{jpg,jpeg,jfif,png,webp}',
    '/سهرة/*.{jpg,jpeg,jfif,png,webp}',
    '/شتوي/*.{jpg,jpeg,jfif,png,webp}',
    '/صيفي/*.{jpg,jpeg,jfif,png,webp}',
    '/أعياد/*.{jpg,jpeg,jfif,png,webp}',
    '/مناسبات/*.{jpg,jpeg,jfif,png,webp}',
    '/يومي/*.{jpg,jpeg,jfif,png,webp}',
  ],
  { eager: true, import: 'default', query: '?url' }
);

export const BUNDLED_DRESSES: Dress[] = Object.entries(imageModules)
  .sort(([first], [second]) => first.localeCompare(second))
  .flatMap(([path, imageUrl], index) => {
    const folder = path.split('/')[1];
    const category = CATEGORY_BY_FOLDER[folder];
    if (!category || typeof imageUrl !== 'string') return [];
    const pathParts = path.split('/');
    const name = (pathParts[pathParts.length - 1] ?? '').replace(/\.[^.]+$/, '');

    return [
      {
        id: -(index + 1),
        name,
        category,
        note: '',
        liked: false,
        imageUrl,
        createdAt: '',
        staticKey: path,
      },
    ];
  });
