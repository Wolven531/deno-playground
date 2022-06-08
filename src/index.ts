import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts';
import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';
import { httpRequestHandler } from './handlers.ts';

console.info('About to fire config() to load env vars');

try {
	// !!! wrapped in try/catch - works locally, not using Deno Deploy
	config({
		allowEmptyValues: true,
		export: true,
		// Note that the safe option prevents startup w/o proper env config
		// safe: true
	});
} catch (err) {
	console.warn(
		'Missing env vars',
		err,
	);
}

const env = Deno.env.toObject();
const PORT = parseInt(env.PORT ?? '8080');

console.log(
	`Starting HTTP webserver; access it at http://localhost:${PORT}`,
);

await serve(httpRequestHandler, { port: PORT });
