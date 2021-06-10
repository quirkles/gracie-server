import {mutationField, nonNull, objectType, stringArg, unionType} from 'nexus';
import {User} from './User';
import {AlternateResponse, resolveAlternateResponse} from './AlternateResponses';

export const Post = objectType({
	name: 'Post',
	definition(t) {
		t.string('id');
		t.string('title');
		t.string('body');
		t.list.field('contributors', {
			type: User,
			resolve(root, _args, ctx) {
				return ctx.prisma.post.findUnique({
					where: {
						id: root.id as string
					},
					include: {contributors: {include: {user: true}}}
				}).then(post => post?.contributors.map(contributor => contributor.user) || []);
			}
		});
	}
});

export const CreatePostResponse = unionType({
	name: 'CreatePostResponse',
	definition(t) {
		t.members('Post', 'BadInput', 'Unauthorized');
	},
	resolveType(item) {
		console.log(item) //eslint-disable-line
		let __typename: 'BadInput' | 'Unauthorized' | 'Post' | null = null;
		if ('message' in item && 'reason' in item) {
			__typename = resolveAlternateResponse(item as AlternateResponse);
		} else if ('id' in item) {
			__typename = 'Post';
		}

		if (__typename === null) {
			throw new Error('Could not resolve the type of data passed to union type "CreateUserResponse"');
		}

		return Promise.resolve(__typename);
	}
});

export const createPost = mutationField('createPost', {
	type: 'CreatePostResponse',
	args: {
		title: nonNull(stringArg()),
		body: nonNull(stringArg())
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

		const {title, body} = args;

		try {
			return await ctx.prisma.post.create({
				data: {
					title,
					body,
					contributors: {
						create: [
							{
								user: {
									connect: {
										id
									}
								},
								userPostRole: {
									connect: {
										name: 'creator'
									}
								}
							}
						]
					}
				},
				include: {contributors: true}
			});
		} catch (err) {
			ctx.logger.error(err);
			return {
				message: 'Failed to create post',
				reason: 'BadInput'
			};
		}
	}});
