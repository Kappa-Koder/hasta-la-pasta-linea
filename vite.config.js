import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// GitHub Pages pubblica il sito sotto /<nome-repo>/: tutti i percorsi passano da qui.
const BASE = process.env.BASE_PATH || '/hasta-la-pasta-linea/';
globalThis.HLP_BASE = BASE;

const TEMPLATES = resolve(__dirname, 'src/linea/templates.js');

// Segnaposto <!--@nome--> riempiti in build dai template, con i contenuti di src/shared/data.js.
function renderPage() {
  let server = null;
  return {
    name: 'hlp-render-page',
    configureServer(s) { server = s; },
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const mod = server ? await server.ssrLoadModule(TEMPLATES) : await import(pathToFileURL(TEMPLATES).href);
        return html.replace(/<!--@([\w-]+)-->/g, (m, name) => {
          if (!mod[name]) throw new Error(`template "${name}" mancante`);
          return mod[name]();
        });
      },
    },
  };
}

// Precarica il peso regolare di Poppins (Archivo è precaricato direttamente in index.html).
function preloadFonts() {
  return {
    name: 'hlp-preload-fonts',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const files = Object.keys(ctx.bundle).filter((f) => /poppins-latin-400-normal-.*\.woff2$/.test(f));
        return { html, tags: files.map((f) => ({ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `${BASE}${f}`, crossorigin: '' }, injectTo: 'head-prepend' })) };
      },
    },
  };
}

export default defineConfig({
  base: BASE,
  plugins: [renderPage(), preloadFonts()],
  build: { target: 'es2020' },
  server: { port: 5174 },
});
