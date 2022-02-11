/**
 * Source map support
 */
if (!process[Symbol.for('ts-node.register.instance')]) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require('source-map-support').install({
		environment: 'node'
	});
}

import { HandlerFunction } from './handler-function';

/**
 * Options for setupErrorHandling
 */
export interface ErrorHandlerOptions {
	// Stack trace line-limit
	traceLimit: number,

	// Ignore node_modules and node internals?
	justMyCode: boolean,

	// Ignore node_modules (justMyCode must be true)
	justMyCodeIncludeNodeModules: boolean,

	// Ignore node internals? (justMyCode must be true)
	justMyCodeIncludeInternals: boolean,

	// Ignore javascript & compiled files?
	includeJsFiles: boolean,

	// Error handler
	handler?: HandlerFunction,
}

/**
 * Default options
 */
export const defaultOptions: ErrorHandlerOptions = {
	traceLimit: 100,
	justMyCode: true,
	justMyCodeIncludeNodeModules: false,
	justMyCodeIncludeInternals: false,
	includeJsFiles: false,

	// eslint-disable-next-line no-console
	handler: console.error
};

/**
 * Setup error handling
 *
 * @param options Options
 */
export function setupErrorHandling(options: Partial<ErrorHandlerOptions>) {
	options = { ...defaultOptions, ...options };

	/**
	 * Register global handler for uncaught errors
	 */
	process.on('uncaughtException', options.handler);
	process.on('unhandledRejection', options.handler);

	/**
	 * Stack traces
	 */
	// Set trace limit
	Error.stackTraceLimit = options.traceLimit;

	// Set traces to "Just My Code"
	if (options.justMyCode) {
		const nativePrepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace = (err, traces) => {
			return nativePrepareStackTrace(err, traces)
				.split('\n')
				.filter(line => {
					return (
						line &&
						(
							options.includeJsFiles ||
							!line.includes('.js')
						) &&
						(
							options.justMyCodeIncludeNodeModules ||
							!line.includes('node_modules')
						) &&
						(
							options.justMyCodeIncludeInternals ||
							!/internal\/[a-zA-Z]+/.test(line)
						)
					);
				})
				.map(line => line.replace('Object.<anonymous> ', ''))
				.join('\n');
		};
	}
}
