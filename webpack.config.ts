import * as path from 'path';
import * as webpack from 'webpack';
import StatoscopePlugin from '@statoscope/webpack-plugin';

import DeadcodePlugin from './plugin/deadcodePlugin';

const config: webpack.Configuration = {
    mode: 'production',
    entry: {
        root: './src/pages/example.tsx',
        root2: './src/pages/sample.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
    },
    plugins: [
        new DeadcodePlugin(),
        new StatoscopePlugin({
            saveStatsTo: 'stats.json',
            saveOnlyStats: false,
            open: false,
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        fallback: {
            "buffer": require.resolve("buffer"),
            "stream": false,
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            }
        ]
    },
}

export default config;