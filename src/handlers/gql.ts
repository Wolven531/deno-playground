import { gql } from 'https://deno.land/x/graphql_tag@0.0.1/mod.ts';
import { makeExecutableSchema } from 'https://deno.land/x/graphql_tools@0.0.2/schema/makeExecutableSchema.ts';
import { GraphQLHTTP } from '../lightly-modified/http.ts';

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
