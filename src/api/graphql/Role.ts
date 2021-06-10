import {extendType, objectType} from 'nexus';
export const Role = objectType({
	name: 'Role',
	definition(t) {
		t.string('id');
		t.string('name');
	}
});

export const RoleQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.list.field('getRoles', {
			type: 'Role',
			resolve(_root, _args, ctx) {
				ctx.logger.info('test');
				return ctx.prisma.role.findMany() || [];
			}
		});
	}
});
