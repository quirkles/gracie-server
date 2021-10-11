import {enumType, extendType} from 'nexus';

const RoleType = enumType({
	name: 'RoleType',
	members: [
		'AUNTIE',
		'DAD',
		'FRIEND',
		'GRANDDAD',
		'GRANDMA',
		'ME',
		'MUM',
		'NO_RELATION',
		'UNCLE'
	]
});

export const RoleQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.list.field('getRoles', {
			type: RoleType,
			resolve(_root, _args, _ctx) {
				return [
					'AUNTIE',
					'DAD',
					'FRIEND',
					'GRANDDAD',
					'GRANDMA',
					'ME',
					'MUM',
					'NO_RELATION',
					'UNCLE'
				];
			}
		});
	}
});
