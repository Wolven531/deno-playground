// / <reference no-default-lib="true"/>
import { serve } from 'https://deno.land/std@0.133.0/http/mod.ts';
// import { Handler, Server } from "https://deno.land/std@0.133.0/http/server.ts";
// import {   } from "https://deno.land/std@0.133.0/async/mod.ts";
// import {   } from "https://deno.land/std@0.133.0/io/mod.ts";
// import {   } from "https://deno.land/std@0.133.0/node/module_esm.ts";
// import {   } from "https://deno.land/std@0.133.0/";
import { router } from 'https://crux.land/router@0.0.11';
import React from 'https://esm.sh/react';
import { renderToString } from 'https://esm.sh/react-dom/server';

const render = (component: React.ReactElement) =>
	new Response(renderToString(<App>{component}</App>), { status: 200 });

serve(
	router(
		{
			'/': () => render(<Landing />),
			'/bagels': () => render(<Bagels />),
			'/stats': () => render(<Stats />),
		},
		() => render(<NotFound />),
	),
);

function App({
	children,
}: {
	children?: React.ReactElement | React.ReactElement[];
}) {
	return (
		<div className='min-h-screen'>
			<NavBar />
			{children}
		</div>
	);
}

function NavBar() {
	return (
		<nav className='font-sans flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-4 px-6 bg-white shadow sm:items-baseline w-full'>
			<div className='mb-2 sm:mb-0'>
				<a
					href='/'
					className='text-2xl no-underline hover:text-indigo-800'
				>
					The Bagel Company
				</a>
			</div>
			<div>
				<a
					href='/stats'
					className='text-lg no-underline hover:text-indigo-800 ml-3'
				>
					Stats
				</a>
				<a
					href='/bagels'
					className='text-lg no-underline hover:text-indigo-800 ml-3'
				>
					Bagels
				</a>
			</div>
		</nav>
	);
}

function Landing() {
	return (
		<div className='flex justify-center items-center'>
			<div className='max-w-7xl py-12 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between'>
				<h2 className='text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl'>
					<span className='block'>Ready to dive in?</span>
					<span className='block text-indigo-600'>
						Find your bagel today.
					</span>
				</h2>
				<div className='mt-8 flex lg:mt-0 lg:flex-shrink-0 lg:ml-8'>
					<div className='inline-flex rounded-md shadow'>
						<a
							href='/bagels'
							className='inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
						>
							{' '}
							Get started{' '}
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

function Stats() {
	const stats = [
		{ name: 'Total Sales', stat: '41,897' },
		{ name: 'Available Bagels', stat: '357' },
		{ name: 'Avg. Open Rate', stat: '94.16%' },
	];

	return (
		<div className='p-5'>
			<h3 className='text-lg leading-6 font-medium text-gray-900'>
				Last 30 days
			</h3>
			<dl className='mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3'>
				{stats.map((item) => (
					<div
						key={item.name}
						className='px-4 py-5 shadow rounded-lg bg-white overflow-hidden sm:p-6'
					>
						<dt className='text-sm font-medium text-gray-500 truncate'>
							{item.name}
						</dt>
						<dd className='mt-1 text-3xl font-semibold text-gray-900'>
							{item.stat}
						</dd>
					</div>
				))}
			</dl>
		</div>
	);
}

const bagels = [
	{
		name: 'Salmon Bagel',
		price: 5.39,
		image:
			'https://images.unsplash.com/photo-1592767049184-0fda840ae4e7?w=1080',
	},
	{
		name: 'Cream Cheese Bagel',
		price: 2.49,
		image:
			'https://images.unsplash.com/photo-1585841393012-e4ded4a6e2d0?w=1080',
	},
	{
		name: 'Bacon and Rucola Bagel',
		price: 4.19,
		image:
			'https://images.unsplash.com/photo-1603712469481-e25f0bdb63aa?w=1080',
	},
	{
		name: 'Egg and Ham Bagel',
		price: 3.79,
		image:
			'https://images.unsplash.com/photo-1605661479369-a8859129827b?w=1080',
	},
	{
		name: 'Jam Bagel',
		price: 3.0,
		image:
			'https://images.unsplash.com/photo-1579821401035-450188d514da?w=1080',
	},
	{
		name: 'Bagel Sandwich with Egg, Ham, Tomato, Lettuce & Mayo',
		price: 6.0,
		image:
			'https://images.unsplash.com/photo-1627308595325-182f10f20126?w=1080',
	},
];

function Bagels() {
	return (
		<div className='mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24'>
			<div className='space-y-4 mb-12 lg:mb-8'>
				<h2 className='text-4xl font-extrabold tracking-tight sm:text-4xl'>
					Find the right bagel for yourself!
				</h2>
			</div>
			<div className='grid grid-cols-1 gap-y-10 items-center sm:grid-cols-3 gap-x-6 lg:grid-cols-4 xl:grid-cols-4 xl:gap-x-8'>
				{bagels.map((bagel) => (
					<div key={bagel.name} className='group'>
						<div className='w-full bg-gray-200 rounded-lg overflow-hidden'>
							<img
								src={bagel.image}
								className='w-full h-full object-center object-cover group-hover:opacity-75'
								alt=''
							/>
						</div>
						<h3 className='mt-4 text-sm text-gray-700'>
							{bagel.name}
						</h3>
						<p className='mt-1 text-lg font-medium text-gray-900'>
							${bagel.price.toFixed(2)}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

function NotFound() {
	return (
		<div className='min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8'>
			<div className='max-w-max mx-auto'>
				<main className='sm:flex'>
					<p className='text-4xl font-extrabold text-indigo-600 sm:text-5xl'>
						404
					</p>
					<div className='sm:ml-6'>
						<div className='sm:border-l sm:border-gray-200 sm:pl-6'>
							<h1 className='text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl'>
								Page not found
							</h1>
							<p className='mt-1 text-base text-gray-500'>
								Please check the URL in the address bar and try
								again.
							</p>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
