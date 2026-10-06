import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Security headers are set in middleware.ts to avoid duplicate CSP headers
  // and to allow per-request nonce generation.
  turbopack: {},
  webpack: async (config, { isServer }) => {
    if (!isServer) {
      const { sentryWebpackPlugin } = (await import('@sentry/webpack-plugin')) as { sentryWebpackPlugin: (opts: Record<string, unknown>) => unknown };
      const options: Record<string, unknown> = {
        silent: true,
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        sourcemaps: { disable: false },
      };
      config.plugins.push(sentryWebpackPlugin(options));
    }
    return config;
  },
};

export default withNextIntl(nextConfig);