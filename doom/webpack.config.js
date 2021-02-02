const path = require('path')
//const webpack = require('webpack')

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.glsl$/,
                loader: 'webpack-glsl-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
        // fallback: {
        //     path: false,
        //     zlib: false,
        //     util: require.resolve('util/'),
        //     assert: false,
        //     stream: false,
        //     querystring: false,
        //     url: false,
        //     https: false,
        //     http: false,
        //     fs: false
        // }
    },
    // plugins: [
    //     new webpack.ProvidePlugin({
    //         process: 'process/browser'
    //     })
    // ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}
