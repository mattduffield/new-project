
function init() {
	// read the package.json file
	console.log('attempting to read package.json');
	axios.get('package.json').then(response => {
		const {status, data} = response;
		console.log('package.json', data);
    // We are interested in the dependencies section.
    for (const [key, value] of Object.entries(data.dependencies)) {
      console.log(`${key} ${value}`);
      const path = `https://unpkg.com/${key}@${value}/package.json`;
      // Need to send a request to unpkg.com
      axios.get('').then(pkg => {
        console.log('pkg', pkg.data);
      });
    }
	});
}

init();