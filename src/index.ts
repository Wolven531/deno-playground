import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts';
import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';
import { httpRequestHandler } from './handlers.ts';
import { MongoService } from './MongoService.ts';

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
const mongoSvc = new MongoService();

console.log('Setting up mongo instance');

const maxAttempts = 10;
let db;

for (let retries = 0; retries < maxAttempts; retries++) {
	try {
		console.log(`Try #${retries + 1} - About to attempt connection`);
		db = await mongoSvc.getDbConnection();
	} catch (err) {
		console.log(
			`Try #${
				retries + 1
			} - Failed to connect, waiting one second and retrying`,
			err,
		);

		await new Promise<number>((resolve) => {
			const cleanId = setTimeout(() => {
				resolve(cleanId);
			}, 1000);
		});
	}
}

if (db) {
	console.log('Running MongoService init()');

	await mongoSvc.init();
}

console.log(`Starting HTTP webserver; access it at http://localhost:${PORT}`);

await serve(
	(req) => {
		return httpRequestHandler(req, mongoSvc);
	},
	{ port: PORT },
);
