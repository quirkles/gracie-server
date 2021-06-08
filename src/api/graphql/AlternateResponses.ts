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

export type AlternateResponseReason = 'BadInput' | 'Unauthorized'

export interface AlternateResponse {
	message: string;
	reason: AlternateResponseReason;
}

export const resolveAlternateResponse = (alternateResponse: AlternateResponse): AlternateResponseReason => {
	switch (alternateResponse.reason) {
		case 'BadInput':
			return 'BadInput';
		case 'Unauthorized':
			return 'Unauthorized';
		default:
			throw new Error(`Unknown alternate response: ${alternateResponse.reason}`);
	}
};
