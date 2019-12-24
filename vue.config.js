module.exports =  {
    publicPath: process.env.NODE_ENV === 'production' ? "./" : "/",
    devServer: {
        // host: 'www.gshsoft.com',
        proxy: {
            '/api': {
                target: 'https://api.zuxun.net/',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''  //通过pathRewrite重写地址，将前缀/api转为/
                }
            }
        }
    }
}