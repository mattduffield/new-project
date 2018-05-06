
function init() {
	// read the package.json file
	console.log('attempting to read package.json');
	axios.get('package.json').then(response => {
		const {status, data} = response;
		console.log('package.json', data);
	});
}

init();