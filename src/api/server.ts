import {ApolloServer} from 'apollo-server';
import {schema} from './schema';
import {createContext} from './context';

let server: ApolloServer;

export const createServer = async (): Promise<ApolloServer> => {
	if (server) {
		return server;
	}

	server = new ApolloServer({
		schema,
		context: createContext
	});
	return server;
};
