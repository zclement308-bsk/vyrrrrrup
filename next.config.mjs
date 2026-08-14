/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Baseline security headers. Not asked for, but cheap and standard for
  // any public product that handles a login flow (TikTok OAuth here):
  // - X-Frame-Options: blocks the site being embedded in a hidden iframe
  //   for clickjacking (tricking a logged-in user into clicking a fake
  //   "Analyser" button that's actually your real one, invisibly).
  // - X-Content-Type-Options: stops the browser guessing file types.
  // - Referrer-Policy: don't leak the full URL (which can include session
  //   context) to third-party sites you link out to.
  // - Permissions-Policy: this app never needs camera/mic/geolocation.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
