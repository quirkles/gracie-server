import {objectType, extendType, mutationField, nonNull, stringArg, unionType} from 'nexus';
import {getToken} from '../auth';
import {Role} from './Role';
export const User = objectType({
	name: 'User',
	definition(t) {
		t.string('id');
		t.string('name');
		t.field('role', {
			type: Role,
			resolve(root, _args, ctx) {
				return ctx.prisma.user.findUnique({where: {id: root.id as string}, include: {role: true}}).then(user => user?.role || null);
			}
		});
	}
});

export const UserWithToken = objectType({
	name: 'UserWithToken',
	definition(t) {
		t.field('user', {
			type: User
		});
		t.string('token');
	}
});

export const UserNotFound = objectType({
	name: 'UserNotFound',
	definition(t) {
		t.string('message');
	}
});

export const UserQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('getUserById', {
			type: 'User',
			resolve() {
				return {
					id: 'abcd',
					name: 'harry'
				};
			}
		});
	}
});

export const LoginUserResponse = unionType({
	name: 'LoginUserResponse',
	definition(t) {
		t.members('UserWithToken', 'UserNotFound');
	},
	resolveType(item) {
		const __typename =
			'message' in item ? 'UserNotFound' : 'token' in item ? 'UserWithToken' : null;
		if (!__typename) {
			console.log(item) //eslint-disable-line
			throw new Error('Could not resolve the type of data passed to union type "LoginUserResponse"');
		}

		return __typename;
	}
});

export const loginUser = mutationField('loginUser', {
	type: 'LoginUserResponse',
	args: {
		name: nonNull(stringArg()),
		password: nonNull(stringArg())
	},
	async resolve(_root, args, ctx) {
		const {name, password} = args;
		const user = await ctx.prisma.user.findFirst({where: {name, password}, include: {role: true}});
		if (!user) {
			return {
				message: 'No matching user found'
			};
		}

		const {role} = user;
		const token = getToken({name, role: role.name as string});
		return {user, token};
	}
});
