import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Runs api/chat.js inside the Vite dev server so `npm run dev` can use the AI.
function localApi(env) {
  return {
    name: 'local-api',
    configureServer(server) {
      Object.assign(process.env, env); // make .env keys visible to the handler
      server.middlewares.use('/api/chat', async (req, res) => {
        try {
          let raw = '';
          for await (const chunk of req) raw += chunk;
          req.body = raw ? JSON.parse(raw) : {};
          res.status = (code) => { res.statusCode = code; return res; };
          res.json = (obj) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(obj));
          };
          const { default: handler } = await server.ssrLoadModule('/api/chat.js');
          await handler(req, res);
        } catch (err) {
          console.error(err);
          res.statusCode = 500;
          res.end('{}');
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), localApi(loadEnv(mode, process.cwd(), ''))],
}));