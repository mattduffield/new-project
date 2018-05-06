
function init() {
  createBundle().then(response => {
    const bundle = response;
    const html = createDoc(bundle);
    console.log(html);
  });
}
function createDoc(bundle) {
  let html = `
<!doctype html>
<html>
  <head>
    <title>Empty Web</title>
    <meta charset="utf-8">
    <script>
    ${bundle}
    </script>
  </head>
  <body>
  Hello from inside....    
  </body>
</html>`;
  return html;  
}
function createBundle() {
  let bundle = '';
  return new Promise((resolve, reject) => {
    // read the package.json file
    console.log('attempting to read package.json');
    return axios.get('package.json').then(response => {
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
            bundle += bundle;
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