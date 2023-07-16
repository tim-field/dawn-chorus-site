/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chorus.mohiohio.com",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
}

module.exports = nextConfig
