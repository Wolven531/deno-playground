import { MongoClient } from 'https://deno.land/x/mongo@v0.30.0/src/client.ts';

export class MongoService {
	private client: MongoClient;
	private connectionString: string;

	constructor(connectionAddress: string) {
		this.client = new MongoClient();
		this.connectionString = connectionAddress;
	}

	async fetchPages() {
		console.info(
			`[fetchPages] this.connectionString="${this.connectionString}"`,
		);

		try {
			const db = await this.client.connect(this.connectionString);

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
}

// const mongoHost = Deno.env.get('MONGO_CLUSTER') ?? '';
// const mongoDbName = Deno.env.get('MONGO_DATABASE') ?? '';
// const mongoUser = Deno.env.get('MONGO_USER') ?? '';
// const mongoPassword = Deno.env.get('MONGO_PASS') ?? '';

// Connecting to a Mongo Atlas Database
// await client.connect({
// 	credential: {
// 		db: mongoDbName,
// 		mechanism: 'SCRAM-SHA-1',
// 		password: mongoPassword,
// 		username: mongoUser,
// 	},
// 	db: mongoDbName,
// 	servers: [
// 		{
// 			host: mongoHost,
// 			port: 27017,
// 		},
// 	],
// 	tls: true,
// });
