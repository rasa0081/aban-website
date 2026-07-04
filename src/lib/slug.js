export function generateSlug(title, existingSlugs = []) {
  if (!title) return '';
  let slug = title.trim().replace(/\s+/g, '-').replace(/[^\w\u0600-\u06FF-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
  let uniqueSlug = slug, counter = 2;
  while (existingSlugs.includes(uniqueSlug)) { uniqueSlug = `${slug}-${counter}`; counter++; }
  return uniqueSlug;
}