import { MongoClient } from 'https://deno.land/x/mongo@v0.30.0/src/client.ts';
import type { Database } from 'https://deno.land/x/mongo@v0.30.0/src/database.ts';
import type { IPage } from './types.d.ts';

export class MongoService {
	private client: MongoClient;

	constructor() {
		this.client = new MongoClient();
	}

	/**
	 * This method fetches all documents in the `pages` collection
	 */
	async fetchPages(): Promise<IPage[]> {
		let pages: IPage[] = [];

		try {
			const db = await this.getDbConnection();

			if (db === null) {
				return [];
			}

			const pagesCollection = db.collection<IPage>('pages');

			const results = pagesCollection.find({});

			pages = await results.toArray();
		} catch (err) {
			console.warn('Error getting pages', err);
		} finally {
			this.client.close();
		}

		return pages;
	}

	/**
	 * This method uses env vars to create a connection to a MongoDB instance. Returns null if connection fails
	 *
	 * Be sure to call `this.client.close()` when finished w/ the connection
	 */
	private getDbConnection(): Promise<Database | null> {
		const connStr = Deno.env.get('MONGO_CONNECTION_STRING') ?? '';
		const mongoDbName = Deno.env.get('MONGO_DATABASE') ?? '';
		const mongoPassword = Deno.env.get('MONGO_PASS') ?? '';
		const mongoUser = Deno.env.get('MONGO_USER') ?? '';
		const mongoHost = Deno.env.get('MONGO_CLUSTER') ?? '';

		console.info('Returning MongoDB connection');

		const conn = connStr.length > 0
			? this.client.connect(connStr) // connect to local Database
			: this.client.connect({ // connect to Mongo Atlas Database
				credential: {
					db: mongoDbName,
					mechanism: 'SCRAM-SHA-1',
					password: mongoPassword,
					username: mongoUser,
				},
				db: mongoDbName,
				servers: [
					{
						host: mongoHost,
						port: 27017,
					},
				],
				tls: true,
			});

		return conn.catch((err) => {
			console.warn('Error connecting to DB', err);

			return null;
		});
	}
}
