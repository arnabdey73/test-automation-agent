import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
// import node from '@astrojs/node';
// Import the Vercel adapter for deployment to Vercel
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  // Enable server-side rendering for API routes
  output: 'server',
  // Use Vercel adapter for deployment to Vercel
  adapter: vercel({
    analytics: true,
    includeFiles: ['.env.production'],
    maxDuration: 60, // Set function timeout to 60 seconds
    target: 'node20',
    functionPerRoute: false, // Use a single function for all routes
    deploy: {
      cleanup: true, // Clean up deprecated functions to avoid deployment issues
      buildOutputDirectory: '.vercel/output',
      entrypoint: 'entry.mjs', // Explicitly set the entrypoint
    },
  }),
  
  // For local production testing, comment out the Vercel adapter above and uncomment this:
  // adapter: node({
  //   mode: 'standalone',
  // }),
  // Set up server configuration
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4000,
    host: true
  },
  // Production optimizations
  build: {
    format: 'file',
    assets: 'assets'
  },
  // Improved caching for production
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      assetsInlineLimit: 4096,
      sourcemap: false,
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
      rollupOptions: {
        // Explicitly externalize modules to avoid build issues
        external: [
          'socket.io', 
          'playwright',
          'playwright-core',
          '@playwright/test'
        ]
      },
    },
    ssr: {
      // Add modules to noExternal to ensure they're processed properly
      noExternal: [
        'socket.io', 
        'socket.io-client', 
        'engine.io-client', 
        'engine.io'
      ]
    }
  },
});
