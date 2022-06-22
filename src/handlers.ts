import { gql } from 'https://deno.land/x/graphql_tag@0.0.1/mod.ts';
import { makeExecutableSchema } from 'https://deno.land/x/graphql_tools@0.0.2/schema/makeExecutableSchema.ts';
import { CountServiceFactory } from './CountService.ts';
import { GraphQLHTTP } from './lightly-modified/http.ts';
import type { IMongoService } from './types.d.ts';

const resolvers = { Query: { hello: () => `Hello World!` } };
const typeDefs = gql`
	type Query {
		hello: String
	}
`;

const gqlMiddleware = await GraphQLHTTP<Request>({
	graphiql: true,
	schema: makeExecutableSchema({ resolvers, typeDefs }),
});
const countSvc = CountServiceFactory();

export const httpRequestHandler = async (
	request: Request,
	mongoSvc: IMongoService,
): Promise<Response> => {
	countSvc.addToCount();
	const reqNum = countSvc.getCount();

	console.log(
		`handling request event #${reqNum} - ${request.method} ${request.url}`,
	);

	const { pathname } = new URL(request.url);

	if (pathname === '/graphql') {
		return gqlHandler(request);
	}

	if (pathname === '/' && request.method === 'GET') {
		const pages = await mongoSvc.fetchPages();

		const headers = new Headers();
		headers.set('content-type', 'text/html');

		const response = new Response(
			`
	<!DOCTYPE html>
	<html>
		<head>
			<title>Anthony&apos;s Deno World</title>
		</head>
		<body>
			<h1>Welcome!</h1>
			<a href="/graphql" target="_self" re>GraphQL Playground</a>
			<h2>Page Analytics (from MongoDB)</h2>
			<br/>
			<textarea cols="80" rows="17">${
				JSON.stringify(pages, null, 4)
			}</textarea>
			</body>
	</html>
	`,
			{ headers, status: 200 },
		);

		return Promise.resolve(response);
	}

	const responseBody = `Req #${reqNum}: Your user-agent is:\n\n`.concat(
		request.headers.get('user-agent') ?? 'Unknown',
	);

	const response = new Response(responseBody, { status: 200 });

	return Promise.resolve(response);
};

const gqlHandler = (request: Request): Promise<Response> => {
	return gqlMiddleware(request);
};
