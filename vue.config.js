module.exports =  {
    devServer: {
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