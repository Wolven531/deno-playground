import { MongoClient } from 'https://deno.land/x/mongo@v0.30.0/src/client.ts';
import type { Database } from 'https://deno.land/x/mongo@v0.30.0/src/database.ts';

export class MongoService {
	private client: MongoClient;

	constructor() {
		this.client = new MongoClient();
	}

	/**
	 * This method fetches all documents in the `pages` collection
	 */
	async fetchPages(): Promise<Record<string, unknown>[]> {
		try {
			const db = await this.getDbConnection();

			const pagesCollection = db.collection('pages');

			const results = pagesCollection.find({});

			const pages = await results.toArray();

			this.client.close();

			return pages;
		} catch (err) {
			console.warn(
				`Error connecting to DB`,
				err,
			);

			return [];
		}
	}

	/**
	 * This method uses env vars to create a connection to a MongoDB instance.
	 *
	 * Be sure to call `this.client.close()` when finished w/ the connection
	 */
	private getDbConnection(): Promise<Database> {
		const connStr = Deno.env.get('MONGO_CONNECTION_STRING') ?? '';
		const mongoDbName = Deno.env.get('MONGO_DATABASE') ?? '';
		const mongoPassword = Deno.env.get('MONGO_PASS') ?? '';
		const mongoUser = Deno.env.get('MONGO_USER') ?? '';
		const mongoHost = Deno.env.get('MONGO_CLUSTER') ?? '';

		return connStr.length > 0
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
	}
}
