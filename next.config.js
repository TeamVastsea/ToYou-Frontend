/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: process.env.NODE_ENV === 'development' ? undefined : 'export',
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        }); // 针对 SVG 的处理规则
        return config;
    },
    compiler:{
        removeConsole: process.env.NODE_ENV === 'production',
    },
    rewrites: process.env.NODE_ENV === 'development' ? ()=>{
        return [
            {
                source: '/api/:path',
                destination: `${process.env.NEXT_PUBLIC_API_SERVER}/:path*`
            }
        ]
    } : undefined
}

module.exports = nextConfig