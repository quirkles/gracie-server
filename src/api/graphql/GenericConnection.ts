import {nonNull, objectType} from 'nexus';
import {NexusObjectTypeDef} from 'nexus/dist/definitions/objectType';
import {NexusGenFieldTypeNames} from '../../nexus-typegen';
import {User} from './User';

export const PageInfo = objectType({
	name: 'PageInfo',
	definition(t) {
		t.boolean('hasNextPage');
		t.boolean('hasPreviousPage');
		t.string('startCursor');
		t.string('endCursor');
	}
});
export const createConnectionType = <T extends keyof NexusGenFieldTypeNames>(typeForConnection: NexusObjectTypeDef<T>) => {
	const typeName = typeForConnection.name;
	return objectType({
		name: `${typeName}Connection` as string,
		definition(t) {
			t.nonNull.list.field('edges', {
				type: objectType({
					name: 'Edge',
					definition(t) {
						t.field('node', {
							type: typeForConnection
						});
					}
				})
			});
			t.field('pageInfo', {
				type: nonNull(PageInfo)
			});
		}
	});
};
// ObjectType({
//     name: 'User',
// 	definition(t) {
//         t.field('location', {
// 			// reference the friend type via type def reference
// 			type: Location,
// 		})
// 	},
// }
