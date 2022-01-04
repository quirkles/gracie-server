import {arg, enumType, inputObjectType, nonNull, objectType} from 'nexus';
import {NexusObjectTypeDef} from 'nexus/dist/definitions/objectType';
import {NexusGenFieldTypeNames} from '../../nexus-typegen';

export const PageInfo = objectType({
	name: 'PageInfo',
	definition(t) {
		t.boolean('hasNextPage');
		t.boolean('hasPreviousPage');
		t.string('startCursor');
		t.string('endCursor');
	}
});

const PaginationArguments = inputObjectType({
	name: 'PaginationArguments',
	definition(t) {
		t.string('before');
		t.int('last');
		t.string('after');
		t.int('first');
	}
});

export const SortOrderEnum = enumType({
	name: 'SortOrderEnum',
	members: {
		ASC: 'ASC',
		DESC: 'DESC'
	}
});

const SortArguments = inputObjectType({
	name: 'SortArguments',
	definition(t) {
		t.string('sortBy');
		t.field('sortOrder', {type: SortOrderEnum});
	}
});

export const connectionArguments = {
	sortArguments: arg({
		type: SortArguments,
		default: {
			sortOrder: 'ASC',
			sortBy: 'createdAt'
		}
	}),
	paginationArguments: arg({
		type: PaginationArguments,
		description: 'Pagination arguments as defined here: https://relay.dev/graphql/connections.htm#sec-Arguments',
		default: {
			first: 10
		}
	})
};

export const createConnectionType = <T extends keyof NexusGenFieldTypeNames>(typeForConnection: NexusObjectTypeDef<T>) => {
	const typeName = typeForConnection.name;
	return objectType({
		name: `${typeName}Connection` as string,
		definition(t) {
			t.nonNull.list.field('edges', {
				type: objectType({
					name: 'Edge',
					definition(t) {
						t.string('cursor');
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
