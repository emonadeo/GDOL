import { Component, For, Switch, Match, createMemo } from 'solid-js';
import { Changelog, Level } from 'src/generated/openapi';

import './listChange.scss';

import iconAdd from 'src/assets/icons/changelog/add.svg';
import iconDelete from 'src/assets/icons/changelog/delete.svg';
import iconLower from 'src/assets/icons/changelog/lower.svg';
import iconRaise from 'src/assets/icons/changelog/raise.svg';

export function getIcon(entry: Changelog): string {
	switch (entry.action) {
		case 'add':
			return iconAdd;
		case 'delete':
			return iconDelete;
		case 'move':
			return entry.to! > entry.from! ? iconLower : iconRaise;
	}
}

type ChangeMarker = 'begin' | 'end' | 'gradient';

/**
 * Cursed function, but it works pretty well.
 * Assembles the visualization for the list changes.
 * Inserting Begin/End Markers or Gradients where necessary, while maintaining proper Indexes.
 */
function getChangeDetails(
	list: Level[],
	rank: number,
	addOrDelete: boolean
): Array<[Level, number] | ChangeMarker> {
	// Rank is assumed to be withing list bounds
	const sublist: Array<Level | 'begin' | 'end'> = list.slice(Math.max(rank - 2, 0), rank + 1);
	if (rank === 1) sublist.unshift('begin');
	else if (rank === list.length) sublist.push('end');

	if (addOrDelete) {
		sublist.splice(1, 1);
	}

	const res: Array<[Level, number] | ChangeMarker> = sublist.map((lvl, i) =>
		lvl === 'begin' || lvl === 'end' ? lvl : [lvl, i]
	);

	if (addOrDelete) {
		res.splice(1, 0, 'gradient');
	}

	return res;
}

interface ListChangeProps {
	entry: Changelog;
}

export const ListChange: Component<ListChangeProps> = function (props) {
	return (
		<div class="details-changes">
			<For
				each={
					props.entry.action === 'add'
						? getChangeDetails(props.entry.list, props.entry.to!, true)
						: getChangeDetails(props.entry.list_before, props.entry.from!, false)
				}
			>
				{(change, i) => (
					<Switch
						fallback={(() => {
							const [level, rank] = change as [Level, number];
							return (
								<div class="before" classList={{ self: i() === 1 }}>
									<div class="stripe" />
									<p class="level">{level.name}</p>
									<p class="rank">
										#
										{rank +
											(props.entry.action === 'add' ? props.entry.to! : props.entry.from!) -
											1}
									</p>
								</div>
							);
						})()}
					>
						<Match when={change === 'gradient'}>
							<div class="before gradient" />
						</Match>
						<Match when={change === 'begin'}>
							<div class="before begin">
								<p class="type-label-md">Top of List</p>
							</div>
						</Match>
						<Match when={change === 'end'}>
							<div class="before end">
								<p class="type-label-md">End of List</p>
							</div>
						</Match>
					</Switch>
				)}
			</For>
			<div class="icon">
				<img src={getIcon(props.entry)} alt="change" />
			</div>
			<For
				each={
					props.entry.action === 'delete'
						? getChangeDetails(props.entry.list_before, props.entry.from!, true)
						: getChangeDetails(props.entry.list, props.entry.to!, false)
				}
			>
				{(change, i) => (
					<Switch
						fallback={(() => {
							const [level, rank] = change as [Level, number];
							return (
								<div class="after" classList={{ self: i() === 1 }}>
									<p class="rank">
										#
										{rank +
											(props.entry.action === 'delete' ? props.entry.from! : props.entry.to!) -
											1}
									</p>
									<p class="level">{level.name}</p>
									<div class="stripe" />
								</div>
							);
						})()}
					>
						<Match when={change === 'gradient'}>
							<div class="after gradient" />
						</Match>
						<Match when={change === 'begin'}>
							<div class="after begin">
								<p class="type-label-md">Top of List</p>
							</div>
						</Match>
						<Match when={change === 'end'}>
							<div class="after end">
								<p class="type-label-md">End of List</p>
							</div>
						</Match>
					</Switch>
				)}
			</For>
		</div>
	);
};
