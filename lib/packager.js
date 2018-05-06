
function init() {
	// read the package.json file
	console.log('attempting to read package.json');
	axios.get('package.json').then(response => {
		const {status, data} = response;
		console.log('package.json', data);
    // We are interested in the dependencies section.
    for (const [key, value] of Object.entries(data.dependencies)) {
      console.log(`${key} ${value}`);
      // Load package.json e.g. https://unpkg.com/lodash@4.17.4/package.json
      const pkgUri = `https://unpkg.com/${key}@${value}/package.json`;
      axios.get(pkgUri).then(pkg => {
        console.log('pkg', pkg.data);
        const {main} = pkg.data;
        // Now load the main entry e.g. https://unpkg.com/lodash@4.17.4/lodash.js
        const mainUri = `https://unpkg.com/${key}@${value}/${main}`;
        axios.get(mainUri).then(mainResp => {
          console.log('main', mainResp.data);
        });
      });
    }
	});
}

init();