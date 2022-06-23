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

	const text = JSON.stringify(pages, null, 4);

	const response = new Response(
		makeHtmlPage(
			'Home',
			`<h1>Welcome!</h1>
<a href="/graphql" target="_self">GraphQL Playground</a>
<h2>Page Analytics (from MongoDB)</h2>
<br/>
<textarea cols="80" rows="17">${text}</textarea>`,
		),
		{
			headers: makeHeaders(),
			status: 200,
		},
	);

	return Promise.resolve(response);
};

export const executeNotFoundPage = (req: Request): Promise<Response> => {
	const response = new Response(
		makeHtmlPage(
			'Page Not Found',
			`<h1>Page Not Found</h1>
<a href="/" target="_self">Return Home</a>`,
		),
		{
			headers: makeHeaders(),
			status: 404,
		},
	);

	return Promise.resolve(response);
};

const makeHeaders = (extraHeaders?: Record<string, string>): Headers => {
	const headers = new Headers();
	headers.set('content-type', 'text/html');

	if (extraHeaders) {
		Object.entries(extraHeaders).forEach(([headerName, headerValue]) => {
			headers.set(headerName, headerValue);
		});
	}

	return headers;
};

const makeHtmlPage = (title: string, content: string): string => {
	return `<!DOCTYPE html>
<html>
	<head>
		<title>Anthony&apos;s Deno World - ${title}</title>
	</head>
	<body>
${content}
	</body>
</html>
`;
};
