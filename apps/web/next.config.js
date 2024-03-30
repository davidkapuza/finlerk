//@ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const path = require('path');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.benzinga.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    // config.resolve.alias['@nestjs/swagger'] = path.resolve(
    //   __dirname,
    //   '../../node_modules/@nestjs/swagger/dist/extra/swagger-shim',
    // );
    config.module.rules.push({
      test: /\.ts$/,
      loader: path.resolve(__dirname, './dto-adapter.loader.ts'),
      exclude: /node_modules/,
    });
    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
