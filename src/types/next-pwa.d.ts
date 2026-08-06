declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  interface NextPWAOptions {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    importScripts?: string[];
    [key: string]: unknown;
  }

  const withPWA: (options: NextPWAOptions) => (config: NextConfig) => NextConfig;
  export default withPWA;
}
