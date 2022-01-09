import {Post as PostModel, Prisma} from '@prisma/client';

import {arg, extendType, inputObjectType, mutationField, nonNull, objectType, unionType} from 'nexus';
import {User} from './User';
import {AlternateResponse, resolveAlternateResponse} from './AlternateResponses';
import {SaveMediaInput, Media} from './Media';
import {v4, validate} from 'uuid';
import {PubSub} from '@google-cloud/pubsub';
import {connectionArguments, createConnectionType} from './GenericConnection';
import {prisma} from '../prisma';

export const Post = objectType({
	name: 'Post',
	definition(t) {
		t.string('id');
		t.string('title');
		t.string('date');
		t.string('body');
		t.list.field('contributors', {
			type: nonNull(User),
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
			type: nonNull(Media),
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

export const SavePostResponse = unionType({
	name: 'SavePostResponse',
	definition(t) {
		t.members('Post', 'BadInput', 'Unauthorized', 'ServerError');
	},
	resolveType(item) {
		let __typename: 'BadInput' | 'Unauthorized' | 'Post' | 'ServerError' | null = null;
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

export const SavePostInput = inputObjectType({
	name: 'SavePostInput',
	definition(t) {
		t.string('id');
		t.nonNull.string('title');
		t.string('body');
		t.string('date');
		t.list.field('media', {type: nonNull(SaveMediaInput)});
	}
});

export const savePost = mutationField('savePost', {
	type: 'SavePostResponse',
	args: {
		input: arg({type: nonNull(SavePostInput)})
	},
	async resolve(_root, args, ctx) {
		const {session} = ctx;
		const {id: userId} = session || {};
		if (!userId) {
			return {
				message: 'Not permitted',
				reason: 'Unauthorized'
			};
		}

		const {input} = args;
		const {title, body, date} = input;
		let {media, id: postId} = input;
		if (!media) {
			media = [];
		}

		for (const mediaItem of media) {
			if (!mediaItem.id) {
				const mediaItemId = v4();
				ctx.logger.info(`No id on media item, creating with id ${mediaItemId}`);
				mediaItem.id = mediaItemId;
			}
		}

		if (!postId) {
			postId = v4();
			ctx.logger.info(`No id on post, creating with id ${postId}`);
		}

		const dateTime: Date = date ? new Date(date) : new Date();

		return ctx.prisma.post.upsert({
			where: {
				id: postId
			},
			create: {
				id: postId,
				title,
				body,
				date: dateTime,
				contributors: {
					create: [
						{
							user: {
								connect: {
									id: userId
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
					create: media.map(m => ({
						...m,
						id: v4()
					}))
				}
			},
			update: {
				id: postId,
				title,
				body,
				date: dateTime,
				contributors: {
					upsert: [
						{
							where: {
								// eslint-disable-next-line camelcase
								postId_userId: {
									postId,
									userId
								}
							},
							create: {
								user: {
									connect: {
										id: userId
									}
								},
								userPostRole: {
									connect: {
										name: 'editor'
									}
								}
							},
							update: {
								userPostRole: {
									connect: {
										name: 'editor'
									}
								}
							}
						}
					]
				},
				media: {
					deleteMany: {
						postId,
						NOT: media.map(({id}) => ({id: id as string}))
					},
					upsert: media.map(m => ({
						where: {
							id: m.id as string
						},
						create: {
							...m,
							id: m.id as string
						},
						update: {
							...m,
							id: m.id as string
						}
					}))
				}
			},
			include: {contributors: true, media: true}
		}).then(post => {
			const {media} = post;
			const pubsub = new PubSub();
			const topic = pubsub.topic('image-save-topic');

			const data = {media, postId};

			topic.publishJSON(data, err => {
				if (err) {
					ctx.logger.error(`Failed to publish to topic: image-save-topic. Error: ${err.message}`);
				}
			});
			return {
				...post,
				date: post.date.toUTCString()
			};
		}).catch(err => {
			ctx.logger.error(err as Error);
			if (err.message.toLowerCase().includes('can\'t reach database server')) {
				return {
					message: 'Failed to create post',
					reason: 'Unknown'
				};
			}

			return {
				message: 'Failed to create post',
				reason: 'BadInput'
			};
		});
	}
});

export const PostConnection = createConnectionType(Post);

export const PostConnectionResponse = unionType({
	name: 'PostConnectionResponse',
	definition(t) {
		t.members('PostConnection', 'BadInput', 'Unauthorized', 'ServerError');
	},
	resolveType(item) {
		let __typename: 'BadInput' | 'Unauthorized' | 'PostConnection' | 'ServerError' | null = null;
		if ('message' in item && 'reason' in item) {
			__typename = resolveAlternateResponse(item as AlternateResponse);
		} else if ('edges' in item) {
			__typename = 'PostConnection';
		}

		if (__typename === null) {
			throw new Error('Could not resolve the type of data passed to union type "PostConnectionResponse"');
		}

		return Promise.resolve(__typename);
	}
});

export const postConnection = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('getPosts', {
			type: 'PostConnectionResponse',
			args: connectionArguments,
			async resolve(_root, args, _ctx) {
				let errorMessage = '';
				let errorReason: string | null = null;

				const {paginationArguments, sortArguments} = args;
				const {
					after,
					before,
					first,
					last
				} = paginationArguments || {};

				const {sortBy = 'createdAt', sortOrder = 'ASC'} = sortArguments || {};

				let beforePost: PostModel | null | undefined;
				let afterPost: PostModel | null | undefined;

				const ids = [];

				if (after) {
					if (validate(after)) {
						ids.push(after);
					} else {
						errorMessage += 'Provided value for after is not a valid uuid. ';
						errorReason = 'BadInput';
					}
				}

				if (before) {
					if (validate(before)) {
						ids.push(before);
					} else {
						errorMessage += 'Provided value for before is not a valid uuid.';
						errorReason = 'BadInput';
					}
				}

				if (errorReason) {
					return {
						reason: errorReason,
						message: errorMessage
					};
				}

				if (ids.length) {
					const posts = await prisma.post.findMany({
						where: {
							id: {in: [before, after].filter(Boolean) as string[]}
						}
					});
					beforePost = (before && posts.find(post => (post).id === before)) as PostModel | undefined;
					afterPost = (after && posts.find(post => post.id === after)) as PostModel | undefined;
					if (before && !beforePost) {
						return {
							reason: 'BadInput',
							message: 'before must be a valid cursor if passed'
						};
					}

					if (after && !afterPost) {
						return {
							reason: 'BadInput',
							message: 'after must be a valid cursor if passed'
						};
					}
				}

				if (!(before && after) && !(first || last)) {
					return {
						reason: 'BadInput',
						message: 'if neither before nor after are provided then at least one of first or last must be'
					};
				}

				if (beforePost || afterPost) {
					const validSortByByKeys = Object.keys((afterPost || beforePost) as PostModel).filter(key => key in ((beforePost || afterPost) as PostModel));

					if (!validSortByByKeys.includes(sortBy as string)) {
						return {
							reason: 'BadInput',
							message: `Invalid sortBy argument, valid options are: ${validSortByByKeys.join(', ')}`
						};
					}
				}

				const sortOrderToUse = last && !first ?
					sortOrder === 'DESC' ? 'ASC' : 'DESC' :
					sortOrder || 'asc';

				const queryParams: Prisma.PostFindManyArgs = {
					orderBy: {
						[(sortBy || 'createdAt') as string]: (sortOrderToUse).toLowerCase()
					}
				};

				if (beforePost || afterPost) {
					const where: Prisma.PostWhereInput = {
						AND: []
					};
					if (beforePost) {
						(where.AND as Prisma.PostWhereInput[]).push({
							[sortBy as string]: {
								[sortOrder === 'ASC' ? 'lt' : 'gt']: beforePost[sortBy as keyof PostModel]
							}
						});
					}

					if (afterPost) {
						(where.AND as Prisma.PostWhereInput[]).push({
							[sortBy as string]: {
								[sortOrder === 'ASC' ? 'gt' : 'lt']: afterPost[sortBy as keyof PostModel]
							}
						});
					}

					queryParams.where = where;
				}

				if (first || last) {
					queryParams.take = (first || last) as number;
				}

				const posts = await prisma.post.findMany(queryParams);

				if (last && !first) {
					posts.reverse();
				}

				return {
					edges: posts.map(p => ({
						node: p,
						cursor: p.id
					})),
					pageInfo: {
						startCursor: posts[0].id,
						endCursor: posts[posts.length - 1].id
					}
				};
			}
		});
	}
});
