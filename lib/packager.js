
function init() {
  buildDependencyMap().then(response => {
    const dependencies = response;
    const html = createDoc(bundle);
    // console.log(html);
    const iframe = document.querySelector('#mainFrame');
    if (iframe) {
      iframe.srcdoc = html;
    }
  });
}
function createDoc(bundle) {
  let html = `
<!doctype html>
<html>
  <head>
    <title>Empty Web</title>
    <meta charset="utf-8">
    <script src="https://unpkg.com/systemjs@0.21.3/dist/system.src.js"></script>
    <script type="text/javascript">
      System.config({
        //baseURL: "src",
        transpiler: 'plugin-babel',
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
          'bluebird':                   'npm:bluebird@3.5.1/js/browser/bluebird.min.js',
          ${dependencies.map(d => mapDependency(d))}
        }
      });
    </script>
    <script type="text/javascript">
      System.import('index.js');
    </script>    
  </head>
  <body>
  Hello from inside....    
  </body>
</html>`;
  return html;  
}
function mapDependency(d) {
  return `'${d.key}:      'npm:${d.value}',`;  
}
function buildDependencyMap() {
  let map = [];
  return new Promise((resolve, reject) => {
    // read the package.json file
    console.log('attempting to read package.json');
    axios.get('package.json').then(response => {
      const {status, data} = response;
      console.log('package.json', data);
      // We are interested in the dependencies section.
      const len = Object.entries(data.dependencies).length;
      let index = 0;
      for (const [key, value] of Object.entries(data.dependencies)) {
        index++;
        console.log(`${key} ${value}`);
        map.push({key, value});
      }
      resolve(map);
    });
  });
}
function createBundle() {
  let bundle = '';
  return new Promise((resolve, reject) => {
    // read the package.json file
    console.log('attempting to read package.json');
    axios.get('package.json').then(response => {
      const {status, data} = response;
      console.log('package.json', data);
      // We are interested in the dependencies section.
      const len = Object.entries(data.dependencies).length;
      let index = 0;
      for (const [key, value] of Object.entries(data.dependencies)) {
        index++;
        console.log(`${key} ${value}`);
        // Load package.json e.g. https://unpkg.com/lodash@4.17.4/package.json
        const pkgUri = `https://unpkg.com/${key}@${value}/package.json`;
        axios.get(pkgUri).then(pkg => {
          console.log('pkg', pkg.data);
          const {main} = pkg.data;
          // Now load the main entry e.g. https://unpkg.com/lodash@4.17.4/lodash.js
          const mainUri = `https://unpkg.com/${key}@${value}/${main}`;
          axios.get(mainUri).then(mainResp => {
            // console.log('main', mainResp.data);
            bundle += mainResp.data;
            if (index === len) {
              console.log('resolving...');
              resolve(bundle);
            }
          });
        });
      }
    });
  });
}

init();