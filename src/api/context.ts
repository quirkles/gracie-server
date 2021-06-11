import {PrismaClient} from '@prisma/client';
import pino, {destination, Logger} from 'pino';
import {join} from 'path';
import {Request} from 'express';
import {v4 as uuid} from 'uuid';

import {prisma} from './prisma';
import {IJwtPayload, verifyToken} from './auth';

export interface Context {
	session: IJwtPayload | null
    prisma: PrismaClient
    logger: Logger
}

const logFileName = process.env.ENV === 'local' ? 'log' : new Date().toISOString();

const logPath = join(__dirname, '../../', `logs/${logFileName}.log`);

const loggerOpts = {
	name: 'gql-logger'
};

export const baseLogger = pino(loggerOpts, destination(logPath));

export const baseContext: Pick<Context, 'prisma'> = {
	prisma
};

export const createContext = ({req} : {req: Request}): Context => {
	const requestId = uuid();
	const {headers, url, method, body} = req;
	if (body.operationName !== 'IntrospectionQuery') {
		baseLogger.info({headers, url, method, body, requestId}, 'Received request');
	}

	let session: IJwtPayload | null = null;
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.length) {
		try {
			const token = authHeader.split('Bearer ')[1];
			session = verifyToken(token);
		} catch (err) {
			baseLogger.error(err, 'Failed to verify jwt');
		}
	}

	const logger = baseLogger.child({requestId, session});
	return {
		...baseContext,
		logger,
		session
	};
};
