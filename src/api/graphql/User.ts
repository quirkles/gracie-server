import {extendType, mutationField, nonNull, objectType, stringArg, unionType} from 'nexus';
import {getToken, verifyToken} from '../auth';
import {decrypt, encrypt} from '../encrypt';
import {AlternateResponse, resolveAlternateResponse} from './AlternateResponses';

export const User = objectType({
	name: 'User',
	definition(t) {
		t.string('id');
		t.string('name');
		t.string('role');
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

export const validateTokenQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('validateToken', {
			type: 'Boolean',
			args: {
				token: nonNull(stringArg())
			},
			resolve(_root, args, _ctx) {
				try {
					verifyToken(args.token);
					return true;
				} catch {
					return false;
				}
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
				return decrypt(encrypted);
			}
		});
	}
});

export const AuthorizeResponse = unionType({
	name: 'AuthorizeResponse',
	definition(t) {
		t.members('UserWithToken', 'UserNotFound', 'ServerError');
	},
	resolveType(item) {
		console.log(item) //eslint-disable-line
		let __typename: 'UserWithToken' | 'UserNotFound' | 'ServerError' | null = null;
		if ('message' in item) {
			if ('reason' in item) {
				__typename = resolveAlternateResponse(item as AlternateResponse) as 'UserNotFound' | 'ServerError';
			} else {
				__typename = 'UserNotFound';
			}
		} else if ('user' in item && 'token' in item) {
			__typename = 'UserWithToken';
		}

		if (!__typename) {
			throw new Error('Could not resolve the type of data passed to union type "LoginUserResponse"');
		}

		return __typename;
	}
});

export const CreateUserResponse = unionType({
	name: 'CreateUserResponse',
	definition(t) {
		t.members('User', 'BadInput', 'Unauthorized', 'ServerError');
	},
	resolveType(item) {
		let __typename: 'BadInput' | 'Unauthorized' | 'User' | 'ServerError' | null = null;
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
		let user;
		try {
			user = await ctx.prisma.user.findFirst({
				where: {name, password: encryptedPassword}
			});
		} catch (err) {
			return {
				message: (err as Error).message,
				reason: 'Unknown'
			};
		}

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

		const {name, password} = args;
		const encryptedPassword = await encrypt(password);
		try {
			return await ctx.prisma.user.create({
				data: {
					name,
					password: encryptedPassword
				}
			});
		} catch {
			return {
				message: 'Failed to create user',
				reason: 'BadInput'
			};
		}
	}
});
