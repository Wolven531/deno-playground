import { assertEquals, assertExists, fail } from "https://deno.land/std@0.138.0/testing/asserts.ts";
import { INameService, NameServiceFactory } from "../src/NameService.ts";

Deno.test("execute w/ default ctor", () => {
	let svc: INameService;

	try {
		svc = NameServiceFactory();
	} catch (err: any) {
		fail("ctor should not throw error");
	}

	assertExists(svc, "ctor returns an instance");
});

Deno.test("execute w/ starting value", () => {
	const startingValue = "charmander";
	const svc = NameServiceFactory(startingValue);

	assertEquals(svc.getName(), startingValue, "getName() returns starting value");
});

Deno.test("setName()", () => {
	const updatedValue = "charmeleon";
	const svc = NameServiceFactory("charmander");

	svc.setName(updatedValue);

	assertEquals(svc.getName(), updatedValue, "getName() returns updated value");
});
