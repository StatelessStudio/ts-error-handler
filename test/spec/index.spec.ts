import 'jasmine';
import { setupErrorHandling } from '../../src';

import { getStackTrace } from '../util/get-stack-trace';

describe('index', () => {
	it('sets stack trace to "Just My Code"', () => {
		setupErrorHandling({
			justMyCode: true,
			includeJsFiles: true,
		});

		const trace = getStackTrace();

		expect(trace).toContain('get-stack-trace');
		expect(trace).not.toContain('node_modules');
		expect(trace).not.toContain('internal/');
	});

	it('allows filtering of .js extension', () => {
		setupErrorHandling({
			justMyCode: true,
			includeJsFiles: false,
		});

		const trace = getStackTrace();

		expect(trace).not.toContain('.js');
	});
});
