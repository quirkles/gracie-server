import {objectType} from 'nexus';

export const BadInput = objectType({
	name: 'BadInput',
	definition(t) {
		t.string('message');
		t.string('reason');
	}
});

export const Unauthorized = objectType({
	name: 'Unauthorized',
	definition(t) {
		t.string('message');
		t.string('reason');
	}
});

export const ServerError = objectType({
	name: 'ServerError',
	definition(t) {
		t.string('message');
		t.string('reason');
	}
});

export type AlternateResponseType = 'BadInput' | 'Unauthorized' | 'ServerError'
export type AlternateResponseReason = 'BadInput' | 'Unauthorized' | 'Unknown'

export interface AlternateResponse {
	message: string;
	reason: AlternateResponseReason;
}

export const resolveAlternateResponse = (alternateResponse: AlternateResponse): AlternateResponseType => {
	switch (alternateResponse.reason) {
		case 'BadInput':
			return 'BadInput';
		case 'Unauthorized':
			return 'Unauthorized';
		case 'Unknown':
			return 'ServerError';
		default:
			throw new Error(`Unknown alternate response: ${alternateResponse.reason}`);
	}
};
