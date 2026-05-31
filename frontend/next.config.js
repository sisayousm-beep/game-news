/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 워크스페이스 루트를 이 폴더로 고정 (상위의 다른 lockfile 경고 제거)
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;
