import crypto from 'crypto';

const algorithm = 'aes-192-cbc';

const iv = Buffer.alloc(16, 0);

export const encrypt = (input: string): Promise<string> => new Promise((resolve, reject) => {
	const {APP_SECRET, APP_ENCRYPTION_SALT} = process.env;
	if (!APP_SECRET || !APP_ENCRYPTION_SALT) {
		reject(new Error('APP_SECRET amd APP_ENCRYPTION_SALT environment variables must be set'));
	} else {
		crypto.scrypt(APP_SECRET, APP_ENCRYPTION_SALT, 24, (scryptErr, key) => {
			if (scryptErr) {
				return reject(scryptErr);
			}

			const cipher = crypto.createCipheriv(algorithm, key, iv);
			let encrypted = '';
			cipher.setEncoding('hex');
			cipher.on('data', chunk => {
				encrypted += chunk;
			});
			cipher.on('end', () => {
				resolve(encrypted);
			});// Prints encrypted data with key

			cipher.write(input);
			cipher.end();
		});
	}
});

export const decrypt = (input: string): Promise<string> => new Promise(((resolve, reject) => {
	const {APP_SECRET, APP_ENCRYPTION_SALT} = process.env;
	if (!APP_SECRET || !APP_ENCRYPTION_SALT) {
		reject(new Error('APP_SECRET amd APP_ENCRYPTION_SALT environment variables must be set'));
	} else {
		crypto.scrypt(APP_SECRET, APP_ENCRYPTION_SALT, 24, (err, key) => {
			const decipher = crypto.createDecipheriv(algorithm, key, iv);

			let decrypted = '';
			decipher.on('readable', () => {
				let chunk = decipher.read();
				while (chunk !== null) {
					decrypted += chunk.toString('utf8');
					chunk = decipher.read();
				}
			});
			decipher.on('end', () => {
				resolve(decrypted);
			});

			// Encrypted with same algorithm, key and iv.
			decipher.write(input, 'hex');
			decipher.end();
		});
	}
}));
