import {ApolloServer} from 'apollo-server';
import {schema} from './schema';
import {context} from './context';
import {loadEnvFile} from './env';

let server: ApolloServer;

export const createServer = async (): Promise<ApolloServer> => {
	if (server) {
		return server;
	}

	try {
		await loadEnvFile();
	} catch (err) {
		console.log('Failed to set envvars', err);
	}

	server = new ApolloServer({schema, context});
	return server;
};
