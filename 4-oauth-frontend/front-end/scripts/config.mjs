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
  },
});
