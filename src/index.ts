/**
 * Source map support
 */
if (!process[Symbol.for('ts-node.register.instance')]) {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	require('source-map-support').install({
		environment: 'node'
	});
}

/**
 * Global error handler
 */

/**
 * A handler function takes an Error and returns void
 */
export type HandlerFunction = (e: Error) => void;

/**
 * Default error handler
 *
 * @param e
 */
let _handler: HandlerFunction = (e: Error) => {
	// eslint-disable-next-line no-console
	console.error('Unhandled', e);
	process.exit(1);
};

export const handler: HandlerFunction = (e: Error) => _handler(e);

export function setHandler(f: HandlerFunction): void {
	_handler = f;
}

/**
 * Register global handler for uncaught errors
 */
process.on('uncaughtException', handler);
process.on('unhandledRejection', handler);

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
};

/**
 * Setup error handling
 *
 * @param options Options
 */
export function setupErrorHandling(options: Partial<ErrorHandlerOptions>) {
	options = { ...defaultOptions, ...options };

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

	if (options.handler) {
		setHandler(options.handler);
	}
}
