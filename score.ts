/**
 * Numbers of decimal digits to round to
 */
const scale = 3;

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} percentage Percentage of completion
 * @param {Number} rank Position on the list
 * @param {Number} requirement Minimum percentage required
 * @returns {Number}
 */
export function score(percentage: number, rank: number, requirement: number): number {
	if (rank > 150) {
		return 0;
	}
	if (rank > 75 && percentage < 100) {
		return 0;
	}
	let score =
		(-24.9975 * Math.pow(rank - 1, 0.4) + 200) *
		((percentage - (requirement - 1)) / (100 - (requirement - 1)));

	score = Math.max(0, score);

	if (percentage != 100) {
		return round(score - score / 3);
	}

	return round(Math.max(score, 0));
}

// TODO: Consider only allowing integer as score, to avoid floating point inaccuracies
export function round(num: number): number {
	if (!('' + num).includes('e')) {
		return +(Math.round(Number(num + 'e+' + scale)) + 'e-' + scale);
	} else {
		const arr = ('' + num).split('e');
		let sig = '';
		if (+arr[1] + scale > 0) {
			sig = '+';
		}
		return +(Math.round(Number(+arr[0] + 'e' + sig + (+arr[1] + scale))) + 'e-' + scale);
	}
}
