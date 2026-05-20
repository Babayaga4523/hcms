import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress hydration mismatch warnings for fdprocessedid
  // This is a known React behavior for form processing attributes
  // that differ between server and client rendering
};

export default nextConfig;
