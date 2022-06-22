import { gql } from 'https://deno.land/x/graphql_tag@0.0.1/mod.ts';
import { makeExecutableSchema } from 'https://deno.land/x/graphql_tools@0.0.2/schema/makeExecutableSchema.ts';
import { GraphQLHTTP } from './lightly-modified/http.ts';
import type { ICountService, IMongoService } from './types.d.ts';

const resolvers = { Query: { hello: () => `Hello World!` } };
const typeDefs = gql`
	type Query {
		hello: String
	}
`;

// create instance of GQL middleware to re-use in GQL handler
const gqlMiddleware = await GraphQLHTTP<Request>({
	graphiql: true,
	schema: makeExecutableSchema({ resolvers, typeDefs }),
});

export const gqlHandler = (request: Request): Promise<Response> => {
	return gqlMiddleware(request);
};

export const httpRequestHandler = async (
	request: Request,
	mongoSvc: IMongoService,
	countSvc: ICountService,
): Promise<Response> => {
	countSvc.addToCount();
	const reqNum = countSvc.getCount();

	console.log(
		`handling request event #${reqNum} - ${request.method} ${request.url}`,
	);

	const pages = await mongoSvc.fetchPages();

	const headers = new Headers();
	headers.set('content-type', 'text/html');

	const text = JSON.stringify(pages, null, 4);

	const response = new Response(
		`<!DOCTYPE html>
<html>
	<head>
		<title>Anthony&apos;s Deno World</title>
	</head>
	<body>
		<h1>Welcome!</h1>
		<a href="/graphql" target="_self" re>GraphQL Playground</a>
		<h2>Page Analytics (from MongoDB)</h2>
		<br/>
		<textarea cols="80" rows="17">${text}</textarea>
		</body>
</html>
`,
		{
			headers,
			status: 200,
		},
	);

	return Promise.resolve(response);
};
