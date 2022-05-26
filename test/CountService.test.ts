import {
	assertEquals,
	assertExists,
	fail,
} from 'https://deno.land/std@0.140.0/testing/asserts.ts';
import { CountServiceFactory, ICountService } from '../src/CountService.ts';

Deno.test({
	name: 'execute w/ default ctor',
	fn(): void {
		let svc: ICountService;

		try {
			svc = CountServiceFactory();
		} catch (err: any) {
			fail('ctor should not throw error');
		}

		assertExists(svc, 'ctor should return an instance');
	},
});

Deno.test({
	name: 'addToCount() increases count',
	fn(): void {
		const svc: ICountService = CountServiceFactory();

		assertEquals(svc.getCount(), 0, 'count should be zero');

		svc.addToCount();

		assertEquals(svc.getCount(), 1, 'count should be one');

		svc.addToCount(3);

		assertEquals(svc.getCount(), 4, 'count should be four');
	},
});
