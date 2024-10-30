// /** @type {import('next').NextConfig} */

// const withPWA = require('next-pwa')({
// 	dest: 'public',
// 	register: true,
// 	skipWaiting: true,
// 	swDest: 'sw.js',
// 	disable: process.env.NODE_ENV === 'production'
//   });

// const settings = {
//   env: {
//   },
//   devIndicators: {
//     autoPrerender: false,
//   },
//   pwa: {
//     dest: 'public',
//   },
// };

// module.exports = process.env.NODE_ENV === 'development' ? settings : withPWA(settings);

// // const withPWA = require('next-pwa')({
// // 	dest: 'public',
// // 	register: true,
// // 	skipWaiting: true,
// // 	swDest: 'sw.js',
// // 	disable: process.env.NODE_ENV === 'production'
// //   });
  
// //   const dotenv = require('dotenv');
// //   dotenv.config({ path: '.env.local' });
  
// //   module.exports = withPWA({
// // 	// output: 'export',
// // 	reactStrictMode: true,
// // 	env: {
// // 	//   unoptimized: process.env.NODE_ENV !== 'production' ? 'true' : 'false',
// // 	  ODOO_HOST: process.env.ODOO_HOST,
// // 	  ODOO_PORT: process.env.ODOO_PORT,
// // 	  ODOO_DATABASE: process.env.ODOO_DATABASE,
// // 	  ODOO_USERNAME: process.env.ODOO_USERNAME,
// // 	  ODOO_PASSWORD: process.env.ODOO_PASSWORD,
// // 	  ODOO_PROTOCOL: process.env.ODOO_PROTOCOL,
// // 	},
// // 	// basePath: process.env.NODE_ENV === 'production' ? '/apps/app_pagos_tiempo' : '',
// // 	// assetPrefix: process.env.NODE_ENV === 'production' ? '/apps/app_pagos_tiempo/' : '',
// // 	trailingSlash: true,
// //   });

  /** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
	dest: 'public',
	register: true,
	skipWaiting: true,
	swDest: 'sw.js',
})

module.exports = withPWA({
	reactStrictMode: true,
	// env: {
	//   unoptimized: process.env.NODE_ENV !== 'production',
	// },
	// basePath: process.env.NODE_ENV === 'production' ? '/apps/app_pagos_tiempo' : '',
	// assetPrefix: process.env.NODE_ENV === 'production' ? '/apps/app_pagos_tiempo/' : '',
	trailingSlash: true,
});

const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

module.exports = {
  env: {
    ODOO_HOST: process.env.ODOO_HOST,
    ODOO_PORT: process.env.ODOO_PORT,
    ODOO_DATABASE: process.env.ODOO_DATABASE,
    ODOO_USERNAME: process.env.ODOO_USERNAME,
    ODOO_PASSWORD: process.env.ODOO_PASSWORD,
    ODOO_PROTOCOL: process.env.ODOO_PROTOCOL,
  },
};
  