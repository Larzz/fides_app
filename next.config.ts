import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	// Removed output: 'export' to enable API routes and server-side functionality
	// API routes require a Node.js server and cannot be statically exported
	images: { unoptimized: true },
}

export default nextConfig
