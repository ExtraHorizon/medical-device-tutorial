export const config = () => ({
  entryPoints: ['src/index.js'],
  logLevel: 'info',
  bundle: true,
  outfile: 'public/main.js',
  publicPath: '/',
  loader: {
    '.svg': 'file',
    '.png': 'file',
    '.html': 'copy',
  },
  define: {
    global: 'window',
    'process.env': `{ "CLIENT_ID": "${process.env.CLIENT_ID}", "BACKEND_URL": "${process.env.BACKEND_URL}" }`,
  },
});
