import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static: `next build` writes plain HTML/CSS/JS to `out/`.
  output: "export",
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
