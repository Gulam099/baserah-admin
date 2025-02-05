/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config options here */
  // https://nextjs.org/docs/advanced-features/i18n-routing
  i18n: {
    localeDetection: false, // 👈
    locales: ["ar", "en"], // 👈
    defaultLocale: "en", // 👈
  },
};

export default nextConfig;
