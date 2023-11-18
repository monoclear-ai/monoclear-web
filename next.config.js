/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    rewrites: async () => {
        return [
          {
            source: "/backend/:path*",
            destination:
              process.env.NODE_ENV === "development"
                ? "http://127.0.0.1:8000/backend/:path*"
                : "/backend/",
          },
          {
            source: "/docs",
            destination:
              process.env.NODE_ENV === "development"
                ? "http://127.0.0.1:8000/docs"
                : "/backend/docs",
          },
          {
            source: "/openapi.json",
            destination:
              process.env.NODE_ENV === "development"
                ? "http://127.0.0.1:8000/openapi.json"
                : "/backend/openapi.json",
          },
        ];
      },
};
  
module.exports = nextConfig;
