import { escape } from '@w0s/html-escape';

/**
 * Converting message
 *   ${name} → File name
 *   ${size} → File size
 *
 * @param message - Message before conversion
 * @param file - File information selected with `<input type=file />`.`
 *
 * @returns Message after conversion
 */
export const convert = (message: string, file: File): string => {
	const { name, size } = file;

	return message.replaceAll(/\$\{name\}/gu, escape(name)).replaceAll(/\$\{size\}/gu, String(size));
};
