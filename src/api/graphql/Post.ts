import {arg, inputObjectType, mutationField, nonNull, objectType, unionType} from 'nexus';
import {User} from './User';
import {AlternateResponse, resolveAlternateResponse} from './AlternateResponses';
import {CreateMediaInput, Media} from './Media';

export const Post = objectType({
	name: 'Post',
	definition(t) {
		t.string('id');
		t.string('title');
		t.string('date');
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
		t.list.field('media', {
			type: Media,
			resolve(root, _args, ctx) {
				return ctx.prisma.post.findUnique({
					where: {
						id: root.id as string
					},
					include: {media: true}
				}).then(post => post?.media || []);
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

export const CreatePostInput = inputObjectType({
	name: 'CreatePostInput',
	definition(t) {
		t.nonNull.string('title');
		t.string('body');
		t.string('date');
		t.list.field('media', {type: nonNull(CreateMediaInput)});
	}
});
export const createPost = mutationField('createPost', {
	type: 'CreatePostResponse',
	args: {
		input: arg({type: nonNull(CreatePostInput)})
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

		const {input} = args;
		const {title, body, date} = input;
		let {media} = input;
		if (!media) {
			media = [];
		}

		const dateTime: Date = date ? new Date(date) : new Date();

		return ctx.prisma.post.create({
			data: {
				title,
				body,
				date: dateTime,
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
				},
				media: {
					create: (media || [])
				}
			},
			include: {contributors: true}
		}).then(post => ({
			...post,
			date: post.date.toUTCString()
		})).catch(err => {
			ctx.logger.error(err as Error);
			return {
				message: 'Failed to create post',
				reason: 'BadInput'
			};
		});
	}
});
