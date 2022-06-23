import {
	assertEquals,
	assertExists,
	fail,
} from 'https://deno.land/std@0.140.0/testing/asserts.ts';
import { NameServiceFactory } from '../src/services/NameService.ts';
import type { INameService } from '../src/types.d.ts';

Deno.test('execute w/ default ctor', () => {
	let svc: INameService;

	try {
		svc = NameServiceFactory();
	} catch (err: unknown) {
		fail('ctor should not throw error');
	}

	assertExists(svc, 'ctor returns an instance');
});

Deno.test('execute w/ starting value', () => {
	const startingValue = 'charmander';
	const svc = NameServiceFactory(startingValue);

	assertEquals(
		svc.getName(),
		startingValue,
		'getName() returns starting value',
	);
});

Deno.test('setName()', () => {
	const updatedValue = 'charmeleon';
	const svc = NameServiceFactory('charmander');

	svc.setName(updatedValue);

	assertEquals(
		svc.getName(),
		updatedValue,
		'getName() returns updated value',
	);
});
