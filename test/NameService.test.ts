import { assertExists, fail } from "https://deno.land/std@0.138.0/testing/asserts.ts";
// import * as assertions from "https://deno.land/std/testing/asserts.ts";
import { INameService, NameServiceFactory } from "../src/NameService.ts";

Deno.test({
	name: "execute w/ default ctor",
	fn(): void {
		let svc: INameService;

		try {
			svc = NameServiceFactory();
		} catch (err: any) {
			fail("ctor should not throw error");
		}

		assertExists(svc, "ctor should return an instance");
	},
});
