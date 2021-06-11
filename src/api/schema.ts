import {makeSchema} from 'nexus';
import {join} from 'path';
import * as types from './graphql';

const ext = process.env.ENV === 'local' ? 'ts' : 'js';

console.log('process.env.ENV', process.env.ENV) //eslint-disable-line

export const schema = makeSchema({
	types,
	outputs: {
		typegen: join(__dirname, '..', `nexus-typegen.${ext}`),
		schema: join(__dirname, '..', 'schema.graphql')
	},
	contextType: {
		module: join(__dirname, `./context.${ext}`),
		export: 'Context'
	}
});
