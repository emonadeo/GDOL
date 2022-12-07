import { useRouteData } from '@solidjs/router';
import { Component, For, Match, Show, Switch } from 'solid-js';
import { Changelog, Level } from 'src/generated/openapi';
import { ChangelogData } from 'src/openapi';

import './page.scss';

import iconAdd from 'src/assets/icons/changelog/add.svg';
import iconDelete from 'src/assets/icons/changelog/delete.svg';
import iconLower from 'src/assets/icons/changelog/lower.svg';
import iconRaise from 'src/assets/icons/changelog/raise.svg';

const dict = {
	add: 'Added',
	move: 'Moved',
	delete: 'Archived',
};

// Undo the log changes to restore list before changes
// TODO: Maybe store this in the database changelog instead of recalculating every time?
function calcBefore(entry: Changelog): any[] {
	const list = entry.list.slice();
	if (entry.to) list.splice(entry.to - 1, 1);
	if (entry.from) list.splice(entry.from - 1, 0, entry.level);
	return list;
}

function getIcon(entry: Changelog): string {
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

const Page: Component = function () {
	const changelog = useRouteData<typeof ChangelogData>();

	return (
		<div class="page-changelog">
			<h1>Changelog</h1>
			<ol role="list" class="log">
				<For each={changelog()}>
					{(entry) => {
						const before = calcBefore(entry);
						const isAdd = entry.action === 'add';
						const isDelete = entry.action === 'delete';
						return (
							<>
								<li class="entry">
									<div class="date">
										<p class="mono">{new Date(entry.timestamp).toLocaleDateString()}</p>
									</div>
									<div class="summary">
										<p>
											{dict[entry.action]}
											<a href={`/level/${entry.level.id}`}>{entry.level.name}</a>
										</p>
									</div>
									<div class="changes">
										<Show when={entry.from != null && !isDelete}>
											<p class="from">#{entry.from}</p>
										</Show>
										<div class="icon">
											<img src={getIcon(entry)} alt="change" />
										</div>
										<p class="to">#{isDelete ? entry.from : entry.to}</p>
									</div>
									<div class="actions">
										<p />
									</div>
									<Show when={entry.reason || !isAdd}>
										<div class="details">
											<Show
												when={entry.reason}
												fallback={<p class="no-reason">No Reason specified</p>}
											>
												<p>
													<span>Reason: </span>
													<span>{entry.reason}</span>
												</p>
											</Show>
										</div>
									</Show>
									<div class="details-changes">
										<For
											each={
												isAdd
													? getChangeDetails(entry.list, entry.to!, true)
													: getChangeDetails(before, entry.from!, false)
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
																<p class="rank">#{rank + (isAdd ? entry.to! : entry.from!) - 1}</p>
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
											<img src={getIcon(entry)} alt="change" />
										</div>
										<For
											each={
												isDelete
													? getChangeDetails(before, entry.from!, true)
													: getChangeDetails(entry.list, entry.to!, false)
											}
										>
											{(change, i) => (
												<Switch
													fallback={(() => {
														const [level, rank] = change as [Level, number];
														return (
															<div class="after" classList={{ self: i() === 1 }}>
																<p class="rank">
																	#{rank + (isDelete ? entry.from! : entry.to!) - 1}
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
								</li>
							</>
						);
					}}
				</For>
			</ol>
		</div>
	);
};

export default Page;
