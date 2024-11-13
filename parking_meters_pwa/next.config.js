/** @type {import('next').NextConfig} */

const dotenv = require('dotenv');
dotenv.config({ path: '.env.production' });

const withPWA = require('next-pwa')({
  dest: 'public',
  swSrc: 'public/custom-sw.js',
  register: true,
  skipWaiting: true,
  // scope: process.env.NODE_ENV === 'development' ? '/' : '/apps/app_pagos_tiempo/',
  scope:  '/',
  // sw: "sw.js",
  // disable: process.env.NODE_ENV === 'development',
  publicExcludes: ['!custom-sw.js'],
});

const isProd = process.env.NODE_ENV === 'production';

module.exports = withPWA({
  reactStrictMode: true,
  env: {
    ODOO_HOST: process.env.ODOO_HOST,
    ODOO_PORT: process.env.ODOO_PORT,
    ODOO_DATABASE: process.env.ODOO_DATABASE,
    ODOO_USERNAME: process.env.ODOO_USERNAME,
    ODOO_PASSWORD: process.env.ODOO_PASSWORD,
    ODOO_PROTOCOL: process.env.ODOO_PROTOCOL,
    NEXT_API_REQUEST: process.env.NEXT_API_REQUEST,
  },
  // ...(isProd && {
  //   output: 'export',
  //   basePath: '/apps/app_pagos_tiempo',
  //   assetPrefix: '/apps/app_pagos_tiempo/',
  // }),
  trailingSlash: true,
});
