(function (global) {
  System.config({
    baseURL: "src",
    // baseURL: "https://mattduffield.github.io/new-project/",
    transpiler: 'plugin-babel',
    // meta: {
    //   '*.js': {
    //     babelOptions: {
    //       stage0: true,
    //       // The following loads the plugin: transform-decorators-legacy
    //       plugins: ['https://fec.blob.core.windows.net/bundles/babel-plugin-transform-decorators-legacy/decorators-plugin-build.js'],
    //     }        
    //   },
    // },
    paths: {
      // paths serve as alias
      'npm:': 'https://unpkg.com/'
    },
    // map tells the System loader where to look for things
    map: {
      // SystemJS Plugins
      'plugin-babel':               'npm:systemjs-plugin-babel@0.0.25/plugin-babel.js',
      'systemjs-babel-build':       'npm:systemjs-plugin-babel@0.0.25/systemjs-babel-browser.js',
      'plugin-css':                 'npm:systemjs-plugin-css@0.1.37/css.js',
      'babel-polyfill':             'npm:babel-polyfill@^6.26.0/dist/polyfill.min.js',
      'bluebird':                   'npm:bluebird@3.5.1/js/browser/bluebird.min.js'
      // 'app': './',
    },
    packages: {
      src: {
        format: "amd",
        main: "main.js",
        defaultExtension: 'js',
        meta: {
          '*.css': {
            loader: 'plugin-css'
          },
          '*.js': {
            loader: 'systemjs-loader.js'
          },
        }
      }
    }
  });
})(this);

