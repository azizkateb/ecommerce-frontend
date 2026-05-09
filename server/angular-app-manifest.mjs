
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://azizkateb.github.io/ecommerce-frontend/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "route": "/ecommerce-frontend"
  },
  {
    "renderMode": 0,
    "route": "/ecommerce-frontend/login"
  },
  {
    "renderMode": 0,
    "route": "/ecommerce-frontend/home"
  },
  {
    "renderMode": 0,
    "route": "/ecommerce-frontend/admin/add-product"
  },
  {
    "renderMode": 0,
    "route": "/ecommerce-frontend/admin/dashboard"
  },
  {
    "renderMode": 0,
    "route": "/ecommerce-frontend/product/*"
  },
  {
    "renderMode": 0,
    "route": "/ecommerce-frontend/products"
  },
  {
    "renderMode": 0,
    "route": "/ecommerce-frontend/cart"
  },
  {
    "renderMode": 0,
    "route": "/ecommerce-frontend/checkout"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 18229, hash: '48ed53fff0d246688f2c50c721d7799d94b8c0176ce6e89dbb2def3db4931cfe', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 12451, hash: '1d80438a12c5720fb17d22a513c1be8edd9ef8dc633d9b60c0401a4f28387a70', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-WQVNX676.css': {size: 29421, hash: 'r+INkY7KgZI', text: () => import('./assets-chunks/styles-WQVNX676_css.mjs').then(m => m.default)}
  },
};
