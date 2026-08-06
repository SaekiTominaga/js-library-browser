import { describe, expect, test } from '@jest/globals';
import TableCellDitto from './TableCellDitto.ts';

describe('constructor', () => {
	test('<tbody> does not exist', () => {
		document.body.innerHTML = '<table class="js-table-cell-ditto"></table>';

		expect(() => {
			new TableCellDitto(document.querySelector('.js-table-cell-ditto')!);
		}).toThrow('Table body cell does not exist in the specified table.');
	});
});
