import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
export const GET: APIRoute = ({ site }) => new Response(
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', ...projects.map(p => `/projets/${p.slug}/`)].map(path => `<url><loc>${new URL(path, site)}</loc></url>`).join('')}</urlset>`,
  { headers: { 'Content-Type': 'application/xml' } },
);
