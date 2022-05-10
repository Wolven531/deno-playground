import { GraphQLHTTP } from 'https://deno.land/x/gql@1.1.1/mod.ts';
import { makeExecutableSchema } from 'https://deno.land/x/graphql_tools@0.0.2/mod.ts';
import { gql } from 'https://deno.land/x/graphql_tag@0.0.1/mod.ts';

const typeDefs = gql`
	type Query {
		hello: String
	}
`;

const resolvers = { Query: { hello: () => `Hello World!` } };

export const httpRequestHandler = (request: Request): Promise<Response> => {
	console.log(`handling request event - ${request.method} ${request.url}`);

	const { pathname } = new URL(request.url);

	if (pathname === '/graphql') {
		return gqlHandler(request);
	}

	const responseBody = 'Your user-agent is:\n\n'.concat(
		request.headers.get('user-agent') ?? 'Unknown',
	);

	const response = new Response(responseBody, { status: 200 });

	return Promise.resolve(response);
};

const gqlHandler = (request: Request): Promise<Response> => {
	return GraphQLHTTP<Request>({
		graphiql: true,
		schema: makeExecutableSchema({ resolvers, typeDefs }),
	})(request);
};
