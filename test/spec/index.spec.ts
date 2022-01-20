import 'jasmine';
import { handler, setHandler, setupErrorHandling } from '../../src';

import { getStackTrace } from '../util/get-stack-trace';

describe('index', () => {
	it('sets stack trace to "Just My Code"', () => {
		setupErrorHandling({
			justMyCode: true
		});

		const trace = getStackTrace();

		expect(trace).toContain('get-stack-trace');
		expect(trace).not.toContain('node_modules');
		expect(trace).not.toContain('internal/');
	});

	it('allows setting an error handler', () => {
		let err = null;

		setHandler(e => err = e);
		handler(new Error('test error'));

		expect(err.message).toBe('test error');
	});

	it('allows setting handler function from setup', () => {
		const spy = { on: () => {} };
		spyOn(spy, 'on');

		setupErrorHandling({
			handler: spy.on
		});

		handler(new Error());

		expect(spy.on).toHaveBeenCalled();
	});
});
