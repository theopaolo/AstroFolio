import { defineConfig, sharpImageService } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(),mdx(), sitemap()],
  experimental: {
    assets: true
  },
  image: {
    service: sharpImageService(),
  },
});


  