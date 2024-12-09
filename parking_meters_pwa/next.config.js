/** @type {import('next').NextConfig} */
const os = require('os');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.production' });
const IP_API_PRODUCCION = '172.19.0.37';
const currentIP = Object.values(os.networkInterfaces()).flat().find((iface) => iface && iface.family === 'IPv4' && !iface.internal)?.address;

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  scope: process.env.NODE_ENV === 'development' || currentIP === IP_API_PRODUCCION ? '/' : '/apps/app_pagos_tiempo/',
  sw: "sw.js",
  swSrc: 'public/custom-sw.js', 
});

const isProd = process.env.NODE_ENV === 'production' && currentIP != IP_API_PRODUCCION;

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
  ...(isProd && {
    output: 'export',
    basePath: '/apps/app_pagos_tiempo',
    assetPrefix: '/apps/app_pagos_tiempo/',
  }),
  trailingSlash: true,
});
