module.exports = {
  source: {
    includePattern: '.+\\.ts(doc|x)?$',
    excludePattern: '.+\\.(test|spec).ts',
  },
  'no-cache': true,
  plugins: ['plugins/markdown', './node_modules/jsdoc-babel'],
  babel: {
    extensions: ['ts', 'tsx'],
    ignore: ['**/*.(test|spec).ts'],
    babelrc: false,
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: true,
          },
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread'],
  },
}
