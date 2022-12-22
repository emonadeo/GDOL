import { Level } from 'src/generated/openapi';

/**
 * Simulates adding a level to the list.
 * This only runs client-side and does not affect the database.
 * Primarily used to generate a changelog preview.
 * @param list The List before applying changes
 * @param level Level to add
 * @param to Rank to insert Level into
 * @param maxLength Maximum length of the List. Can be found in ListSettings
 * @returns
 */
export function simulateListAdd(
	list: Level[],
	level: Level,
	to: number,
	maxLength?: number
): Level[] {
	let after = [...list.slice(0, to - 1), level, ...list.slice(to - 1)];

	// Apply `max_length`
	if (maxLength !== undefined) {
		after = after.slice(0, maxLength);
	}

	return after;
}

/**
 * Simulates archiving a level from the list.
 * This only runs client-side and does not affect the database.
 * Primarily used to generate a changelog preview.
 * @param list The List before applying changes
 * @param from Rank to archive from
 */
export function simulateListArchive(list: Level[], from: number): Level[] {
	// TODO: Simulate `auto_unarchive` as set by ListSettings
	return list.filter((_, i) => i !== from - 1);
}

/**
 * Simulates moving a level on the list.
 * This only runs client-side and does not affect the database.
 * Primarily used to generate a changelog preview.
 * @param list The List before applying changes
 * @param from Rank to move from
 * @param to Rank to move to
 * @returns
 */
export function simulateListMove(list: Level[], from: number, to: number): Level[] {
	let after = list;

	// Remove from old position
	after = list.filter((_, i) => i !== from - 1);

	// Insert at new position
	// TODO: Undefined behavior if `from` is outside `list` bounds. Ignore for now.
	const level = list.at(from - 1) as Level;
	after.splice(to - 1, 0, level);

	return after;
}
