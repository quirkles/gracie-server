import {arg, enumType, extendType, inputObjectType, mutationField, objectType, stringArg} from 'nexus';
import {Prisma} from '@prisma/client';
import {encrypt} from '../encrypt';

export const Media = objectType({
	name: 'Media',
	definition(t) {
		t.string('id');
		t.string('title');
		t.string('caption');
		t.string('type');
	}
});

export const MediaQuery = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.list.field('getMedia', {
			args: {
				type: stringArg()
			},
			type: 'Media',
			async resolve(_root, args, ctx) {
				const {type} = args;
				let media: Prisma.MediaGetPayload<{include: {mediaType: true}}>[];
				if (type) {
					media = await ctx.prisma.media.findMany({
						include: {mediaType: true},
						where: {
							mediaType: {
								type
							}
						}});
				} else {
					media = await ctx.prisma.media.findMany({include: {mediaType: true}});
				}

				return media.map(m => ({
					id: m.id,
					title: m.title,
					caption: m.caption,
					type: m.mediaType.type
				}));
			}
		});
	}
});

const MediaType = enumType({
	name: 'MediaType',
	members: ['IMAGE']
});

export const CreateMediaInput = inputObjectType({
	name: 'CreateMediaInput',
	definition(t) {
		t.nonNull.string('title');
		t.string('caption');
		t.nonNull.string('url');
		t.field('type', {type: MediaType});
	}
});

export const createMedia = mutationField('createUser', {
	type: 'CreateUserResponse',
	args: {
		input: arg({type: CreateMediaInput})
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
