const withLess = require("next-with-less");

/**
 * @type {import('next').NextConfig}
 */
module.exports = () => {
  // Add other plugins like Sentry,
  
  const plugins = [withLess];
  return plugins.reduce(
    (acc, next) => {
      if (next.name === "withLess") {
        return next(acc, {
          lessLoaderOptions: {
            javascriptEnabled: true,
          },
        });
      }

      return next(acc);
    },
    {
      // the rest of next.js config
      reactStrictMode: true,
      swcMinify: true,
      // Add TypeScript configuration to ignore build errors
      typescript: {
        ignoreBuildErrors: true,
      },
    }
  );
};
