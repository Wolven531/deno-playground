import { serve } from 'https://deno.land/std@0.133.0/http/server.ts';

console.log('Hello, Deno!');

const handler = (request: Request): Response => {
	console.log(`handling request event - ${request.method} ${request.url}`);

	const body = 'Your user-agent is:\n\n'.concat(
		request.headers.get('user-agent') ?? 'Unknown',
	);

	return new Response(body, { status: 200 });
};

const env = Deno.env.toObject();

// const PORT = parseInt(Deno.env.get("PORT") ?? "8080");
const PORT = parseInt(env.PORT ?? '8080');

console.log(`Starting HTTP webserver; access it at: http://localhost:${PORT}`);

await serve(handler, { port: PORT });
