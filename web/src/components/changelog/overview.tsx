import { ChangelogListLevel } from '@gdol/node';
import { Component, createMemo, For, Show } from 'solid-js';

import {
	after,
	before,
	bottom,
	leap,
	level_name,
	overview,
	overview_icon,
	rank,
	stripe,
	top,
	self,
	row,
} from './overview.css.ts';

import { label_medium, mono } from 'src/styles/atomic/typography.css.ts';
import { Changelog, ChangelogAction, getChangelogIcon } from 'src/util/changelog.ts';

type LevelWithRank = ChangelogListLevel & {
	rank: number;
};

type ChangelogOverviewColumnProps = {
	after: boolean;
	action: ChangelogAction;
	rank: number;
	list: ChangelogListLevel[];
};

const ChangelogOverviewColumn: Component<ChangelogOverviewColumnProps> = function (props) {
	const slice = createMemo<Array<LevelWithRank | undefined>>(() => {
		const listWithRank: Array<LevelWithRank | undefined> = props.list.map((lvl, i) => ({
			...lvl,
			rank: i + 1,
		}));
		if ((!props.after && props.action === 'add') || (props.after && props.action === 'archive')) {
			listWithRank.splice(props.rank - 1, 0, undefined);
		}
		const start = Math.max(props.rank - 2, 0);
		const end = Math.min(props.rank, props.list.length) + 1;
		return listWithRank.slice(start, end);
	});

	const classList = createMemo(() => ({ [after]: props.after, [before]: !props.after }));

	const isSelf = (rank: number) => {
		if (props.after && props.action === 'archive') return false;
		if (!props.after && props.action === 'add') return false;
		return rank === props.rank;
	};

	return (
		<>
			{/* Show "Top of List" */}
			<Show when={props.rank === 1}>
				<div class={top} classList={classList()}>
					<p class={label_medium}>Top of List</p>
				</div>
			</Show>
			{/* Show Levels / Leap */}
			<For each={slice()}>
				{(level) => (
					<Show keyed when={level} fallback={<div class={leap} classList={classList()} />}>
						{(level) => (
							<div class={row} classList={{ [self]: isSelf(level.rank), ...classList() }}>
								<div class={stripe} />
								<p class={level_name}>{level.name}</p>
								<p class={`${rank} ${mono}`}>#{level.rank}</p>
							</div>
						)}
					</Show>
				)}
			</For>
			{/* Show "End of List" */}
			<Show when={(isSelf(props.rank) ? props.rank : props.rank - 1) === props.list.length}>
				<div class={bottom} classList={classList()}>
					<p class={label_medium}>End of List</p>
				</div>
			</Show>
		</>
	);
};

export const ChangelogOverview: Component<Changelog> = function (props) {
	const icon = createMemo<string>(() => getChangelogIcon(props));

	return (
		<div class={overview}>
			<ChangelogOverviewColumn
				after={false}
				action={props.action}
				rank={props.action === 'add' ? props.to : props.from}
				list={props.before}
			/>
			<div class={overview_icon}>
				<img src={icon()} alt="change" />
			</div>
			<ChangelogOverviewColumn
				after={true}
				action={props.action}
				rank={props.action === 'archive' ? props.from : props.to}
				list={props.after}
			/>
		</div>
	);
};
