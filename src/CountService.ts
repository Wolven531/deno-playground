import type { ICountService } from './types.d.ts';

/**
 * This function returns an instance of ICountService
 *
 * @param {number | undefined} startingCount Optional value w/ which to start the instance (default = 0)
 */
export const CountServiceFactory: (startingCount?: number) => ICountService = (
	startingCount = 0,
) => {
	let count = startingCount;

	return {
		addToCount: (incrementAmount = 1) => {
			count += incrementAmount;
		},
		getCount: () => count,
	};
};
