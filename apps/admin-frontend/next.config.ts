import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Monorepo: trace deps from repo root so workspace packages resolve hoisted deps (recharts, zod, etc.)
    outputFileTracingRoot: path.join(__dirname, "..", ".."),
    transpilePackages: ["@corpora/api-client", "@corpora/ui", "@corpora/utils"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
};

export default nextConfig;
