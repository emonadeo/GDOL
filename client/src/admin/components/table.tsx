import { createMemo, For, JSX, Show } from 'solid-js';

import { table, tableAction, tableAddRow } from 'src/admin/components/table.module.scss';

export interface AdminTableAction {
	label: string;
	icon: string;
	onClick: (index: number) => void;
}

export interface AdminTableProps<T extends Record<string, JSX.Element>> {
	rows: T[];
	head: Record<keyof T, string>;
	actions?: AdminTableAction[];
	onAdd?: (index: number) => void;
}

export const AdminTable = function <T extends Record<string, JSX.Element>>(
	props: AdminTableProps<T>
) {
	const columns = createMemo(() => Object.keys(props.head));
	return (
		<table class={table}>
			<thead>
				<tr>
					<Show when={props.actions} keyed>
						{(actions) => <th colspan={actions.length} />}
					</Show>
					<For each={columns()}>
						{(col) => (
							<th>
								<p class="type-title-sm">{props.head[col]}</p>
							</th>
						)}
					</For>
				</tr>
			</thead>
			<tbody>
				<For each={props.rows}>
					{(row, i) => (
						<>
							<Show when={props.onAdd} keyed>
								{(onAdd) => (
									<tr class={tableAddRow} onClick={() => onAdd(i())}>
										<td colspan={columns().length} />
									</tr>
								)}
							</Show>
							<tr>
								<For each={props.actions}>
									{(action) => (
										<td class={tableAction}>
											<button class="type-label-lg" onClick={() => action.onClick(i())}>
												<img src={action.icon} alt={action.label} />
											</button>
										</td>
									)}
								</For>
								<For each={columns()}>
									{(col) => (
										<td>
											<p>{row[col]}</p>
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
