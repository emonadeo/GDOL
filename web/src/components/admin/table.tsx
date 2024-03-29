import { createMemo, For, Show } from 'solid-js';

import {
	table,
	table_action,
	table_add,
	table_body_cell,
	table_body_cell_action,
	table_body_cell_add,
	table_body_row,
	table_body_row_add,
	table_head,
	table_head_cell,
	table_head_row,
	table_number,
} from './table.css.ts';

import { label_large, mono, title_small } from 'src/styles/atomic/typography.css.ts';

export type AdminTableAction = {
	label: string;
	icon: string;
	onClick: (index: number) => void;
};

type AdminTableColumnString = {
	identifier: 'string';
	type: string;
};

type AdminTableColumnNumber = {
	identifier: 'number';
	type: number;
};

type AdminTableColumn = AdminTableColumnString | AdminTableColumnNumber;

export type AdminTableProps<T extends Record<string, AdminTableColumn>> = {
	columns: Record<keyof T, { name: keyof T; type: T[keyof T]['identifier'] }>;
	rows: Array<Record<keyof T, T[keyof T]['type']>>;
	actions?: AdminTableAction[];
	onAdd?: (index: number) => void;
};

export const AdminTable = function <const T extends Record<string, AdminTableColumn>>(
	props: AdminTableProps<T>
) {
	const columns = createMemo(() => Object.keys(props.columns));
	return (
		<table class={table}>
			<thead class={table_head}>
				<tr class={table_head_row}>
					{/* insert empty cell for actions */}
					<Show when={props.actions} keyed>
						{(actions) => <th class={table_head_cell} colspan={actions.length} />}
					</Show>
					{/* item properties */}
					<For each={columns()}>
						{(col) => (
							<th class={table_head_cell}>
								<p class={title_small}>{props.columns[col]?.name}</p>
							</th>
						)}
					</For>
				</tr>
			</thead>
			<tbody>
				<For each={props.rows}>
					{(row, i) => (
						<>
							{/* add */}
							<Show when={props.onAdd} keyed>
								{(onAdd) => (
									<tr class={table_body_row_add}>
										<td
											class={table_body_cell_add}
											colspan={(props.actions?.length ?? 0) + columns().length}
										>
											<button class={table_add} onClick={() => onAdd(i())} />
										</td>
									</tr>
								)}
							</Show>
							{/* item */}
							<tr class={table_body_row}>
								{/* item actions */}
								<For each={props.actions}>
									{(action) => (
										<td class={table_body_cell_action}>
											<button
												class={`${table_action} ${label_large}`}
												onClick={() => action.onClick(i())}
											>
												<img src={action.icon} alt={action.label} />
											</button>
										</td>
									)}
								</For>
								{/* item columns */}
								<For each={columns()}>
									{(col) => (
										<td class={table_body_cell}>
											{() => {
												const item = row[col];
												const isNumber = typeof item === 'number';
												return (
													<p
														classList={{
															[table_number]: isNumber,
															[mono]: isNumber,
														}}
													>
														{item}
													</p>
												);
											}}
										</td>
									)}
								</For>
							</tr>
						</>
					)}
				</For>
			</tbody>
		</table>
	);
};
