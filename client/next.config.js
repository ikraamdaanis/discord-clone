/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.externals.push({
      "utf-8-validate": "commonjs utfd-8-validate",
      bufferutil: "commonjs bufferutil"
    });

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ["uploadthing.com", "utfs.io"],
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  }
};

module.exports = nextConfig;
