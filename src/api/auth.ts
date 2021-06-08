import jwt from 'jsonwebtoken';

export interface IJwtPayload {
    id: string
}

export const getToken = (payload: IJwtPayload): string => {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		throw new Error('No JWT_SECRET env var set. Cannot sign jwt.');
	}

	return jwt.sign(payload, jwtSecret, {expiresIn: '60d'});
};

export const verifyToken = (token: string): IJwtPayload => {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		throw new Error('No JWT_SECRET env var set. Cannot decode jwt.');
	}

	return jwt.verify(token, jwtSecret) as IJwtPayload;
};
