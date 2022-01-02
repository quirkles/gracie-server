import path from 'path';
import {GetSignedUrlConfig, Storage} from '@google-cloud/storage';
import {arg, enumType, extendType, inputObjectType, nonNull, objectType} from 'nexus';

import {IMAGE_BUCKET_NAME} from '../../config';

export const Media = objectType({
	name: 'Media',
	definition(t) {
		t.string('id');
		t.string('title');
		t.string('caption');
		t.nonNull.string('url');
		t.nonNull.field('type', {type: MediaType});
	}
});

export const GetUploadSignedUrlInput = inputObjectType({
	name: 'GetUploadSignedUrlInput',
	definition(t) {
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
				const {fileName} = input;
				const pathToCreds = path.join(__dirname, '../../creds/image-uploader.json');
				const storage = new Storage({keyFilename: pathToCreds});

				const bucket = storage.bucket(IMAGE_BUCKET_NAME);
				const file = bucket.file(fileName);
				const config: GetSignedUrlConfig = {
					version: 'v4',
					action: 'write',
					expires: Date.now() + (60 * 60 * 1000), // Expire it in an hour
					contentType: 'application/octet-stream'
				};

				let url: string;
				try {
					[url] = await file.getSignedUrl(config);
					return url;
				} catch (err) {
					ctx.logger.error(err as Error);
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

export const SaveMediaInput = inputObjectType({
	name: 'SaveMediaInput',
	definition(t) {
		t.string('id');
		t.string('title');
		t.string('caption');
		t.nonNull.string('url');
		t.nonNull.field('type', {type: MediaType});
	}
});
