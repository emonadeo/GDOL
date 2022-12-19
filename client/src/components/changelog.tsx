import { Component, createMemo, For, JSX, Show } from 'solid-js';
import { Changelog, Level, LevelWithRank } from 'src/generated/openapi';

import iconAdd from 'src/assets/icons/changelog/add.svg';
import iconDelete from 'src/assets/icons/changelog/delete.svg';
import iconNoChange from 'src/assets/icons/changelog/no_change.svg';
import iconLower from 'src/assets/icons/changelog/lower.svg';
import iconRaise from 'src/assets/icons/changelog/raise.svg';

import './changelog.scss';

interface ListChangeColumnProps {
	after: boolean;
	action: Changelog['action'];
	rank: number;
	list: Level[];
}

const ListChangeColumn: Component<ListChangeColumnProps> = function (props) {
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

interface ListChangeProps {
	action: Changelog['action'];
	from?: number;
	to?: number;
	level: Level;
	before: Level[];
	after: Level[];
}

export const ListChange: Component<ListChangeProps> = function (props) {
	const icon = createMemo<string>(() => {
		switch (props.action) {
			case 'add':
				return iconAdd;
			case 'archive':
				return iconDelete;
			case 'move':
				if ((props.to as number) === (props.from as number)) return iconNoChange;
				return (props.to as number) > (props.from as number) ? iconLower : iconRaise;
		}
	});

	return (
		<div class="list-change">
			<ListChangeColumn
				after={false}
				action={props.action}
				rank={(props.action === 'add' ? props.to : props.from) as number}
				list={props.before}
			/>
			<div class="icon">
				<img src={icon()} alt="change" />
			</div>
			<ListChangeColumn
				after={true}
				action={props.action}
				rank={(props.action === 'archive' ? props.from : props.to) as number}
				list={props.after}
			/>
		</div>
	);
};
