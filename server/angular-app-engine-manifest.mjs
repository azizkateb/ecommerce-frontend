
export default {
  basePath: 'https://azizkateb.github.io/ecommerce-frontend',
  allowedHosts: [],
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
