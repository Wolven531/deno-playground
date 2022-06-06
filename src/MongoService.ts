import { MongoClient } from 'https://deno.land/x/mongo@v0.30.0/mod.ts';

export class MongoService {
	private client: MongoClient;
	private connectionString: string;

	constructor() {
		this.client = new MongoClient();

		// Connecting to a Local Database
		this.connectionString = Deno.env.get('MONGO_CONNECTION_STRING') ?? '';
	}

	async fetchPages() {
		const db = await this.client.connect(this.connectionString);

		const pagesCollection = db.collection('pages');

		const results = pagesCollection.find({});

		const pages = await results.toArray();

		return pages;
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
