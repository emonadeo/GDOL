import { Changelog, ChangelogAction, ChangelogLevel } from '@gdol/node';
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
	row,
	self,
	stripe,
	top,
} from './overview.css.ts';

import { label_medium, mono } from 'src/styles/atomic/typography.css.ts';
import { getChangelogIcon } from 'src/util/changelog.ts';

type ChangelogLevelWithRank = ChangelogLevel & {
	rank: number;
};

type ChangelogOverviewColumnProps = {
	after: boolean;
	action: ChangelogAction;
	rank: number;
	list: ChangelogLevel[];
};

const ChangelogOverviewColumn: Component<ChangelogOverviewColumnProps> = function (props) {
	const slice = createMemo<Array<ChangelogLevelWithRank | undefined>>(() => {
		const listWithRank: Array<ChangelogLevelWithRank | undefined> = props.list.map((lvl, i) => ({
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

	const classList = createMemo(() => ({
		[after]: props.after,
		[before]: !props.after,
	}));

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

export type ChangelogOverviewProps = {
	changelog: Changelog;
};

export const ChangelogOverview: Component<ChangelogOverviewProps> = function (props) {
	const icon = createMemo<string>(() => getChangelogIcon(props.changelog));

	return (
		<div class={overview}>
			<ChangelogOverviewColumn
				after={false}
				action={props.changelog.action}
				rank={props.changelog.action === 'add' ? props.changelog.to : props.changelog.from}
				list={props.changelog.listBefore}
			/>
			<div class={overview_icon}>
				<img src={icon()} alt="change" />
			</div>
			<ChangelogOverviewColumn
				after={true}
				action={props.changelog.action}
				rank={props.changelog.action === 'archive' ? props.changelog.from : props.changelog.to}
				list={props.changelog.listAfter}
			/>
		</div>
	);
};
