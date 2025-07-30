/** @type {import('next').NextConfig} */

const nextConfig = {
  i18n: {
    locales: ["en", "ar"],
    defaultLocale: "en",
    localeDetection: false,
  },
};

export default nextConfig;

export const i18n = {
  localeDetection: false, // 👈
  locales: ["ar", "en"], // 👈
  defaultLocale: "en", // 👈
};
export const typescript = {
  // ✅ Ignore TypeScript build errors
  ignoreBuildErrors: true,
};
export const eslint = {
  // ✅ Ignore ESLint errors during builds
  ignoreDuringBuilds: true,
};
export function webpack(config, { nextRuntime }) {
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
}
