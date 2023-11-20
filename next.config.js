/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: 'export',
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        }); // 针对 SVG 的处理规则
        return config;
    },
    compiler:{
        removeConsole: process.env.NODE_ENV === 'production',
    }
}

module.exports = nextConfig