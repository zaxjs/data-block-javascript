module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        corejs: {
          version: 3,
          proposals: true,
        },
        useBuiltIns: 'usage',
      },
    ],
    '@babel/typescript',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/proposal-object-rest-spread',
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-class-properties'],
  ],
  ignore: ['*.min.js'],
}
