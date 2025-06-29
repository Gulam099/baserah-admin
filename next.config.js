// /** @type {import('next').NextConfig} */

// const nextConfig = {
//   i18n: {
//     localeDetection: false, // 👈
//     locales: ["ar", "en"], // 👈
//     defaultLocale: "en", // 👈
//   },
// };

// export default nextConfig;

module.exports = {
  i18n: {
    localeDetection: false, // 👈
    locales: ["ar", "en"], // 👈
    defaultLocale: "en", // 👈
  },
  typescript: {
    // ✅ Ignore TypeScript build errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  webpack: (config, { nextRuntime }) => {
    // load worker files as a urls with `file-loader`
    if (nextRuntime === "nodejs") {
      config.resolve.alias.canvas = false;
    }
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[contenthash].[ext]",
            publicPath: "_next/static/worker",
            outputPath: "static/worker",
          },
        },
      ],
    });

    return config;
  },
};
