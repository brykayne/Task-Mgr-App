var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './scripts/app.js',
    output: {
        path: __dirname,
        filename: 'dist/bundle.js'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: path.join(__dirname, 'scripts'),
                query: {
                    presets: 'es2015',
                },
            }
        ]
    },
    plugins: [
        //Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin()
    ]
};
