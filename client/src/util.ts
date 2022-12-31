/**
 * Extracts the Youtube Video ID from an URL
 *
 * Examples:
 * https://www.youtube.com/watch?v=dQw4w9WgXcQ -> dQw4w9WgXcQ
 * https://youtu.be/dQw4w9WgXcQ -> dQw4w9WgXcQ
 *
 * @param url YouTube URL
 */
export function getYoutubeIdFromUrl(url: string): string {
	// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
	return url.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/)?.[1] ?? '';
}

/**
 * Generate an embeddable URL from a YouTube video
 *
 * @param video YouTube URL of the video
 * @returns YouTube Embeddable URL (for iframes)
 */
export function embed(video: string): string {
	return `https://www.youtube.com/embed/${getYoutubeIdFromUrl(video)}`;
}

/**
 * Format a number to its ordinal representation
 *
 * Examples:
 * 1 -> st
 * 2 -> nd
 * 3 -> rd
 * 12 -> th
 * 16 -> th
 * 21 -> st
 *
 * @param num Number to format
 */
export function ordinal(num: number): string {
	// edge cases 11th, 12th and 13th
	const hundreds = num % 100;
	if (hundreds >= 11 && hundreds <= 13) return 'th';

	// 1st, 2nd, 3rd, Xth for everything else
	switch (num % 10) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
}
