import {extendType, mutationField, nonNull, objectType, stringArg, unionType} from 'nexus';
import {getToken} from '../auth';
import {Role} from './Role';
import {decrypt, encrypt} from '../encrypt';
import {AlternateResponse, resolveAlternateResponse} from './AlternateResponses';

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

export const encryptTest = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('encryptTest', {
			args: {
				text: nonNull(stringArg())
			},
			type: 'String',
			async resolve(_root, args, _ctx) {
				const {text} = args;
				const encrypted = await encrypt(text);
				const decrypted = await decrypt(encrypted);
				return decrypted;
			}
		});
	}
});

export const AuthorizeResponse = unionType({
	name: 'AuthorizeResponse',
	definition(t) {
		t.members('UserWithToken', 'UserNotFound');
	},
	resolveType(item) {
		const __typename =
			'message' in item ? 'UserNotFound' : 'token' in item ? 'UserWithToken' : null;
		if (!__typename) {
			throw new Error('Could not resolve the type of data passed to union type "LoginUserResponse"');
		}

		return __typename;
	}
});

export const CreateUserResponse = unionType({
	name: 'CreateUserResponse',
	definition(t) {
		t.members('User', 'BadInput', 'Unauthorized');
	},
	resolveType(item) {
		console.log(item) //eslint-disable-line
		let __typename: 'BadInput' | 'Unauthorized' | 'User' | null = null;
		if ('message' in item && 'reason' in item) {
			__typename = resolveAlternateResponse(item as AlternateResponse);
		} else if ('id' in item) {
			__typename = 'User';
		}

		if (__typename === null) {
			throw new Error('Could not resolve the type of data passed to union type "CreateUserResponse"');
		}

		return Promise.resolve(__typename);
	}
});

export const authorize = mutationField('authorize', {
	type: 'AuthorizeResponse',
	args: {
		name: nonNull(stringArg()),
		password: nonNull(stringArg())
	},
	async resolve(_root, args, ctx) {
		const {name, password} = args;
		const encryptedPassword = await encrypt(password);
		const user = await ctx.prisma.user.findFirst({
			where: {name, password: encryptedPassword},
			include: {role: true}
		});
		if (!user) {
			return {
				message: 'No matching user found'
			};
		}

		const {id} = user;
		const token = getToken({id});
		return {user, token};
	}
});

export const createUser = mutationField('createUser', {
	type: 'CreateUserResponse',
	args: {
		name: nonNull(stringArg()),
		password: nonNull(stringArg()),
		roleName: nonNull(stringArg())
	},
	async resolve(_root, args, ctx) {
		const {session} = ctx;
		const {id} = session || {};
		if (!id) {
			return {
				message: 'Not permitted',
				reason: 'Unauthorized'
			};
		}

		const user = await ctx.prisma.user.findUnique({where: {id}});

		if (!user?.isAdmin) {
			return {
				message: 'Not permitted',
				reason: 'Unauthorized'
			};
		}

		const {name, password, roleName} = args;
		const encryptedPassword = await encrypt(password);
		try {
			return await ctx.prisma.user.create({
				data: {
					name,
					password: encryptedPassword,
					role: {
						connect: {
							name: roleName
						}
					}
				},
				include: {role: true}
			});
		} catch {
			return {
				message: 'Failed to create user',
				reason: 'BadInput'
			};
		}
	}
});
