/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.pexels.com",
      "api.byteheart.com",
      "media.devprojecthub.com",
    ],
  },
};

module.exports = nextConfig;
