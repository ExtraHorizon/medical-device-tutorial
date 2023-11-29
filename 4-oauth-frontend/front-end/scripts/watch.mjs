/* eslint-disable import/no-extraneous-dependencies */
import esbuild from 'esbuild';
import { config } from './config.mjs';
import http from 'node:http';

const context = await esbuild.context(config());

const listenPort = 3000;

await context.watch();
const { host, port } = await context.serve({ servedir: 'dist' });

if(process.env.PROXY_BACKEND_URL === undefined) {
  throw new Error('PROXY_BACKEND_URL is undefined. Set it in either your shell or a \'.env\' file');
}

const proxy = http.createServer((req, res) => {
  const forwardRequest = path => {
    let fwHost = host;
    let fwPort = port;

    if(path.startsWith('/api')) {
      const newUrl =  new URL(process.env.SLCT_PROXY_BACKEND_URL);
      fwHost = newUrl.hostname;
      fwPort = newUrl.port;
    }

    const options = {
      hostname: fwHost,
      port: fwPort,
      path,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = http.request(options, proxyRes => {
      if (proxyRes.statusCode === 404) {
        forwardRequest('/');
        return;
      }
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });
  };
  forwardRequest(req.url);
});
proxy.listen(listenPort);
console.log(`Dev server running at http://localhost:${listenPort}`);
