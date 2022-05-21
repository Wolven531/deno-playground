export interface INameService {
	/**
	 * Get the current name value
	 */
	getName: () => string;
	// name: string;
	/**
	 * Set the current name value
	 *
	 * @param {string} newName New value for the name
	 */
	setName: (newName: string) => void;
}

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
