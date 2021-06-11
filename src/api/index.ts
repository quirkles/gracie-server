import {createServer} from './server';
import {baseLogger} from './context';

const port = process.env.PORT || 8800;

createServer()
	.then(server => {
		return server.listen({port}).then(({url}) => {
			baseLogger.info(`Server listening at ${url}`);
			console.log(`🚀 Server ready at ${url}`);
		});
	})
	.catch(err => {
		console.error(err) //eslint-disable-line
	});
