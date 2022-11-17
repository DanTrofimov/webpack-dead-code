module.exports = {
    validate: {
        plugins: ['@statoscope/webpack'],
        rules: {
            '@statoscope/webpack/build-time-limits': ['error', 5000],
            '@statoscope/webpack/entry-download-size-limits': ['error', { global: { maxSize: 3 * 1024 * 100 } }],
            '@statoscope/webpack/no-packages-dups': ['error'],
        }
    }
}