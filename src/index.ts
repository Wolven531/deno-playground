import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts';
// import { opine } from 'https://deno.land/x/opine@2.2.0/mod.ts';
import type { Database } from 'https://deno.land/x/mongo@v0.30.0/src/database.ts';
import { delay } from 'https://deno.land/std@0.140.0/async/delay.ts';
import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';
import { readAllSync } from 'https://deno.land/std@0.140.0/streams/mod.ts';
import {
	executeHomePage,
	executeNotFoundPage,
	gqlHandler,
} from './handlers/index.ts';
import { CountServiceFactory, MongoService } from './services/index.ts';

if (Deno.env.get('DENO_ENV') === 'local') {
	// !!! wrapped in if + try/catch - works locally, not using Deno Deploy
	try {
		config({
			allowEmptyValues: true,
			export: true,
			// Note that the safe option prevents startup w/o proper env config
			// safe: true
		});
	} catch (err) {
		console.warn(
			'[index.ts] Missing env vars',
			err,
		);
	}
}

// env-related constants
const env = Deno.env.toObject();
const PORT = parseInt(env.PORT ?? '8080');

// SIPD (Single Instance Per Deno) constants
const countSvc = CountServiceFactory();
const mongoSvc = new MongoService();

const attemptDb = (
	attemptNum: number,
	stall: number,
): Promise<Database | null> => {
	console.log(
		`[attemptDb] Try #${
			attemptNum + 1
		} - ${Date.now()} - About to attempt connection`,
	);

	// deno-lint-ignore ban-untagged-todo
	// TODO - once retry works: no Timeout on first try
	// const optionalTimeout = attemptNum === 0
	// 	? delay(0)
	// 	: delay(stall);

	return delay(stall)
		.then(() => mongoSvc.getDbConnection())
		.then((connDb) => {
			console.log(
				`[attemptDb] Try #${
					attemptNum + 1
				} - ${Date.now()} - Received DB connection`,
			);

			return connDb;
		});
};

const waitForDb = (): Promise<void> => {
	console.log('[waitForDb] Setting up mongo instance');

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
					`[waitForDb] Try #${
						currentTry + 1
					} - ${Date.now()} - Failed to connect, waiting ${stall} ms, then retrying`,
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
		// 				Date.now()
		// 			} - About to attempt connection`,
		// 		);

		// 		db = await mongoSvc.getDbConnection();
		// 	} catch (err) {
		// 		const stallMillis = 2 * 1000;

		// 		console.log(
		// 			`Try #${retries + 1} - ${
		// 				Date.now()
		// 			} - Failed to connect, waiting ${stallMillis} ms, then retrying`,
		// 			err,
		// 		);

		// 		await Timeout.wait(stallMillis);

		// 		// await new Promise<void>((resolve) => {
		// 		// 	setTimeout(() => {
		// 		// 		console.log(
		// 		// 			`${Date.now()} - finished stall`,
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
		const HOST = '0.0.0.0'; // default is '0.0.0.0'
		const hostWin = 'localhost'; // Win browsers access '0.0.0.0' as 'localhost'

		console.log(
			`[index.ts] Starting app; access it at http://${hostWin}:${PORT}`,
		);

		// const app = opine();

		// app.get('/', (req, res, next) => {
		// 	res.locals.title = 'Home';
		// 	res.send('Hello World');
		// });

		// const server = app.listen(
		// 	{
		// 		hostname: HOST,
		// 		port: PORT,
		// 	},
		// );

		// console.log(
		// 	'[index.ts] Server is available on '.concat(
		// 		JSON.stringify(server.addrs, null, 2).replaceAll( // replacement for Win compat
		// 			HOST,
		// 			hostWin,
		// 		),
		// 		' 🚀',
		// 	),
		// );

		return serve(
			(req) => {
				console.log(
					`[index.ts] Handling request ${req.method} ${req.url}`,
				);

				const { pathname } = new URL(req.url);

				switch (pathname) {
					case '/':
						return mongoSvc.addToPageCount('home').then(() =>
							executeHomePage(req, mongoSvc, countSvc)
						);
					case '/favicon.ico': {
						const headers = new Headers();
						headers.set('content-type', 'image/x-icon');
						// headers.set('content-type', 'image/png');

						const file = Deno.openSync('favicon.ico', {
							read: true,
						});
						const faviconData = readAllSync(file);

						Deno.close(file.rid);

						return new Response(faviconData, {
							headers,
							status: 200,
						});
					}
					case '/graphql':
						return mongoSvc.addToPageCount('gql-playground').then(
							() => gqlHandler(req),
						);
					default:
						return executeNotFoundPage(req);
				}
			},
			{
				hostname: HOST,
				port: PORT,
			},
		);
	})
	.catch((err) => {
		console.warn('[index.ts] Top level error -', err);
	});
