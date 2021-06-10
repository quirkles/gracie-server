import {extendType, objectType, stringArg} from 'nexus';
import {Prisma} from '@prisma/client';

export const MediaO = objectType({
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
