import path from 'path';
import {GetSignedUrlConfig, Storage} from '@google-cloud/storage';
import {arg, enumType, extendType, inputObjectType, mutationField, nonNull, objectType} from 'nexus';

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

export const GetUploadSignedUrlInput = inputObjectType({
	name: 'GetUploadSignedUrlInput',
	definition(t) {
		t.nonNull.string('bucketName');
		t.nonNull.string('fileName');
	}
});

export const GetUploadSignedUrl = extendType({
	type: 'Query',
	definition(t) {
		t.nonNull.field('getUploadSignedUrl', {
			args: {
				input: arg({type: nonNull(GetUploadSignedUrlInput)})
			},
			type: 'String',
			async resolve(_root, args, ctx) {
				const {input} = args;
				const {fileName, bucketName} = input;
				const pathToCreds = path.join(__dirname, '../../creds/image-uploader.json');
				const storage = new Storage({keyFilename: pathToCreds});

				const bucket = storage.bucket(bucketName);
				const file = bucket.file(fileName);

				const config: GetSignedUrlConfig = {
					action: 'write',
					expires: Date.now() + (60 * 60 * 1000) // Expire it in an hour
				};

				let url: string;
				try {
					[url] = await file.getSignedUrl(config);
					return url;
				} catch (err) {
					ctx.logger.error(err);
					return '';
				}
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
