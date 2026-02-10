import { preview } from 'vite';
import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const ROUTES = ['/', '/contact'];
const DIST = resolve(process.cwd(), 'dist');

async function prerender() {
  // Start Vite preview server on the dist/ output
  const server = await preview({
    preview: { port: 4173, strictPort: true },
  });

  const base = 'http://localhost:4173';
  const browser = await puppeteer.launch({ headless: true });

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle0' });

      // Wait for React to render content into #root
      await page.waitForSelector('#root > *', { timeout: 15000 });

      // Small extra delay for async renders
      await new Promise((r) => setTimeout(r, 1000));

      const html = await page.content();

      // Determine output path
      if (route === '/') {
        writeFileSync(resolve(DIST, 'index.html'), html);
        console.log(`Prerendered: / → dist/index.html`);
      } else {
        const dir = resolve(DIST, route.slice(1));
        mkdirSync(dir, { recursive: true });
        writeFileSync(resolve(dir, 'index.html'), html);
        console.log(`Prerendered: ${route} → dist${route}/index.html`);
      }

      await page.close();
    }
  } finally {
    await browser.close();
    server.httpServer.close();
  }

  console.log('Prerendering complete.');
}

prerender().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
