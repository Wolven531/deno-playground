import { assertEquals, assertExists, fail } from "https://deno.land/std@0.138.0/testing/asserts.ts";
// import * as assertions from "https://deno.land/std/testing/asserts.ts";
// import { ICountService, CountServiceFactory } from "../src/CountService.ts";
import * as CountService from "../src/CountService.ts";

Deno.test({
	name: "execute w/ default ctor",
	fn(): void {
		let svc: CountService.ICountService;

		try {
			svc = CountService.CountServiceFactory();
		} catch (err: any) {
			fail("ctor should not throw error");
		}

		assertExists(svc, "ctor should return an instance");
	},
});

Deno.test({
	name: "addToCount() increases count",
	fn(): void {
		let svc: CountService.ICountService;

		svc = CountService.CountServiceFactory();

		assertEquals(svc.getCount(), 0, "count should be zero");

		svc.addToCount();

		assertEquals(svc.getCount(), 1, "count should be one");

		svc.addToCount(3);

		assertEquals(svc.getCount(), 4, "count should be four");
	},
});
