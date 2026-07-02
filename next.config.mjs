/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    // Add all domains that serve images used on the site
    domains: ['localhost', 'images.unsplash.com', 'aban.agency', 'www.aban.agency'],
  },
  // Ensure uploaded files are served correctly
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
