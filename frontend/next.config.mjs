/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
        ],
      },
    ];
  },
  images: {
    domains: ["lh3.googleusercontent.com", "https://lh3.googleusercontent.com"],
  },
};

export default nextConfig;
