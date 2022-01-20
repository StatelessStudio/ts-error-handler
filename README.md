# ts-error-handler

This package enhances typescript error handling, meaning easier troubleshooting and debugging!

- Source mapping
- Customizable stack traces
- Set stack trace limit
- Set stack trace to "Just my Code"
- Provides a overridable global error handler

## Setup

**Install**

`npm i ts-error-handler`

**Usage**

```typescript
import { setupErrorHandling, handler } from 'ts-error-handler';

// Setup error handling options
setupErrorHandling({
	justMyCode: true,
	handler: (e) => console.error('Error!', e)
})

// Example:
try {
	// Throw an error
	throw new Error('Help!');
}
catch (e) {
	// Send the error to the handler
	handler(e);
}
```

**With ts-async-bootstrap**

```typescript
import { bootstrap } from 'ts-async-bootstrap';
import { setupErrorHandling, handler } from 'ts-error-handler';

import { register, main } from './somewhere-else';

// Setup error handling
setupErrorHandling({
	handler: (e) => console.error('Error!', e)
});

// Pass handler from ts-error-handler to bootstrap()
bootstrap({
	register: register,
	run: main,
	errorHandler: handler
});
```

## Options


**traceLimit**

Set how long the stack trace is, in lines. Default is 100

**justMyCode**

Set to true to show only local code in stack traces (no node-modules or node-internals)

**justMyCodeIncludeNodeModules**

Set to true to show node-modules in stack traces when justMyCode is on

**justMyCodeIncludeInternals**

Set to true to show node-internals in stack traces when justMyCode is on
