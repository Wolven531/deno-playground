import type { INameService } from './types.d.ts';

/**
 * This function returns an instance of INameService
 *
 * @param {string | undefined} startingName Optional value w/ which to start the instance
 */
export const NameServiceFactory: (startingName?: string) => INameService = (
	startingName,
) => {
	let currentName = startingName ?? '';

	return {
		getName: () => currentName,
		// name: currentName,
		setName: (newName: string) => {
			currentName = newName;
		},
	};
};

export default NameServiceFactory;
