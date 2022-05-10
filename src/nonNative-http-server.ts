console.log('Hello, Deno!');

const serveHttp = async (conn: Deno.Conn) => {
	// This "upgrades" a network connection into an HTTP connection
	const httpConn = Deno.serveHttp(conn);

	// Each request sent over the HTTP connection will be yielded as an async
	// iterator from the HTTP connection
	for await (const requestEvent of httpConn) {
		console.log(
			`handling request event - ${requestEvent.request.method} ${requestEvent.request.url}`,
		);

		// The native HTTP server uses the web standard `Request` and `Response` objects
		const body = `Your user-agent is:\n\n${
			requestEvent.request.headers.get('user-agent') ?? 'Unknown'
		}`;

		// use requestEvent's `.respondWith()` method to send response to client
		requestEvent.respondWith(
			new Response(body, {
				status: 200,
			}),
		);
	}
};

const env = Deno.env.toObject();

// const PORT = parseInt(Deno.env.get("PORT") ?? "8080");
const PORT = parseInt(env.PORT ?? '8080');
const server = Deno.listen({ port: PORT });

console.log(`HTTP webserver running. Access it at: http://localhost:${PORT}`);

// Connections to the server will be yielded up as an async iterable
for await (const conn of server) {
	console.log('serving an http connection...');
	// to NOT block, handle each connection individually without awaiting the function
	serveHttp(conn);
}
