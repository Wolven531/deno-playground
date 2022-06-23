import type { ICountService, IMongoService } from '../types.d.ts';

export const executeHomePage = async (
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
		<a href="/graphql" target="_self">GraphQL Playground</a>
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

export const executeNotFoundPage = (req: Request): Promise<Response> => {
	const headers = new Headers();
	headers.set('content-type', 'text/html');

	const response = new Response(
		`<!DOCTYPE html>
<html>
	<head>
		<title>Anthony&apos;s Deno World - Page Not Found</title>
	</head>
	<body>
		<h1>Page Not Found</h1>
		<a href="/" target="_self">Return Home</a>
	</body>
</html>
`,
		{
			headers,
			status: 404,
		},
	);

	return Promise.resolve(response);
};
