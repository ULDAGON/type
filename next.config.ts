import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully client-side app — export as static files for plain file hosting.
  output: "export",
};

export default nextConfig;
