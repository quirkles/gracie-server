import {createServer} from './server';

createServer()
	.then(server => {
		return server.listen().then(({url}) => {
			console.log(`🚀 Server ready at ${url}`);
		});
	})
	.catch(err => {
		console.error(err) //eslint-disable-line
	});
