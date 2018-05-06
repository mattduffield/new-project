
function init() {
	// read the package.json file
	console.log('attempting to read package.json');
	axios.get('package.json').then(result => {
		console.log('package.json', result);
	});
}

init();