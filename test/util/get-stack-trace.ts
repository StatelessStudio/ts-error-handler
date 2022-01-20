/**
 * Get a stack trace
 *
 * @returns Returns the trace
 */
export function getStackTrace(): string {
	try {
		throw new Error();
	}
	catch (e) {
		return e.stack;
	}
}
