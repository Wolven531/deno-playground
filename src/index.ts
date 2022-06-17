import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts';
import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';
import { delay } from 'https://deno.land/std@0.140.0/async/delay.ts';
// import { Timeout, TimeoutError } from 'https://deno.land/x/timeout/mod.ts';
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

const attemptDb = (
	attemptNum: number,
	stall: number,
): Promise<Database | null> => {
	console.log(
		`Try #${attemptNum + 1} - ${
			new Date().getTime()
		} - About to attempt connection`,
	);

	// no Timeout on first try
	const optionalTimeout = attemptNum === 0
		// ? Promise.resolve()
		? delay(stall)
		: delay(stall);

	return optionalTimeout.then(() => {
		return mongoSvc.getDbConnection().then((connDb) => {
			console.log(
				`Try #${attemptNum + 1} - ${
					new Date().getTime()
				} - Received DB connection`,
			);

			return connDb;
		});
	});
};

const waitForDb = (): Promise<void> => {
	console.log('Setting up mongo instance');

	return new Promise<void>((resolve) => {
		// deno-lint-ignore ban-untagged-todo
		// TODO - fix retry logic
		// const maxTries = 1;
		const stall = 1 * 1000;
		const currentTry = 0;
		// let db: Database | null = null;

		// do {
		return attemptDb(currentTry, stall)
			.then((/* connDb */) => {
				// db = connDb;

				return mongoSvc.init();
			})
			.then(resolve)
			// .then(() => {
			// return db;
			// })
			.catch((err) => {
				console.log(
					`Try #${currentTry + 1} - ${
						new Date().getTime()
					} - Failed to connect, waiting ${stall} ms, then retrying`,
					err,
				);

				return null;
			});

		// 	currentTry++;
		// } while (!db && currentTry < maxTries);

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
		// if (!db) {
		// 	reject('could not connect to DB');
		// }
		// }
	});
};

await waitForDb()
	.then(() => {
		console.log(
			`Starting HTTP webserver; access it at http://localhost:${PORT}`,
		);

		return serve(
			(req) => {
				return httpRequestHandler(req, mongoSvc);
			},
			{ port: PORT },
		);
	})
	.then(() => {
		console.log('when does this happen?');
	})
	.catch((err) => {
		console.warn('Top level DB error -', err);
	});
