console.log = (function (old_function, logger) { 
    return function (text) {
      old_function(text);
      const element = document.createElement("div");
      const txt = document.createTextNode(text);
      element.appendChild(txt);
      logger.appendChild(element);        
      // logger.textContent += text;
    };
} (console.log.bind(console), document.getElementById("error-log")));

function init() {
  buildDependencyMap().then(response => {
    const dependencies = response;
    const html = createDoc(dependencies);
    // console.log(html);
    const iframe = document.querySelector('#mainFrame');
    if (iframe) {
      iframe.srcdoc = html;      
    }
  });
}
function createDoc(dependencies) {
  let html = `
<!doctype html>
<html>
  <head>
    <title>Empty Web</title>
    <meta charset="utf-8">
    <script src="https://unpkg.com/systemjs@0.21.3/dist/system.src.js"></script>
    <script src="lib/systemjs.config.js"></script>
    <script type="text/javascript">
      System.config({
        // map tells the System loader where to look for things
        map: {
          ${dependencies.map(d => mapDependency(d))}
        }
      });
      System.import('index.js');
      console.log('ready...');  
    </script>
  </head>
  <body>
    <h4>Inside...</h4>
  </body>
</html>`;
  return html;  
}
function mapDependency(d) {
  return `'${d.key}':          '${d.value}',`;  
}
function buildDependencyMap() {
  let dependencies = [];
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
          const valueUri = `npm:${key}@${value}/${main}`;
          console.log('valueUri', valueUri);
          dependencies.push({key, value:valueUri});
          if (index === len) {
            console.log('resolving...');
            resolve(dependencies);            
          }
        });
      }
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