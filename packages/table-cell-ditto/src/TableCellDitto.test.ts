import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import TableCellDitto from './TableCellDitto.ts';

describe('正常系', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<table class="js-table-cell-ditto">
	<thead>
		<tr>
			<th>header cell</th>
			<th>header cell</th>
		</tr>
	</thead>
	<tbody>
		<tr>
		</tr>
	</tbody>
</table>
`,
		);
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('convert', () => {
		new TableCellDitto(document.querySelector('.js-table-cell-ditto')!).convert();

		/* TODO: <td> の幅取得のテストを行うには canvas 関連の環境整備が必要 */

		expect(document.body.innerHTML).toBe(`
<table class="js-table-cell-ditto">
	<thead>
		<tr>
			<th>header cell</th>
			<th>header cell</th>
		</tr>
	</thead>
	<tbody>
		<tr>
		</tr>
	</tbody>
</table>
`);
	});

	test('unConvert', () => {
		new TableCellDitto(document.querySelector('.js-table-cell-ditto')!).unConvert();

		/* TODO: <td> の幅取得のテストを行うには canvas 関連の環境整備が必要 */

		expect(document.body.innerHTML).toBe(`
<table class="js-table-cell-ditto">
	<thead>
		<tr>
			<th>header cell</th>
			<th>header cell</th>
		</tr>
	</thead>
	<tbody>
		<tr>
		</tr>
	</tbody>
</table>
`);
	});
});

describe('異常系', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('<tbody> が存在しない', () => {
		document.body.insertAdjacentHTML('beforeend', '<table class="js-table-cell-ditto"></table>');

		expect(() => {
			new TableCellDitto(document.querySelector('.js-table-cell-ditto')!);
		}).toThrow('Table body cell does not exist in the specified table.');
	});
});
