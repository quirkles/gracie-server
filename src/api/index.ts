import {createServer} from './server';
import {baseLogger} from './context';

createServer()
	.then(server => {
		return server.listen().then(({url}) => {
			baseLogger.info(`Server listening at ${url}`);
			console.log(`🚀 Server ready at ${url}`);
		});
	})
	.catch(err => {
		console.error(err) //eslint-disable-line
	});
