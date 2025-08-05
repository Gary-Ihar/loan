import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    favicon: './static/favicon.ico',
    title: 'Loan Calc',
  },
  output: {
    assetPrefix: '/loan/',
  },
});
