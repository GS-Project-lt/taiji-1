module.exports =  {
    publicPath: process.env.NODE_ENV === 'production' ? "./" : "/",
    devServer: {
        // host: 'api.zuxun.net',
        // port: '',
        proxy: {
            '/api': {
                target: 'https://api.zuxun.net/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '' 
                }
            }
        }
    }
}