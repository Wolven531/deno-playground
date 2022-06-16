import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts';
import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';
import { Timeout, TimeoutError } from 'https://deno.land/x/timeout/mod.ts';
import { httpRequestHandler } from './handlers.ts';
import { MongoService } from './MongoService.ts';
import type { Database } from 'https://deno.land/x/mongo@v0.30.0/src/database.ts';

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

const attemptDb = (attemptNum: number): Promise<Database | null> => {
	console.log(
		`Try #${attemptNum + 1} - ${
			new Date().getTime()
		} - About to attempt connection`,
	);

	// const stallMillis = 2 * 1000;
	const stallMillis = 5 * 1000; // initial delay that runs every time
	// no Timeout on first try
	const optionalTimeout = attemptNum === 0
		// ? Promise.resolve()
		? Timeout.wait(stallMillis)
		: Timeout.wait(stallMillis);

	return optionalTimeout.then(() => {
		return mongoSvc.getDbConnection().then((connDb) => {
			console.log(
				`Try #${attemptNum + 1} - ${
					new Date().getTime()
				} - Received DB connection`,
			);

			return connDb;
		});
	}).catch((err) => {
		console.log(
			`Try #${attemptNum + 1} - ${
				new Date().getTime()
			} - Failed to connect, waiting ${stallMillis} ms, then retrying`,
			err,
		);

		return null;
	});
};

const waitForDb = (): Promise<void> => {
	console.log('Setting up mongo instance');

	return new Promise<void>((resolve, reject) => {
		// deno-lint-ignore ban-untagged-todo
		const maxAttempts = 1; // TODO - fix retry logic
		let retries = 0;
		let db;

		do {
			attemptDb(retries)
				.then((connDb) => {
					db = connDb;
					console.log('Running MongoService init()');

					return mongoSvc.init();
				})
				.then(resolve)
				.catch(() => {
					return;
				})
				.finally(() => {
				});

			retries++;
		} while (!db && retries < maxAttempts);

		// for (let retries = 0; retries < maxAttempts; retries++) {
		// 	try {
		// 		console.log(
		// 			`Try #${retries + 1} - ${
		// 				new Date().getTime()
		// 			} - About to attempt connection`,
		// 		);

		// 		db = await mongoSvc.getDbConnection();
		// 	} catch (err) {
		// 		const stallMillis = 2 * 1000;

		// 		console.log(
		// 			`Try #${retries + 1} - ${
		// 				new Date().getTime()
		// 			} - Failed to connect, waiting ${stallMillis} ms, then retrying`,
		// 			err,
		// 		);

		// 		await Timeout.wait(stallMillis);

		// 		// await new Promise<void>((resolve) => {
		// 		// 	setTimeout(() => {
		// 		// 		console.log(
		// 		// 			`${new Date().getTime()} - finished stall`,
		// 		// 		);
		// 		// 		resolve();
		// 		// 	}, stallMillis);
		// 		// });

		// 		// await new Promise<number>((resolve) => {
		// 		// 	const cleanId = setTimeout(() => {
		// 		// 		resolve(cleanId);
		// 		// 	}, stallMillis);
		// 		// });
		// 	}
		// }

		// if (db) {
		// console.log('Running MongoService init()');

		// mongoSvc.init().then(() => {
		// 	resolve();
		// });
		// } else {
		if (!db) {
			reject('could not connect to DB');
		}
		// }
	});
};

await waitForDb().catch((err) => {
	console.warn('Top level DB error -', err);
});

console.log(`Starting HTTP webserver; access it at http://localhost:${PORT}`);

await serve(
	(req) => {
		return httpRequestHandler(req, mongoSvc);
	},
	{ port: PORT },
);
