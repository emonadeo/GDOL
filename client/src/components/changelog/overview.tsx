import { Component, createMemo, For, Show } from 'solid-js';
import { Level, LevelWithRank } from 'src/generated/openapi';
import { Changelog, ChangelogAction, getChangelogIcon } from 'src/util/changelog';

import './overview.scss';

interface ChangelogOverviewColumnProps {
	after: boolean;
	action: ChangelogAction;
	rank: number;
	list: Level[];
}

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

	const classList = createMemo(() => ({ after: props.after, before: !props.after }));

	const self = (rank: number) => {
		if (props.after && props.action === 'archive') return false;
		if (!props.after && props.action === 'add') return false;
		return rank === props.rank;
	};

	return (
		<>
			{/* Show "Top of List" */}
			<Show when={props.rank === 1}>
				<div class="top" classList={classList()}>
					<p class="type-label-md">Top of List</p>
				</div>
			</Show>
			{/* Show Levels / Leap */}
			<For each={slice()}>
				{(level) => (
					<Show keyed when={level} fallback={<div class="leap" classList={classList()} />}>
						{(level) => (
							<div classList={{ self: self(level.rank), ...classList() }}>
								<div class="stripe" />
								<p class="level">{level.name}</p>
								<p class="rank mono">#{level.rank}</p>
							</div>
						)}
					</Show>
				)}
			</For>
			{/* Show "End of List" */}
			<Show when={(self(props.rank) ? props.rank : props.rank - 1) === props.list.length}>
				<div class="bottom" classList={classList()}>
					<p class="type-label-md">End of List</p>
				</div>
			</Show>
		</>
	);
};

export const ChangelogOverview: Component<Changelog> = function (props) {
	const icon = createMemo<string>(() => getChangelogIcon(props));

	return (
		<div class="changelog-overview">
			<ChangelogOverviewColumn
				after={false}
				action={props.action}
				rank={props.action === 'add' ? props.to : props.from}
				list={props.before}
			/>
			<div class="icon">
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
