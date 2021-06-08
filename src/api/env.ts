import * as fs from 'fs';
import * as path from 'path';
import * as rl from 'readline';

const pathToEnv = path.join(__dirname, '../../', '.env');

const envVarsToSet = ['JWT_SECRET'];

const handleLine = (line: string): void => {
	const trimmed = line.trim();
	if (trimmed.charAt(0) === '#' || !trimmed.length) {
		return;
	}

	setEnvVarFromLine(line);
};

const setEnvVarFromLine = (line: string): void => {
	const re = /^([^=]+)=(.*)$/;
	const matches = line.match(re);
	if (matches) {
		const name = matches[1];
		const value = matches[2];
		if (envVarsToSet.includes(name)) {
			// process.env[name] = value;
		}
	}
};

export const loadEnvFile = async (): Promise<void> => new Promise((res, rej) => {
	const readStream = fs.createReadStream(pathToEnv, {encoding: 'utf-8'});
	const readline = rl.createInterface({input: readStream});
	readline.on('line', handleLine);
	readline.on('close', () => {
		res();
	});
});
